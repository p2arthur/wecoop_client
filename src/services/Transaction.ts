import * as algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'

export interface TransactionInterface {
  note: string
}

export class Transaction {
  constructor(private client: AlgodClient) {}

  async getUserBalance(userAddress: string) {
    try {
      const balance = await this.client.accountInformation(userAddress).do()
      return balance
    } catch (error) {
      console.error(error)
      return error
    }
  }

  async createTransaction(from: string, to: string, amount: number, note: string, token: number = 796425061) {
    const suggestedParams = await this.client.getTransactionParams().do()

    let txn

    if (token === 0) {
      txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
        from,
        to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
        note: new Uint8Array(Buffer.from(note)), // Encode note
        suggestedParams: suggestedParams, // Use suggested transaction params,
        amount: 100000,
      })
    } else {
      txn = algosdk.makeAssetTransferTxnWithSuggestedParams(
        from,
        to,
        undefined,
        undefined,
        amount,
        new Uint8Array(Buffer.from(note)),
        token,
        suggestedParams,
      )
    }

    return txn
  }
}
