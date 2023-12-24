import axios from 'axios'
import base64 from 'base-64'
import { NotePrefix } from '../enums/notePrefix'
import { Post as PostInterface } from '../services/api/types'
import { getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { Post as PostService } from './Post'
import { TransactionInterface } from './Transaction'

export class Feed {
  feedData: PostInterface[] = []
  server = getIndexerConfigFromViteEnvironment().server

  constructor(private postServices: PostService = new PostService()) {}

  public async getAllPosts({ next }: { next?: string | null }) {
    try {
      const { data } = await axios.get(`https://scoopsocial-production.up.railway.app/feed`)

      const { transactions, 'current-round': currentRound, 'next-token': nextToken } = data

      const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:post'),
      )

      const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:like'),
      )

      const repliesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:reply'),
      )

      const uniquePostIds = new Set(this.feedData.map((post) => post.transaction_id))

      for (const transaction of postsFiltered || []) {
        if (transaction.note) {
          const { note, sender, id } = transaction

          if (!uniquePostIds.has(id)) {
            const likes = (likesFiltered || []).filter((likeTransaction: TransactionInterface) => {
              const noteDecoded = base64.decode(likeTransaction.note)?.split(':')
              return noteDecoded[3] === id
            })

            const replies = (repliesFiltered || [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((replyTransaction: any) => {
                const noteDecoded = base64.decode(replyTransaction.note)?.split(':')
                const replyTransactionId = noteDecoded[3]
                const roundTime = replyTransaction['round-time']

                if (replyTransactionId === id) {
                  return {
                    text: noteDecoded[4],
                    creator_address: replyTransaction.sender,
                    transaction_id: replyTransaction.id,
                    timestamp: roundTime * 1000,
                    status: 'accepted',
                    likes: 0,
                    replies: [],
                  }
                } else {
                  return null // Skip this reply if the transaction ID doesn't match
                }
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((reply: any) => reply !== null)

            const roundTime = transaction['round-time']
            const postData: PostInterface = {
              text: note,
              creator_address: sender,
              transaction_id: id,
              timestamp: roundTime,
              status: 'accepted',
              likes: likes.length,
              replies: replies,
              country: '',
            }

            const post = await this.postServices.setPostData(postData)

            this.feedData.push(post)

            uniquePostIds.add(id)
          }
        }
      }

      return { data: this.feedData, next: nextToken, currentRound }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  public setAllPosts(post: PostInterface) {
    this.feedData.push(post)
  }

  public async getPostsByAddress(address: string) {
    try {
      const { data } = await axios.get(
        `https://mainnet-idx.algonode.cloud/v2/accounts/${address}/transactions?note-prefix=${base64.encode(NotePrefix.WeCoopAll)}`,
      )

      const { transactions } = data

      const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:post'),
      )

      const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:like'),
      )

      const repliesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop-v1:reply'),
      )

      const uniquePostIds = new Set(this.feedData.map((post) => post.transaction_id))

      for (const transaction of postsFiltered || []) {
        if (transaction.note) {
          const { note, sender, id } = transaction

          if (!uniquePostIds.has(id)) {
            const replies = (repliesFiltered || [])
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .map((replyTransaction: any) => {
                const noteDecoded = base64.decode(replyTransaction.note)?.split(':')
                const replyTransactionId = noteDecoded[3]
                const roundTime = replyTransaction['round-time']

                if (replyTransactionId === id) {
                  return {
                    text: noteDecoded[4],
                    creator_address: replyTransaction.sender,
                    transaction_id: replyTransaction.id,
                    timestamp: roundTime * 1000,
                    status: 'accepted',
                    likes: likesFiltered ? likesFiltered.length : 0,
                    replies: [],
                  }
                } else {
                  return null // Skip this reply if the transaction ID doesn't match
                }
              })
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              .filter((reply: any) => reply !== null)

            const roundTime = transaction['round-time']
            const postData: PostInterface = {
              text: note,
              creator_address: sender,
              transaction_id: id,
              timestamp: roundTime,
              status: 'accepted',
              likes: likesFiltered.length,
              replies: replies,
              country: '',
            }

            const post = await this.postServices.setPostData(postData)

            this.feedData.push(post)

            uniquePostIds.add(id)
          }
        }
      }

      return { data: this.feedData }
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  public async getFeedByWalletAddress(walletAddress: string): Promise<PostInterface[]> {
    const { data } = await axios.get(`http://localhost:3000/feed/by/${walletAddress}`)
    console.log('feed data', data)

    this.feedData = data

    return this.feedData
  }
}
