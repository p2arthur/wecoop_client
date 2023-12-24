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
  status: 'accepted' | 'loading' | 'rejected' | null
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
  balance: number
  followTargets: string[]
}

export interface Nfd {
  name: string
  avatar: string
}
