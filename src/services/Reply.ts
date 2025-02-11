import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { InteractionMultipliers } from '../enums/Fees'
import { NotePrefix } from '../enums/notePrefix'
import { getFeePriceByAsset } from '../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../utils/interaction_pricing/splitFeeByInteractionType'
import { getUserCountry } from '../utils/userUtils'
import { Transaction } from './Transaction'

interface ReplyProps {
  address: string
  creatorAddress: string
  text: string
  transactionId: string
  assetId: number
}

export class Reply {
  constructor(private client: AlgodClient) {}

  public async handlePostReply({ creatorAddress, transactionId, address, text, assetId }: ReplyProps) {
    const transactionService = new Transaction(this.client)

    const feePrice = await getFeePriceByAsset(assetId, InteractionMultipliers.Reply)

    const splitFee = splitFeeByInteractionType({ totalFee: feePrice || 0.1, type: InteractionMultipliers.Reply })

    const finalPlatformFee = Math.floor(splitFee.platformFee)
    const finalUserFee = Math.floor(splitFee.creatorFee)

    const country = await getUserCountry()
    const note = `${NotePrefix.WeCoopReply}${country}:${transactionId}:${text}`

    const scoopFeeTransaction = await transactionService.createTransaction(
      address,
      import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
      finalPlatformFee,
      note,
      assetId,
    )

    const postCreatorFee = await transactionService.createTransaction(address, creatorAddress, finalUserFee, `creator-fee:${note}`, assetId)

    const transactionsArray = [scoopFeeTransaction, postCreatorFee]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    return groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))
  }
}
