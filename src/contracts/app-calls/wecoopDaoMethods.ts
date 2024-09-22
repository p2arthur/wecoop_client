import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
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

  return appClient
}

export const makePoll = async (
  algorand: any,
  appClient: WecoopDaoClient,
  sender: string,
  signer: TransactionSigner,
  amount: bigint,
  assetId: number,
) => {
  const { appAddress } = await appClient.appClient.getAppReference()

  const boxMBRPayment = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: 15_700,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })
  const xferFirstDeposit = await algorand.transactions.assetTransfer({
    assetId: BigInt(assetId),
    sender,
    receiver: appAddress,
    amount: 1n,
  })

  try {
    const result = await appClient.createPoll(
      {
        mbrTxn: boxMBRPayment,
        axfer: xferFirstDeposit,
        question: 'test question',
      },
      { sender: { addr: sender, signer }, boxes: [algosdk.decodeAddress(sender).publicKey] },
    )
  } catch (error) {
    console.error('error creating poll', error)
  }
}
