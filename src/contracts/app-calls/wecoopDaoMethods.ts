import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, decodeUint64, encodeAddress, TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { getRoundTimestamp } from '../../utils/getRoundTime'
import { getAlgodConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { WecoopDaoClient } from '../clients/WecoopDaoClient'

const algodServer = getAlgodConfigFromViteEnvironment().server
const algodToken = getAlgodConfigFromViteEnvironment().token
const algodPort = getAlgodConfigFromViteEnvironment().port

const algod = new algosdk.Algodv2(algodToken as AlgodTokenHeader, algodServer, algodPort)

export const createAppClient = (senderAddress: string, signer: TransactionSigner, algod: AlgodClient, appId: number) => {
  const appClient = new WecoopDaoClient(
    {
      resolveBy: 'id',
      id: appId,
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
  amount: bigint,
  assetId: number,
  pollQuestion: string,
) => {
  const { appAddress } = await appClient.appClient.getAppReference()

  const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: 3_450,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })
  const xferFirstDeposit = await algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: 120_000,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
    assetIndex: assetId,
  })

  try {
    const result = await appClient.createPoll(
      {
        mbrTxn: boxMBRPayment,
        axfer: xferFirstDeposit,
        question: pollQuestion,
      },
      { sender: { addr: sender, signer }, boxes: [algosdk.decodeAddress(sender).publicKey] },
    )
  } catch (error) {
    console.error('error creating poll', error)
  }
}

export const getAllPolls = async (appId: number) => {
  // Get all boxes for the application
  const boxesResponse = await algod.getApplicationBoxes(appId).do()
  const allPolls: any[] = []

  const decoder = new TextDecoder('utf-8')

  // Iterate through all boxes, retrieve their contents, and decode them
  for (const box of boxesResponse.boxes) {
    const boxNameBytes = box.name // Uint8Array containing the box name
    let offset = 0

    try {
      // Decode the box name (starts with 'poll_' prefix, followed by pollId as uint64)
      const prefixBytes = boxNameBytes.slice(offset, offset + 5)
      const prefix = decoder.decode(prefixBytes) // 'poll_'
      offset += 5

      // Decode the pollId (next 8 bytes as uint64 big-endian)
      const pollIdBytes = boxNameBytes.slice(offset, offset + 8)
      const pollId = decodeUint64(pollIdBytes, 'bigint')
      offset += 8

      // Get the box content (Uint8Array)
      const boxContentResponse = await algod.getApplicationBoxByName(appId, boxNameBytes).do()

      console.log('box content response', boxContentResponse)

      const contentBytes = boxContentResponse.value // Uint8Array of the box content
      offset = 0 // Reset offset for contentBytes

      // Decode the creator's address (32 bytes)
      const creatorAddressBytes = contentBytes.slice(offset, offset + 32)
      const creatorAddress = encodeAddress(creatorAddressBytes)
      offset += 32

      // Decode the selected_asset (8 bytes as uint64)
      const selectedAssetBytes = contentBytes.slice(offset, offset + 8)
      const selectedAsset = decodeUint64(selectedAssetBytes, 'bigint')
      offset += 8

      // Decode totalVotes (8 bytes as uint64)
      const totalVotesBytes = contentBytes.slice(offset, offset + 8)
      const totalVotes = decodeUint64(totalVotesBytes, 'bigint')
      offset += 8

      // Decode yesVotes (8 bytes as uint64)
      const yesVotesBytes = contentBytes.slice(offset, offset + 8)
      const yesVotes = decodeUint64(yesVotesBytes, 'bigint')
      offset += 8

      // Decode deposited (8 bytes as uint64)
      const depositedBytes = contentBytes.slice(offset, offset + 8)
      const deposited = decodeUint64(depositedBytes, 'bigint')
      offset += 8

      // Decode the timestamp (8 bytes as uint64)
      const timestampBytes = contentBytes.slice(offset, offset + 8)
      const timestamp = decodeUint64(timestampBytes, 'bigint')
      offset += 8

      // At this point, make sure the offset is aligned correctly for the question
      console.log('Offset after timestamp:', offset)

      // Decode the question (remaining bytes)
      const questionBytes = contentBytes.slice(offset + 4) // SKIP FIRST BYTE (assuming it’s a metadata byte)
      console.log('Raw question bytes:', questionBytes) // Log the raw bytes for the question
      const question = decoder.decode(questionBytes).trim()

      const timestampNumber = Number(timestamp)

      const trueTimestamp = await getRoundTimestamp(algod, timestampNumber)

      console.log('trueTimestamp', trueTimestamp)

      // Construct the poll object
      const poll = {
        boxName: `${prefix}${pollId}`,
        creatorAddress: creatorAddress,
        selectedAsset: selectedAsset.toString(),
        totalVotes: totalVotes.toString(),
        yesVotes: yesVotes.toString(),
        deposited: deposited.toString(),
        timestamp: trueTimestamp,
        question: question,
      }

      allPolls.push(poll)
    } catch (error) {
      console.error(`Error decoding box:`, error)
    }
  }

  console.log('allPolls', allPolls)

  return allPolls
}
