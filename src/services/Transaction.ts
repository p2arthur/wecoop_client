import * as algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'

export class Transaction {
  constructor(private client: AlgodClient) {}

  async getUserBalance(userAddress: string) {
    try {
      const balance = await this.client.accountInformation(userAddress).do()
    } catch (error) {
      console.error(error)
    }
  }

  async createTransaction(from: string, to: string, amount: number, note: string) {
    const suggestedParams = await this.client.getTransactionParams().do()
    const ptxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      from,
      to,
      undefined,
      undefined,
      10000,
      new Uint8Array(Buffer.from(note)),
      10458941,
      suggestedParams,
    )

    const encodedTransaction = algosdk.encodeUnsignedTransaction(ptxn)

    return encodedTransaction
  }
}
