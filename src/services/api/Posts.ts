import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IGetAllPosts, Post } from './types'

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
