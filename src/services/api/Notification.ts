import axios from 'axios'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'

interface Notification {
  id: string
  transaction_id?: string | null
  pollId?: number | null
  wallet_address: string
  text: string
  read: boolean
}

const getNotificationsByWalletAddress = async (walletAddress: string): Promise<Notification[]> => {
  const response = await axios.get<Notification[]>(`${import.meta.env.VITE_WECOOP_API}/notifications/${walletAddress}`)
  return response.data
}

export const useGetNotificationsByWalletAddress = (walletAddress: string) =>
  useQuery({
    queryKey: ['getNotificationsByWalletAddress', walletAddress],
    queryFn: () => getNotificationsByWalletAddress(walletAddress),
  })

interface MarkAsReadById {
  id: string
}

const markAsRead = async ({ id }: MarkAsReadById): Promise<void> => {
  return await axios.patch(`${import.meta.env.VITE_WECOOP_API}/notifications/mark-read/${id}`)
}

export const useMarkAsRead = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, MarkAsReadById>({
    mutationFn: markAsRead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNotificationsByWalletAddress'] })
    },
  })
}

interface MarkAsReadByPoll {
  walletAddress: string
  pollId: number
}

const markAsReadByPoll = async ({ walletAddress, pollId }: MarkAsReadByPoll): Promise<void> => {
  return await axios.patch(`${import.meta.env.VITE_WECOOP_API}/notifications/mark-read/${walletAddress}/${pollId}`)
}

export const useMarkAsReadByPoll = () => {
  const queryClient = useQueryClient()
  return useMutation<void, Error, MarkAsReadByPoll>({
    mutationFn: markAsReadByPoll,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['getNotificationsByWalletAddress'] })
    },
  })
}
