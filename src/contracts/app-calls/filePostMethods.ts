import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
import axios from 'axios'
import { Daum } from '../../services/api/types'
import { getFeePriceByAsset, InteractionMultipliers } from '../../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../../utils/interaction_pricing/splitFeeByInteractionType'
import { getAlgodConfigFromViteEnvironment } from '../../utils/network/getAlgoClientConfigs'
import { WecoopFilePostClient } from '../clients/WecoopFilePostClient'

const algodServer = getAlgodConfigFromViteEnvironment().server
const algodToken = getAlgodConfigFromViteEnvironment().token
const algodPort = getAlgodConfigFromViteEnvironment().port

const algod = new algosdk.Algodv2(algodToken as AlgodTokenHeader, algodServer, algodPort)

export const createAppClient = (senderAddress: string, signer: TransactionSigner) => {
  console.log('sender', senderAddress, signer)
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

export const createOnChainFilePost = async (
  sender: string,
  assetId: number,
  cid: string,
  signer: TransactionSigner,
  country: string,
  filePost: any,
) => {
  const appClient = createAppClient(sender, signer)

  const { totalFilePosts } = await appClient.appClient.getGlobalState()

  const { appAddress } = await appClient.appClient.getAppReference()

  const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: Number(algokit.algos(0.00447)),
    suggestedParams: await algod.getTransactionParams().do(),
  })

  // Calculate the fee price based on the asset
  const feePrice = await getFeePriceByAsset(assetId, InteractionMultipliers.FilePost)

  const axfer = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    assetIndex: Number(assetId!),
    amount: feePrice!,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  const filePostWithId = { ...filePost, filepost_id: Number(totalFilePosts.value) + 1 }

  console.log('filepostwithid', filePostWithId)

  try {
    const result = await appClient.createFilePost({
      mbrTxn,
      axfer,
      fileFormat: 'png',
      country: country,
      cid,
      text: filePost.text,
    })

    const { data: filePostData } = await axios.post(`${import.meta.env.VITE_WECOOP_API}/file-post/create-file-post`, filePostWithId)

    console.log('result of interacting with contract', result)

    return result
  } catch (error) {
    console.error('result of interacting with contract', error)
    throw new Error('Error creating file post on contract')
  }
}

export const likeOnChainFilePost = async (
  sender: string,
  assetId: number,

  signer: TransactionSigner,
  post: Daum,
) => {
  const appClient = createAppClient(sender, signer)

  const { appAddress } = await appClient.appClient.getAppReference()

  const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: Number(algokit.algos(0.2)),
    suggestedParams: await algod.getTransactionParams().do(),
  })

  // Calculate the fee price based on the asset
  const feePrice = await getFeePriceByAsset(assetId, InteractionMultipliers.FilePost)

  const splitFee = splitFeeByInteractionType({ totalFee: feePrice!, type: InteractionMultipliers.Like })

  const platformAlgoFee = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    amount: Number(algokit.algos(0.1)),
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  const platformFee = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    assetIndex: Number(assetId!),
    amount: splitFee.platformFee,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  console.log('assetId', assetId)

  const creatorFee = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: post.creator_address,
    assetIndex: Number(assetId!),
    amount: splitFee.creatorFee,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  console.log('post', post)

  try {
    const result = await appClient.likeFilePost({
      mbrTxn,
      filePostId: [post.filepost_id!],
      platformAlgoFeeTxn: platformAlgoFee,
      platformCommunityFeeTxn: platformFee,
      creatorPayTxn: creatorFee,
    })

    console.log('result of liking a file post', result)
  } catch (error) {
    console.error('error creating like', error)
    throw new Error(String(error))
  }
}
