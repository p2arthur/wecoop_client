import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { User } from './types'

const getUserInfo = async (address: string) => {
  const { data } = await axios.get(`${import.meta.env.WECOOP_API}/user/${address}`)

  return data.data
}

export const useGetUserInfo = (address: string) =>
  useQuery<User>({
    queryKey: ['getUserInfo', address],
    queryFn: () => getUserInfo(address),
  })
