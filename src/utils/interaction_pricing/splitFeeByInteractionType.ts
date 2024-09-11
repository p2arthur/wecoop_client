import { InteractionInterface } from '../../types/Interactions'

interface SplitFeeArgsInterface {
  totalFee: number
  type: InteractionInterface['type'] // Using the type from InteractionInterface
}

export const splitFeeByInteractionType = ({ totalFee, type }: SplitFeeArgsInterface) => {
  let platformFee = 0
  let creatorFee = 0

  switch (type) {
    case 'post':
      platformFee = totalFee // 100% to platform (wecoop)
      creatorFee = 0
      break

    case 'like':
    case 'reply':
      platformFee = Math.floor(totalFee / 3) // Integer division for platform fee
      creatorFee = totalFee - platformFee // The remaining goes to creator
      break

    default:
      throw new Error('Invalid interaction type')
  }

  return {
    platformFee,
    creatorFee,
  }
}
