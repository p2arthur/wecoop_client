import * as algokit from '@algorandfoundation/algokit-utils'
import { SendTransactionFrom } from '@algorandfoundation/algokit-utils/types/transaction'
import algosdk from 'algosdk'
import axios from 'axios'
import { StorageOrderClient } from '../../contracts/image-upload/StorageOrderClient'
import { FilePost } from '../../services/api/types'

async function getPrice(algod: algosdk.Algodv2, appClient: StorageOrderClient, size: number, isPermanent: boolean = false) {
  const result = await (await appClient.compose().getPrice({ size, is_permanent: isPermanent }).atc()).simulate(algod)

  return result.methodResults[0].returnValue?.valueOf() as number
}

async function getOrderNode(algod: algosdk.Algodv2, appClient: StorageOrderClient) {
  return (
    await (
      await appClient
        .compose()
        .getRandomOrderNode({}, { boxes: [new Uint8Array(Buffer.from('nodes'))] })
        .atc()
    ).simulate(algod)
  ).methodResults[0].returnValue?.valueOf() as string
}

async function placeOrder(
  algod: algosdk.Algodv2,
  appClient: StorageOrderClient,
  account: SendTransactionFrom,
  cid: string,
  size: number,
  price: number,
  isPermanent: boolean,
) {
  const merchant = await getOrderNode(algod, appClient)
  const seed = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: account.addr,
    to: (await appClient.appClient.getAppReference()).appAddress,
    amount: price,
    suggestedParams: await algod.getTransactionParams().do(),
  })

  await appClient.placeOrder({
    seed,
    cid,
    size,
    is_permanent: isPermanent,
    merchant,
  })
}

// Main function to be used on the frontend
export async function pinToIpfs(
  network: 'testnet' | 'mainnet',
  algod: algosdk.Algodv2,
  file: File,
  account: SendTransactionFrom,
  filePost: FilePost,
) {
  algokit.Config.configure({ populateAppCallResources: true })

  console.log('pinning')

  const appClient = new StorageOrderClient(
    {
      sender: account,
      resolveBy: 'id',
      id: network === 'testnet' ? 507867511 : 1275319623,
    },
    algod,
  )

  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data } = await axios.post(`${import.meta.env.VITE_WECOOP_API}/ipfs-crust-factory/ipfs_factory`, formData)

    const { cid, size } = data
    console.log('ipfs data', data)

    if (!cid || !size) return

    console.log('Getting price...')
    const price = await getPrice(algod, appClient, size)
    console.log(`Price for storage: ${price} microAlgos`)

    console.log('Placing order...')
    await placeOrder(algod, appClient, account, cid, size, price, false)

    const filePostWithCid = Object.assign(filePost, { file_1_cid: cid })

    return cid
  } catch (error) {
    console.error('An error occurred:', error)
  }
}
