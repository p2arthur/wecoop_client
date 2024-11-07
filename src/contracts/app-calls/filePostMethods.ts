import * as algokit from '@algorandfoundation/algokit-utils'
import { TransactionSigner } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { User } from '../../services/User'
import { WecoopFilePostClient } from '../clients/WecoopFilePostClient'

export const createAppClient = (senderAddress: string, signer: TransactionSigner, algod: AlgodClient) => {
  const wecoopFilePostAppId = Number(import.meta.env.VITE_WECOOP_FILEPOST_APP_ID)

  const appClient = new WecoopFilePostClient(
    {
      resolveBy: 'id',
      id: wecoopFilePostAppId,
      sender: { addr: senderAddress, signer },
    },
    algod,
  )
  algokit.Config.configure({ populateAppCallResources: true })
  return appClient
}

const createFilePost = async (
  appClient: WecoopFilePostClient,
  sender: string,
  signer: TransactionSigner,
  amount: number,
  expires_in: number,
  assetId: number,
  filePostText: string,
  filePostId: number,
  creator_address: string,
  country: string,
  depositedAmount: number,
  activeAccount: User,
  cid: string,
) => {
  const result = await appClient.createFilePost()
}
