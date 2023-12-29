const convertToDecimals = (value: number) => value * 10 ** 6

export enum Fees {
  FollowWecoopFee = convertToDecimals(1),
  FollowUserFee = convertToDecimals(10),
  UnfollowWecoopFee = convertToDecimals(1),
  LikeWecoopFee = convertToDecimals(0.01),
  LikeUserFee = convertToDecimals(0.1),
}
