import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import axios from 'axios'
import { GetFeedByMongo, IGetAllPosts, LikeCreateMongo, Post, PostCreateMongo, ReplyCreateMongo, VoterCreateMongo } from './types'

export const getAllPosts = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/global`)
  return data
}

export const useGetAllPosts = (enabled?: boolean) =>
  useQuery<IGetAllPosts>({
    queryKey: ['getAllPosts'],
    queryFn: () => getAllPosts(),
    enabled,
  })

export const getLastPosts = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/global-last-posts`)

  return data
}

export const useGetLastPosts = (enabled?: boolean) =>
  useQuery<IGetAllPosts>({
    queryKey: ['getLastPosts'],
    queryFn: () => getLastPosts(),
    enabled,
  })

export const getAllPostsByWalletAddress = async (walletAddress: string) => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/by/${walletAddress}`)
  return data
}

export const useGetAllPostsByWalletAddress = (walletAddress: string, enabled?: boolean) =>
  useQuery<IGetAllPosts>({
    queryKey: ['getAllPosts'],
    queryFn: () => getAllPostsByWalletAddress(walletAddress),
    enabled,
  })

const getSinglePost = async (id: string) => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/post/${id}`)
  return data
}

export const useGetPostByTransactionId = (id: string, enabled?: boolean) =>
  useQuery<Post>({ queryKey: ['getSinglePost', id], queryFn: () => getSinglePost(id), enabled })

export const getPostsByAddress = async (address: string) => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/${address}`)
  return data
}

export const useGetPostsByAddress = (address: string) =>
  useQuery<IGetAllPosts>({
    queryKey: ['getPostsByAddress', address],
    queryFn: () => getPostsByAddress(address),
  })

const getFeedByMongo = async () => {
  const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/global/mongodb`)
  return data
}

export const useGetFeedByMongo = () =>
  useQuery<GetFeedByMongo>({
    queryKey: ['getFeedByMongo'],
    queryFn: () => getFeedByMongo(),
  })

const createPost = async (newPost: PostCreateMongo): Promise<PostCreateMongo> => {
  const response = await axios.post(`${import.meta.env.VITE_WECOOP_API}/post`, newPost) // Substitua pela URL da sua API
  return response.data
}

export const useCreatePost = () => {
  const queryClient = useQueryClient()

  return useMutation<PostCreateMongo, Error, PostCreateMongo>({
    mutationFn: createPost,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getFeedByMongo'] })
    },
  })
}

const createReply = async (newReply: ReplyCreateMongo): Promise<ReplyCreateMongo> => {
  const response = await axios.post(`${import.meta.env.VITE_WECOOP_API}/replies`, newReply)
  return response.data
}

export const useCreateReply = () => {
  return useMutation<ReplyCreateMongo, Error, ReplyCreateMongo>({
    mutationFn: createReply,
  })
}

const createLike = async (newLike: LikeCreateMongo): Promise<LikeCreateMongo> => {
  const response = await axios.post(`${import.meta.env.VITE_WECOOP_API}/likes`, newLike)
  return response.data
}

export const useCreateLike = () => {
  return useMutation<LikeCreateMongo, Error, LikeCreateMongo>({
    mutationFn: createLike,
  })
}

const createVote = async (newVote: VoterCreateMongo): Promise<VoterCreateMongo> => {
  const response = await axios.post(`${import.meta.env.VITE_WECOOP_API}/polls/vote`, newVote)
  return response.data
}

export const useCreateVote = () => {
  return useMutation<VoterCreateMongo, Error, VoterCreateMongo>({
    mutationFn: createVote,
  })
}

const claimPoll = async (voterAddress: string, pollId: number) => {
  const response = await axios.patch(`${import.meta.env.VITE_WECOOP_API}/polls/${voterAddress}/${pollId}/claim`)
  return response.data
}

export const useClaimPoll = () => {
  return useMutation<void, Error, { voterAddress: string; pollId: number }>({
    mutationFn: ({ voterAddress, pollId }) => claimPoll(voterAddress, pollId),
  })
}
