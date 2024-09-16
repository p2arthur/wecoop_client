import axios from 'axios'

export enum InteractionMultipliers {
  Post = 2,
  Reply = 1.5,
  Like = 1,
}

export interface InteractionFee {
  platformFee: number
  creatorFee: number
}

export const getFeePriceByAsset = async (assetId: number, decimals: number, type: InteractionMultipliers): Promise<number> => {
  // Define a base price for the asset (for example purposes)
  const basePrice = import.meta.env.VITE_WECOOP_BASE_PRICE

  const { data } = await axios.get(`https://free-api.vestige.fi/asset/${assetId}/price`)

  let assetUsdPrice = data['USD']

  if (decimals == 3) assetUsdPrice = assetUsdPrice * 1000

  const feePrice = (basePrice / assetUsdPrice) * type

  return feePrice
}
