import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'

export const getAssetDecimals = async (algod: AlgodClient, assetId: number) => {
  const { params } = await algod.getAssetByID(assetId).do()

  const assetDecimals = params.decimals

  return assetDecimals
}
