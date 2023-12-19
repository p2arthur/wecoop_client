import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import base64 from 'base-64'
import { NotePrefix } from '../../enums/notePrefix'
import { Post, PostProps } from '../Post'
import { TransactionInterface } from '../Transaction'

const getAllPosts = async ({ next }: { next?: string | null }) => {
  const postService = new Post()
  const feedData: PostProps[] = []

  const apiUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/${
    import.meta.env.VITE_WECOOP_MAIN_ADDRESS
  }/transactions?note-prefix=${base64.encode(NotePrefix.WeCoopAll)}&limit=20${next ? `&next=${next}` : ''}`

  const { data } = await axios.get(apiUrl)
  const { transactions, 'current-round': currentRound, 'next-token': nextToken } = data

  const filterTransactions = (type: string) =>
    transactions?.filter((transaction: TransactionInterface) => base64.decode(transaction.note).includes(type))

  const postsFiltered = filterTransactions(NotePrefix.WeCoopPost)
  const likesFiltered = filterTransactions(NotePrefix.WeCoopLike)
  const repliesFiltered = filterTransactions(NotePrefix.WeCoopReply)

  const uniquePostIds = new Set(feedData.map((post) => post.transaction_id))

  for (const transaction of postsFiltered || []) {
    if (transaction.note) {
      const { note, sender, id } = transaction

      if (!uniquePostIds.has(id)) {
        const likes =
          likesFiltered?.filter((likeTransaction: TransactionInterface) => base64.decode(likeTransaction.note)?.split(':')[3] === id) || []

        const replies =
          repliesFiltered
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.map((replyTransaction: any) => {
              const noteDecoded = base64.decode(replyTransaction.note)?.split(':')
              const replyTransactionId = noteDecoded[3]
              const roundTime = replyTransaction['round-time']

              return replyTransactionId === id
                ? {
                    text: noteDecoded[4],
                    creator_address: replyTransaction.sender,
                    transaction_id: replyTransaction.id,
                    timestamp: roundTime * 1000,
                    status: 'accepted',
                    likes: 0,
                    replies: [],
                  }
                : null
            })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            ?.filter((reply: any) => reply !== null) || []

        const roundTime = transaction['round-time']
        const postData: PostProps = {
          text: note,
          creator_address: sender,
          transaction_id: id,
          timestamp: roundTime,
          status: 'accepted',
          likes: likes.length,
          replies: replies,
        }

        const post = await postService.setPostData(postData)
        feedData.push(post)
        uniquePostIds.add(id)
      }
    }
  }

  return { posts: feedData, next: nextToken, currentRound }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any

export const useGetAllPosts = ({ next }: { next?: string | null }) =>
  useQuery({ queryKey: ['getAllPosts'], queryFn: () => getAllPosts({ next }) })
