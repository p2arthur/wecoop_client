import { useQuery } from '@tanstack/react-query'
import axios from 'axios'
import base64 from 'base-64'
import { NotePrefix } from '../../enums/notePrefix'
import { NfdListProps, Post, PostProps } from '../Post'
import { TransactionInterface } from '../Transaction'
import { GetAllPostsResponse } from './types'

export const getAllPosts = async () => {
  const postService = new Post()
  const feedData: PostProps[] = []

  const nfds: NfdListProps[] = []

  const apiUrl = `https://mainnet-idx.algonode.cloud/v2/accounts/${
    import.meta.env.VITE_WECOOP_MAIN_ADDRESS
  }/transactions?note-prefix=${base64.encode(NotePrefix.WeCoopAll)}`

  const { data } = await axios.get<GetAllPostsResponse>(apiUrl)
  const { transactions, 'current-round': currentRound, 'next-token': nextToken } = data

  const filterTransactions = (type: string) =>
    transactions?.filter((transaction: TransactionInterface) => base64.decode(transaction.note).includes(type))

  const postsFiltered = filterTransactions(NotePrefix.WeCoopPost)
  const likesFiltered = filterTransactions(NotePrefix.WeCoopLike)
  const repliesFiltered = filterTransactions(NotePrefix.WeCoopReply)

  const uniquePostIds = new Set(feedData.map((post) => post.transaction_id))

  postsFiltered.map(async (transaction) => {
    const { note, sender, id } = transaction
    if (transaction.note) {
      if (!uniquePostIds.has(id)) {
        const nfd = await postService.getPostNfd(transaction.sender).then((nfd) => nfd && nfds.push({ address: transaction.sender, nfd }))

        const likes =
          likesFiltered?.filter((likeTransaction: TransactionInterface) => base64.decode(likeTransaction.note)?.split(':')[3] === id) || []

        const replies =
          repliesFiltered
            ?.map(async (replyTransaction) => {
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
                    nfd: nfds.find((nfd) => nfd.address === replyTransaction.sender)?.nfd,
                    replies: [],
                  }
                : null
            })
            ?.filter((reply) => reply !== null) || []

        const roundTime = transaction['round-time']
        const postData: PostProps = {
          text: note,
          creator_address: sender,
          transaction_id: id,
          timestamp: roundTime,
          status: 'accepted',
          likes: likes.length,
          replies: replies,
          nfd,
        }

        await postService.setPostData(postData).then((post) => {
          feedData.push(post)
          uniquePostIds.add(id)
        })
      }
    }
  })

  return { posts: feedData, next: nextToken, currentRound }
}

export const useGetAllPosts = () => useQuery({ queryKey: ['getAllPosts'], queryFn: () => getAllPosts() })
