export type IGetAllPosts = PostRequest[]

export interface PostCreateMongo {
  transaction_id: string
  creator_address: string
  text: string
  timestamp: number
  country: string
  assetId: number
}

export interface ReplyCreateMongo {
  transaction_id: string
  post_transaction_id: string
  creator_address: string
  text: string
  timestamp: number
  country: string
  assetId: number
}

export interface LikeCreateMongo {
  transaction_id: string
  creator_address: string
  post_transaction_id: string
}

export interface VoterCreateMongo {
  pollId: number
  voterAddress: string
  claimed: boolean
}

export interface Post {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number | null
  country: string
  nfd?: string
  likes: Like[]
  replies: Reply[]
  status: 'accepted' | 'loading' | 'rejected' | null
  assetId: number
  isPersonalized: boolean
}

export interface Poll {
  text: string
  creator_address: string
  pollId: number
  timestamp: number | null
  country: string
  nfd?: string
  status: 'accepted' | 'loading' | 'rejected' | string | null
  assetId: number | null
  depositedAmount: number
  totalVotes: number
  yesVotes: number
  voters: VoterInterface[]
  expiry_timestamp: number
}

export interface PostRequest {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number | null
  country: string
  nfd?: string
  likes: Like[]
  replies: Reply[]
  status: 'accepted' | 'loading' | 'rejected' | null
  assetId: number
  isPersonalized: boolean
}

export interface PollRequest {
  text: string
  creator_address: string
  pollId: number
  timestamp: number | null
  country: string
  nfd?: string
  status: 'accepted' | 'loading' | 'rejected' | string | null
  assetId: number | null
  depositedAmount: number
  totalVotes: number
  yesVotes: number
  voters: VoterInterface[]
  expiry_timestamp: number
}

export interface VoterInterface {
  pollId: number
  voterAddress: string
  claimed: boolean
}

export interface Like {
  creator_address: string
}

export interface Reply {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number | null
  country: string
  nfd?: string
  likes: Like[]
  replies: Reply[]
  status: 'accepted' | 'loading' | 'rejected' | string | null
  assetId: number | null
  isTopPost?: boolean
}

export interface ReplyResponse {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number | null
  country: string
  nfd?: string
  likes: Like[]
  replies: Reply[]
  status: 'accepted' | 'loading' | 'rejected' | null
}

export interface Like2 {
  creator_address: string
}

export interface User {
  address: string
  avatar: string
  nfd: {
    name: string
    avatar: string
  }
  balance: { [key: string]: number }
  followTargets: string[]
}

export interface Nfd {
  name: string
  avatar: string
}

export interface GetFeedByMongo {
  data: Daum[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface Daum {
  _id?: Id
  pollId?: number
  creator_address: string
  text: string
  timestamp: number
  country: string
  assetId: number
  depositedAmount?: number
  totalVotes?: number
  yesVotes?: number
  expiry_timestamp?: number
  status?: string
  voters?: Voter[]
  type: string
  transaction_id?: string
  replies?: Reply[]
  likes?: Like[]
}

export interface Id {
  $oid: string
}

export interface Voter {
  _id: Id2
  pollId: number
  voterAddress: string
  claimed: boolean
}

export interface Id2 {
  $oid: string
}

export interface Reply {
  _id: Id3
  transaction_id: string
  post_transaction_id: string
  creator_address: string
  text: string
  timestamp: number
  country: string
  assetId: number
}

export interface Id3 {
  $oid: string
}

export interface Like {
  _id: Id4
  transaction_id: string
  creator_address: string
  post_transaction_id: string
}

export interface Id4 {
  $oid: string
}

export interface GetPollsByMongo {
  data: Poll[]
  totalCount: number
  totalPages: number
  currentPage: number
}

export interface Poll {
  _id?: Id
  pollId: number
  creator_address: string
  text: string
  timestamp: number
  country: string
  assetId: number
  depositedAmount: number
  totalVotes: number
  yesVotes: number
  expiry_timestamp: number
  status: string
  voters: Voter[]
  type: string
}

export interface Id {
  $oid: string
}

export interface Voter {
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
