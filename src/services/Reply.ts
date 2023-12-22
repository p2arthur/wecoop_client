import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { NotePrefix } from '../enums/notePrefix'
import { getUserCountry } from '../utils/userUtils'
import { Transaction } from './Transaction'

interface ReplyProps {
  address: string
  creatorAddress: string
  text: string
  transactionId: string
}

export class Reply {
  constructor(private client: AlgodClient) {}

  public async handlePostReply({ creatorAddress, transactionId, address, text }: ReplyProps) {
    const transactionService = new Transaction(this.client)

    const country = await getUserCountry()
    const note = `${NotePrefix.WeCoopReply}${country}:${transactionId}:${text}`
    const scoopFeeTransaction = await transactionService.createTransaction(
      address,
      import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
      1000,
      note,
    )
    const postCreatorFee = await transactionService.createTransaction(address, creatorAddress, 1000, `creator-fee:${note}`)

    const transactionsArray = [scoopFeeTransaction, postCreatorFee]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    return groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))
  }
}
