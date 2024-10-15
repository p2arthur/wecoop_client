import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { Post } from './types'

const api = import.meta.env.VITE_WECOOP_API

export type ResponseGetTopLikesByWallet = {
  topCreators: LikesWallets[]
  totalTransactions: number
}

export interface LikesWallets {
  address: string
  count: number
}

const getTopInteractionsByWallet = async () => {
  const { data } = await axios.get(`${api}/leaderboard/top-creators`)
  return data
}

export const useGetTopInteractionsByWallet = () =>
  useQuery<ResponseGetTopLikesByWallet>({
    queryKey: ['getTopInteractionsByWallet'],
    queryFn: () => getTopInteractionsByWallet(),
  })

const getTopPostsByLike = async () => {
  const { data: topPostsData } = await axios.get<{ postId: string; likesCount: number }[]>(
    `${import.meta.env.VITE_WECOOP_API}/analytics/posts/top-liked-posts`,
  )
  const savedPosts: Post[] = JSON.parse(sessionStorage.getItem('postList')!)

  // Map over the data to extract postIds
  const topPosts: Post[] = []

  topPostsData.forEach((postAnalytic) => {
    savedPosts.forEach((post) => {
      if (post.transaction_id == postAnalytic.postId) {
        topPosts.push({ ...post, text: post.text })
      }
    })
  })

  return topPosts
}

export const useGetTopPostsByLike = () =>
  useQuery({
    queryKey: ['getTopPostsByLike'],
    queryFn: () => getTopPostsByLike(),
  })
