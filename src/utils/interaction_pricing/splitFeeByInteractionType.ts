import { InteractionMultipliers } from './getFeePriceByAsset'

interface SplitFeeArgsInterface {
  totalFee: number
  type: number // Using the type from InteractionInterface
}

export const splitFeeByInteractionType = ({ totalFee, type }: SplitFeeArgsInterface) => {
  let platformFee = 0
  let creatorFee = 0

  switch (type) {
    case InteractionMultipliers.Post:
      platformFee = totalFee // 100% to platform (wecoop)
      creatorFee = 0
      break

    case InteractionMultipliers.Like:
      platformFee = totalFee / 3 // Integer division for platform fee
      creatorFee = totalFee - platformFee // The remaining goes to creator
      break
    case InteractionMultipliers.Reply:
      platformFee = totalFee / 3 // Integer division for platform fee
      creatorFee = totalFee - platformFee // The remaining goes to creator
      break

    default:
      throw new Error('Invalid interaction type')
  }

  return {
    platformFee: Math.floor(platformFee),
    creatorFee: Math.floor(creatorFee),
  }
}
