export type IGetAllPosts = PostRequest[]

export interface Post {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number
  country: string
  nfd?: string
  likes: Like[]
  replies: Reply[]
  status: 'accepted' | 'loading' | 'rejected'
}

export interface PostRequest {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number
  country: string
  likes: Like[]
  replies: ReplyResponse[]
}

export interface Like {
  creator_address: string
}

export interface Reply {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number
  status: 'accepted' | 'loading' | 'rejected'
  nfd?: string
  country?: string
  likes: Like2[]
  replies: any[]
}

export interface ReplyResponse {
  text: string
  creator_address: string
  transaction_id: string
  timestamp: number
  country?: string
  likes: Like2[]
  replies: any[]
}

export interface Like2 {
  creator_address: string
}

export interface User {
  address: string
  avatar: string
  nfd: Nfd
  balance: number
}

export interface Nfd {
  name: string
  avatar: string
}
