import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { Fees } from '../enums/Fees'
import { NotePrefix } from '../enums/notePrefix'
import { getUserCountry } from '../utils/userUtils'
import { Transaction } from './Transaction'

interface FollowProps {
  subjectUserWalletAddress: string
  followerUserWalletAddress?: string
}

export class Follow {
  constructor(private client: AlgodClient) {}

  public async handleUserFollow({ subjectUserWalletAddress, followerUserWalletAddress }: FollowProps) {
    const transactionService = new Transaction(this.client)
    const followerCountry = await getUserCountry()
    const wecoopNote = `${NotePrefix.WeCoopFollow}${subjectUserWalletAddress}:${followerCountry}`
    const wecoopFee = Fees.FollowWecoopFee
    const wecoopWalletAddress = import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string
    const subjectUserNote = `WeCoop - ${followerUserWalletAddress} just followed you`
    const subjectUserFee = Fees.FollowUserFee

    const wecoopFeeTransaction = await transactionService.createTransaction(
      wecoopWalletAddress,
      import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
      wecoopFee,
      wecoopNote,
    )
    const subjectUserTransaction = await transactionService.createTransaction(
      followerUserWalletAddress!,
      subjectUserWalletAddress,
      subjectUserFee,
      subjectUserNote,
    )

    const transactionsArray = [wecoopFeeTransaction, subjectUserTransaction]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    const encodedGroupedTransactions = groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))

    return encodedGroupedTransactions
  }

  public async handleUserUnfollow({ subjectUserWalletAddress }: FollowProps) {
    const transactionService = new Transaction(this.client)
    const wecoopNote = `${NotePrefix.WeCoopUnfollow}${subjectUserWalletAddress}`
    const wecoopFee = Fees.FollowWecoopFee
    const wecoopWalletAddress = import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string

    const wecoopFeeTransaction = await transactionService.createTransaction(
      wecoopWalletAddress,
      import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
      wecoopFee,
      wecoopNote,
    )

    const transaction = wecoopFeeTransaction
    const unsignedTransaction = [algosdk.encodeUnsignedTransaction(transaction)]
    return unsignedTransaction
  }
}
