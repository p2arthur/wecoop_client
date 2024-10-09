import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { GetFeedByMongo, IGetAllPosts, Post } from './types'

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
