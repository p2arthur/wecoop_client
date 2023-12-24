import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import { User } from './types'

const getUserInfo = async (address: string) => {
  const { data } = await axios.get(`https://scoopsocial-production.up.railway.app/user/${address}`)

  return data
}

export const useGetUserInfo = (address: string) =>
  useQuery<User>({
    queryKey: ['getUserInfo', address],
    queryFn: () => getUserInfo(address),
  })
