import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import axios from 'axios'
import { getAssetDecimals } from '../../utils/getAssetDecimals'
import { getFeePriceByAsset, InteractionMultipliers } from '../../utils/interaction_pricing/getFeePriceByAsset'
import { getAlgodConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { WecoopDaoClient } from '../clients/WecoopDaoClient'

const algodServer = getAlgodConfigFromViteEnvironment().server
const algodToken = getAlgodConfigFromViteEnvironment().token
const algodPort = getAlgodConfigFromViteEnvironment().port

const algod = new algosdk.Algodv2(algodToken as AlgodTokenHeader, algodServer, algodPort)

const wecoopDaoAppId = Number(import.meta.env.VITE_WECOOP_POLL_APP_ID)

export const createAppClient = (senderAddress: string, signer: TransactionSigner, algod: AlgodClient) => {
  const appClient = new WecoopDaoClient(
    {
      resolveBy: 'id',
      id: wecoopDaoAppId,
      sender: { addr: senderAddress, signer },
    },
    algod,
  )
  algokit.Config.configure({ populateAppCallResources: true })
  return appClient
}

export const makePoll = async (
  appClient: WecoopDaoClient,
  sender: string,
  signer: TransactionSigner,
  amount: number,
  expires_in: number,
  assetId: number,
  pollQuestion: string,
  pollId: number,
  creator_address: string,
  country: string,
  depositedAmount: number,
) => {
  const { appAddress } = await appClient.appClient.getAppReference()

  const expires_in_ms = expires_in * 86400

  const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: 3_450,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  const xferFirstDeposit = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
    assetIndex: assetId,
  })

  const assetDecimals = await getAssetDecimals(algod, assetId)

  const amountToDeposit = await getFeePriceByAsset(assetId, assetDecimals, InteractionMultipliers.CreatePoll)

  const platformFeeTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    amount: Math.floor(Number(amountToDeposit) * 1000000),
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
    assetIndex: assetId,
  })

  try {
    const result = await appClient.createPoll(
      {
        mbrTxn: boxMBRPayment,
        axfer: xferFirstDeposit,
        question: pollQuestion,
        country: country,
        expires_in: expires_in_ms,
        platformFeeTxn,
      },
      { sender: { addr: sender, signer }, boxes: [algosdk.decodeAddress(sender).publicKey] },
    )

    // Dynamically create the poll data
    const pollData = {
      pollId: pollId,
      creator_address: creator_address,
      text: pollQuestion,
      timestamp: Math.floor(new Date().getTime() / 1000),
      expiry_timestamp: Math.floor(new Date().getTime() + expires_in_ms) / 1000 + 100,
      country: country,
      depositedAmount: depositedAmount,
      assetId: assetId,
      totalVotes: 0,
      yesVotes: 0,
      status: 'accepted',
      type: 'poll',
    }

    // Dynamic axios request
    await axios.post(`${import.meta.env.VITE_WECOOP_API}/polls/create`, pollData)
  } catch (error) {
    console.error('error creating poll', error)
  }
}

export const makeVote = async (
  appClient: WecoopDaoClient,
  algodClient: AlgodClient,
  pollId: number,
  sender: string,
  signer: TransactionSigner,
  asset: number,
  inFavor: boolean,
  pollCreator: string,
) => {
  try {
    const { appAddress } = await appClient.appClient.getAppReference()

    const suggestedParams = await algokit.getTransactionParams(undefined, algod)

    const assetDecimals = await getAssetDecimals(algodClient, asset)

    const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: appAddress,
      amount: 3_450,
      suggestedParams: await algokit.getTransactionParams(undefined, algod),
    })

    const baseVotePrice = await getFeePriceByAsset(asset, assetDecimals, InteractionMultipliers.VotePoll)

    const pollDepositMultiplier = 2
    const pollDepositPrice = Math.floor(baseVotePrice! * pollDepositMultiplier * 10 ** assetDecimals)
    console.log('poll deposits', pollDepositPrice)

    // Create the asset funding transaction (axfer)
    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
      to: appAddress,
      amount: pollDepositPrice,
      assetIndex: asset,
    })

    const platformMultiplier = 1
    const platformFeePrice = Math.floor(baseVotePrice! * platformMultiplier! * 10 ** assetDecimals)

    console.log('poll deposit', platformFeePrice)
    //User pays 1.5 cents to the platform in order to vote
    const platformFeeTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
      to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
      amount: platformFeePrice!,
      assetIndex: asset,
    })

    //User pays 2 times the platform fee to the poll creator in order to vote
    const pollCreatorMultiplier = 2
    const pollCreatorPrice = Math.floor(baseVotePrice! * 10 ** pollCreatorMultiplier)

    console.log('poll deposit', pollCreatorPrice)
    const pollCreatorPaymentTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
      to: pollCreator,
      amount: pollCreatorPrice,
      assetIndex: asset,
    })

    const voteData = {
      pollId: pollId,
      voterAddress: sender,
      claimed: false,
      in_favor: inFavor,
      deposited_amount: pollDepositPrice,
    }

    // Dynamic axios request
    await axios.post(`${import.meta.env.VITE_WECOOP_API}/polls/vote`, voteData)

    const result = await appClient.makeVote(
      { pollId: [pollId], axfer, mbrTxn, inFavor, platrformFeeTxn: platformFeeTxn, creatorFeeTxn: pollCreatorPaymentTxn },
      { sender: { addr: sender, signer } },
    )
  } catch (error) {
    console.error('error', error)
  }
}

export const withdrawPollShare = async (appClient: WecoopDaoClient, pollId: number, sender: string, signer: TransactionSigner) => {
  try {
    const result = await appClient.withdrawPollShare(
      { pollId: [pollId] },
      {
        sender: { addr: sender, signer },
        sendParams: {
          fee: algokit.microAlgos(3_000),
        },
      },
    )

    await axios.patch(`${import.meta.env.VITE_WECOOP_API}/polls/${sender}/${pollId}/claim`)

    return result
  } catch (error) {
    return error
  }
}
