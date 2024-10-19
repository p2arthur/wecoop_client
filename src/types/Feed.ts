export interface GetPollsByMongo {
  data: Poll[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface Poll {
  _id: Id
  assetId: number
  country: string
  creator_address: string
  depositedAmount: number
  expiry_timestamp: number
  pollId: number
  status: string
  text: string
  timestamp: number
  totalVotes: number
  type: string
  voters: VoterInterfaceRequest[]
  yesVotes: number
}

export interface Id {
  $oid: string
}

export interface VoterInterfaceRequest {
  _id: Id2
  pollId: number
  voterAddress: string
  claimed: boolean
  in_favor: boolean
  deposited_amount?: number
}

export interface Id2 {
  $oid: string
}
