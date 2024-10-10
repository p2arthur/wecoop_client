import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import axios from 'axios'
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
  pollId: number, // Pass pollId dynamically
  creator_address: string, // Pass creator address dynamically
  country: string, // Pass country dynamically
  depositedAmount: number, // Pass deposited amount dynamically
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

  try {
    const result = await appClient.createPoll(
      {
        mbrTxn: boxMBRPayment,
        axfer: xferFirstDeposit,
        question: pollQuestion,
        country: country,
        expires_in: expires_in_ms,
      },
      { sender: { addr: sender, signer }, boxes: [algosdk.decodeAddress(sender).publicKey] },
    )

    // Dynamically create the poll data
    const pollData = {
      pollId: pollId,
      creator_address: creator_address,
      text: pollQuestion,
      timestamp: Date.now() / 100,
      expiry_timestamp: (Date.now() + Number(expires_in_ms)) / 100,
      country: country,
      depositedAmount: depositedAmount,
      assetId: assetId,
      totalVotes: 0,
      yesVotes: 0,
      status: 'accepted',
      type: 'poll',
    }

    console.log('poll data', pollData)

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
) => {
  const { appAddress } = await appClient.appClient.getAppReference()

  const suggestedParams = await algokit.getTransactionParams(undefined, algod)

  console.log('suggested prams', suggestedParams.lastRound)

  const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: 3_450,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  // Create the asset funding transaction (axfer)
  const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    suggestedParams: await algokit.getTransactionParams(undefined, algodClient),
    to: appAddress,
    amount: 1,
    assetIndex: asset,
  })

  const result = await appClient.makeVote({ pollId: [pollId], axfer, mbrTxn, inFavor }, { sender: { addr: sender, signer } })
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
    console.log('result', result)
    return result
  } catch (error) {
    console.error('error withdrawing pool share', error)
    return error
  }
}
