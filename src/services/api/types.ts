export type IGetAllPosts = PostRequest[]

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
