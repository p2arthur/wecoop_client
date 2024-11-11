import * as algokit from '@algorandfoundation/algokit-utils'
import algosdk, { AlgodTokenHeader, TransactionSigner } from 'algosdk'
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
  filePostText: string,
) => {
  const appClient = createAppClient(sender, signer)

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

  try {
    const result = await appClient.createFilePost({
      mbrTxn,
      axfer,
      fileFormat: 'png',
      country: country,
      cid,
      text: filePostText,
    })

    console.log('result of interacting with contract', result)

    return result
  } catch (error) {
    console.error('result of interacting with contract', error)
    throw new Error('Error creating file post on contract')
  }
}

const likeOnChainFilePost = async (
  sender: string,
  assetId: number,

  signer: TransactionSigner,
  postId: number,
) => {
  const appClient = createAppClient(sender, signer)

  const { appAddress } = await appClient.appClient.getAppReference()

  const mbrTxn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    amount: Number(algokit.algos(0.02)),
    suggestedParams: await algod.getTransactionParams().do(),
  })

  // Calculate the fee price based on the asset
  const feePrice = await getFeePriceByAsset(assetId, InteractionMultipliers.FilePost)

  const splitFee = splitFeeByInteractionType({ totalFee: feePrice!, type: InteractionMultipliers.FilePostLike })

  const platformAlgoFee = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    amount: 100,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  const platformFee = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS,
    assetIndex: Number(assetId!),
    amount: splitFee.platformFee!,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })
  const creatorFee = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
    from: sender,
    to: appAddress,
    assetIndex: Number(assetId!),
    amount: splitFee.creatorFee!,
    suggestedParams: await algokit.getTransactionParams(undefined, algod),
  })

  try {
    const result = await appClient.likeFilePost({
      mbrTxn,
      platformAlgoFeeTxn: platformAlgoFee,
      creatorPayTxn: creatorFee,
      platformCommunityFeeTxn: platformFee,
      filePostId: [postId],
    })

    console.log('result of liking a file post', result)
  } catch (error) {
    console.error('error creating like', error)
    throw new Error(String(error))
  }
}
