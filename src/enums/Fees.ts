const convertToDecimals = (value: number) => value * 10 ** 6

export enum Fees {
  FollowWecoopFee = convertToDecimals(1),
  FollowUserFee = convertToDecimals(10),
  UnfollowWecoopFee = convertToDecimals(1),
  LikeWecoopFee = convertToDecimals(0.01),
  LikeUserFee = convertToDecimals(0.1),
  ReplyWecoopFee = convertToDecimals(0.01),
  ReplyUserFee = convertToDecimals(0.09),
}

// These values are based on dollar
export enum InteractionPrices {
  Post = 0.01,
  Like = 0.01,
}

export enum InteractionMultipliers {
  FilePost = 4,
  Post = 2,
  Reply = 1.5,
  Like = 1,
}
