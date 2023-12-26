import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { User } from './types'

const getUserInfo = async (address: string) => {
  const { data } = await axios.get(`http://localhost:3000/user/${address}`)

  return data.data
}

export const useGetUserInfo = (address: string) =>
  useQuery<User>({
    queryKey: ['getUserInfo', address],
    queryFn: () => getUserInfo(address),
  })
