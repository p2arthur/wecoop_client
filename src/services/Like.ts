import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { NotePrefix } from '../enums/notePrefix'
import { getUserCountry } from '../utils/userUtils'
import { Transaction } from './Transaction'

interface LikeProps {
  event: React.FormEvent
  creatorAddress: string
  transactionId: string
  address: string
}

export class Like {
  constructor(private client: AlgodClient) {}

  public async handlePostLike({ event, creatorAddress, transactionId, address }: LikeProps) {
    const transactionService = new Transaction(this.client)

    event.preventDefault()
    const country = await getUserCountry()
    const note = `${NotePrefix.WeCoopLike}${country}:${transactionId}`
    const scoopFeeTransaction = await transactionService.createTransaction(
      address,
      import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
      1000,
      note,
    )
    const postCreatorFee = await transactionService.createTransaction(address, creatorAddress, 1000, `creator-fee:${note}`)

    const transactionsArray = [scoopFeeTransaction, postCreatorFee]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    const encodedGroupedTransactions = groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))

    return encodedGroupedTransactions
  }
}
