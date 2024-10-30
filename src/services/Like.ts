import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { UsableAssetInterface } from '../context/UsableAsset/UsableAssetContext'
import { InteractionMultipliers } from '../enums/Fees'
import { NotePrefix } from '../enums/notePrefix'
import { getFeePriceByAsset } from '../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../utils/interaction_pricing/splitFeeByInteractionType'
import { getUserCountry } from '../utils/userUtils'
import { Transaction } from './Transaction'

interface LikeProps {
  event: React.FormEvent
  creatorAddress: string
  transactionId: string
  address: string
  usableAsset: UsableAssetInterface
}

export class Like {
  constructor(private client: AlgodClient) {}

  public async handlePostLike({ event, creatorAddress, transactionId, address, usableAsset }: LikeProps) {
    const transactionService = new Transaction(this.client)

    // Calculate the fee price based on the asset
    const feePrice = await getFeePriceByAsset(usableAsset.assetId, usableAsset.decimals, InteractionMultipliers.Like)

    // Split the fee by interaction type
    const splitFee = splitFeeByInteractionType({ totalFee: feePrice!, type: 'like' })

    const wecoopFee = Math.floor(splitFee.platformFee * 10 ** usableAsset.decimals)
    const creatorFee = Math.floor(splitFee.creatorFee * 10 ** usableAsset.decimals)
    const wecoopWalletAddress = import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string

    event.preventDefault()
    const country = await getUserCountry()
    const note = `${NotePrefix.WeCoopLike}${country}:${transactionId}`
    const scoopFeeTransaction = await transactionService.createTransaction(address, wecoopWalletAddress, wecoopFee, note)
    const postCreatorFee = await transactionService.createTransaction(
      address,
      creatorAddress,
      creatorFee,
      `WeCoop - ${address} just liked your post`,
      usableAsset.assetId,
    )

    const transactionsArray = [scoopFeeTransaction, postCreatorFee]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    const encodedGroupedTransactions = groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))

    return encodedGroupedTransactions
  }
}
