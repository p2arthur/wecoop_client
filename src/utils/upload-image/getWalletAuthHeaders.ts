import algosdk from 'algosdk'
import axios from 'axios'
import * as algokit from '@algorandfoundation/algokit-utils'
import nacl from 'tweetnacl'
import { StorageOrderClient } from '../../contracts/image-upload/StorageOrderClient'

const getAuthHeader = async (account: algosdk.Account) => {
  const sk32 = account.sk.slice(0, 32)
  const signingKey = nacl.sign.keyPair.fromSeed(sk32)

  const signature = nacl.sign(Buffer.from(account.addr), signingKey.secretKey)
  const sigHex = Buffer.from(signature).toString('hex').slice(0, 128)

  const authStr = `sub-${account.addr}:0x${sigHex}`

  return Buffer.from(authStr).toString('base64')
}

const uploadToIpfs = async (account: algosdk.Account, file: File) => {
  const headers = { Authorization: `Basic ${await getAuthHeader(account)}` }

  const apiEndpoint = 'https://gw-seattle.crustcloud.io:443/api/v0/add'

  // // Create a Blob object containing file data (for example, some text)
  // const fileContent = 'This is a dynamically generated file.'
  // const blob = new Blob([fileContent], { type: 'text/plain' })

  // // Convert Blob to File
  // const file = new File([blob], 'dynamic-file.txt', { type: 'text/plain' })

  const formData = new FormData()
  formData.append('file', file, file.name)

  try {
    const { data } = await axios.post(apiEndpoint, formData, {
      headers: { ...headers },
    })

    const json: { Hash: string; Size: number } = data
    return { cid: json.Hash, size: Number(json.Size) }
  } catch (error) {
    console.error('Failed to upload to IPFS:', error)
    throw error
  }
}

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
  account: algosdk.Account,
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
export async function main(network: 'testnet' | 'mainnet', algod: algosdk.Algodv2, file: File, account: algosdk.Account) {
  algokit.Config.configure({ populateAppCallResources: true })

  const appClient = new StorageOrderClient(
    {
      sender: account,
      resolveBy: 'id',
      id: network === 'testnet' ? 507867511 : 1275319623,
    },
    algod,
  )

  try {
    console.log('Uploading to IPFS...')
    const { size, cid } = await uploadToIpfs(account, file)
    console.log(`Uploaded to IPFS. CID: ${cid}, Size: ${size} bytes`)

    console.log('Getting price...')
    const price = await getPrice(algod, appClient, size)
    console.log(`Price for storage: ${price} microAlgos`)

    console.log('Placing order...')
    await placeOrder(algod, appClient, account, cid, size, price, false)
    console.log('Order placed successfully.')
  } catch (error) {
    console.error('An error occurred:', error)
  }
}
