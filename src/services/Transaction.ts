import * as algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

export interface TransactionInterface {
  note: string
}

export class Transaction {
  constructor(private client: AlgodClient) {}

  async getUserBalance(userAddress: string) {
    try {
      const balance = await this.client.accountInformation(userAddress).do()
      console.log('balance', balance)
    } catch (error) {
      console.error(error)
    }
  }

  async createTransaction(from: string, to: string, amount: number, note: string) {
    const token = getIndexerConfigFromViteEnvironment().token
    const suggestedParams = await this.client.getTransactionParams().do()

    const ptxn = algosdk.makeAssetTransferTxnWithSuggestedParams(
      from,
      to,
      undefined,
      undefined,
      amount,
      new Uint8Array(Buffer.from(note)),
      Number(token),
      suggestedParams,
    )

    return ptxn
  }
}
