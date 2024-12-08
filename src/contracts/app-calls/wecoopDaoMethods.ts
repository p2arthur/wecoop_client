import * as algokit from '@algorandfoundation/algokit-utils'
import { AppCallTransactionResult, AppCallTransactionResultOfType } from '@algorandfoundation/algokit-utils/types/app'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import axios from 'axios'
import { User } from '../../services/api/types'
import { captureVoteCard } from '../../utils/captureComponentImage'
import { getAssetDecimals } from '../../utils/getAssetDecimals'
import { getFeePriceByAsset, InteractionMultipliers } from '../../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../../utils/interaction_pricing/splitFeeByInteractionType'
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
  activeAccount: User,
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

  const amountToDeposit = await getFeePriceByAsset(assetId, InteractionMultipliers.CreatePoll)

  const platformFeeTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    amount: amountToDeposit!,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
    assetIndex: assetId,
  })

  try {
    // Dynamically create the poll data
    const pollData = {
      pollId: pollId,
      creator_address: creator_address,
      text: pollQuestion,
      timestamp: Math.floor(new Date().getTime() / 1000),
      expiry_timestamp: Math.floor(new Date().getTime()) / 1000 + expires_in_ms,
      country: country,
      depositedAmount: depositedAmount,
      assetId: assetId,
      totalVotes: 0,
      yesVotes: 0,
      status: 'accepted',
      type: 'poll',
      voters: [],
    }

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

      if (!result) return

      await axios.post(`${import.meta.env.VITE_WECOOP_API}/polls/create`, pollData)
    } catch (error) {
      throw new Error('Error voting')
    }

    captureVoteCard(pollData, activeAccount, algod)
  } catch (error) {
    console.error('error creating poll', error)
  }
}

type WithdrawPollShareResult =
  | { status: 'success'; result: AppCallTransactionResultOfType<void> & AppCallTransactionResult }
  | { status: 'error'; error: unknown }

export const makeVote = async (
  appClient: WecoopDaoClient,
  algodClient: AlgodClient,
  pollId: number,
  sender: string,
  signer: TransactionSigner,
  asset: number,
  inFavor: boolean,
  pollCreator: string,
  pollDepositPrice: number,
): Promise<void> => {
  try {
    console.log('Casting vote')
    const { appAddress } = await appClient.appClient.getAppReference()
    const suggestedParams = await algokit.getTransactionParams(undefined, algod)
    const assetDecimals = await getAssetDecimals(algodClient, asset)

    console.log('params', suggestedParams)
    const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: sender,
      to: appAddress,
      amount: 4_450,
      suggestedParams: suggestedParams,
    })

    console.log('asset', asset)

    // Calculate the fee price based on the asset
    const feePrice = await getFeePriceByAsset(asset, InteractionMultipliers.VotePoll)

    const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: suggestedParams,
      to: appAddress,
      amount: feePrice!,
      assetIndex: asset,
    })

    console.log('fee price !*E*@#!#&!@&#', feePrice)

    const fees = splitFeeByInteractionType({ totalFee: feePrice!, type: InteractionMultipliers.VotePoll })

    console.log('total fee', fees)

    const platformFeeTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: suggestedParams,
      to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
      amount: fees.platformFee,
      assetIndex: asset,
    })

    const pollCreatorMultiplier = 2

    const pollCreatorPaymentTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: sender,
      suggestedParams: suggestedParams,
      to: pollCreator,
      amount: fees.creatorFee,
      assetIndex: asset,
    })

    const voteData = {
      pollId: pollId,
      voterAddress: sender,
      claimed: false,
      in_favor: inFavor,
      deposited_amount: pollDepositPrice,
    }

    const result = await appClient.makeVote(
      {
        pollId: [pollId],
        axfer,
        mbrTxn,
        inFavor,
        platrformFeeTxn: platformFeeTxn,
        creatorFeeTxn: pollCreatorPaymentTxn,
      },
      { sender: { addr: sender, signer } },
    )

    await axios.post(`${import.meta.env.VITE_WECOOP_API}/polls/vote`, voteData)
  } catch (error) {
    throw new Error('Error')
  }
}

// // Função para verificar a confirmação da transação
// const waitForTransactionConfirmation = async (algodClient: AlgodClient, txId: string) => {
//   try {
//     const timeout = 60000 // 60 segundos de espera máxima
//     const start = Date.now()
//     while (Date.now() - start < timeout) {
//       const response = await algodClient.pendingTransactionInformation(txId).do()
//       if (response && response['confirmed-round']) {
//         return true
//       }
//       await new Promise((resolve) => setTimeout(resolve, 2000)) // Espera 2 segundos antes de tentar de novo
//     }
//     return false // Não confirmou a transação dentro do tempo limite
//   } catch (err) {
//     return false // Erro ao verificar a confirmação
//   }
// }

export const withdrawPollShare = async (
  appClient: WecoopDaoClient,
  pollId: number,
  sender: string,
  signer: TransactionSigner,
): Promise<WithdrawPollShareResult> => {
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

    return { status: 'success', result }
  } catch (error) {
    return { status: 'error', error }
  }
}
