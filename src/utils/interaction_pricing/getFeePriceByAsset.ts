import axios from 'axios'

export enum InteractionMultipliers {
  Post = 2,
  Reply = 1.5,
  Like = 1,
  CreatePoll = 10,
  VotePoll = 0.5,
}

export interface InteractionFee {
  platformFee: number
  creatorFee: number
}

export const getFeePriceByAsset = async (assetId: number, decimals: number, type: InteractionMultipliers): Promise<number | null> => {
  // Define a base price for the asset (for example purposes)
  const basePrice = import.meta.env.VITE_WECOOP_BASE_PRICE

  let priceApiUrl = `https://free-api.vestige.fi/asset/${assetId}/price`

  if (assetId === 0) {
    return null
  }

  const { data } = await axios.get(`https://free-api.vestige.fi/asset/${assetId}/price`)

  console.log('data', data, 'decimals', decimals)

  let assetUsdPrice = data['USD']

  const feePrice = (basePrice * type) / assetUsdPrice

  //FIxin fee bugs
  const a200Id = 1682662165
  if (assetId === a200Id) {
    return feePrice / 1000
  } else {
    return feePrice
  }
}
