import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { IGetAllPosts } from './types'

export const getAllPosts = async () => {
  const { data } = await axios.get('https://scoopsocial-production.up.railway.app/posts')
  return data
}

export const useGetAllPosts = () => useQuery<IGetAllPosts>({ queryKey: ['getAllPosts'], queryFn: () => getAllPosts() })

export const getPostsByAddress = async (address: string) => {
  const { data } = await axios.get(`http://localhost:3000/feed/${address}`)
  return data
}

export const useGetPostsByAddress = (address: string) =>
  useQuery<IGetAllPosts>({
    queryKey: ['getPostsByAddress', address],
    queryFn: () => getPostsByAddress(address),
  })
