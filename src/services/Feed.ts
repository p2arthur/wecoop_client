import axios from 'axios'
import base64 from 'base-64'
import { NotePrefix } from '../enums/notePrefix'
import { getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { Post, PostProps } from './Post'
import { TransactionInterface } from './Transaction'

export class Feed {
  feedData: PostProps[] = []
  server = getIndexerConfigFromViteEnvironment().server

  constructor(private post: Post = new Post()) {}

  public async getAllPosts({ next }: { next?: string | null }) {
    try {
      console.log('server', this.server)

      const { data } = await axios.get(
        `https://mainnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=${base64.encode(
          NotePrefix.WeCoopPost,
        )}&limit=10${next ? `&next=${next}` : ''}`,
      )

      const { transactions, 'current-round': currentRound, 'next-token': nextToken } = data

      const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:post'),
      )

      const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:like'),
      )

      const uniquePostIds = new Set(this.feedData.map((post) => post.transaction_id))

      for (const transaction of postsFiltered || []) {
        if (transaction.note) {
          const { note, sender, id } = transaction

          // Check if the post with the same ID already exists
          if (!uniquePostIds.has(id)) {
            const likes = (likesFiltered || []).filter((likeTransaction: TransactionInterface) => {
              const noteDecoded = base64.decode(likeTransaction.note)?.split(':')
              return noteDecoded[3] === id
            })

            const roundTime = transaction['round-time']
            const postData: PostProps = {
              text: note,
              creator_address: sender,
              transaction_id: id,
              timestamp: roundTime,
              status: 'accepted',
              likes: likes.length,
            }

            const post = await this.post.setPostData(postData)

            this.feedData.push(post)

            // Add the post ID to the set to ensure uniqueness
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

  public setAllPosts(post: PostProps) {
    this.feedData.push(post)
  }

  public async getPostsByAddress(address: string) {
    try {
      const { data } = await axios.get(
        `https://mainnet-idx.algonode.cloud/v2/accounts/${address}/transactions?note-prefix=${base64.encode(NotePrefix.WeCoopPost)}`,
      )

      const { transactions, 'current-round': currentRound, 'next-token': nextToken } = data

      const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:post'),
      )

      const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:like'),
      )

      const uniquePostIds = new Set(this.feedData.map((post) => post.transaction_id))

      console.log('uniquePostIds', uniquePostIds)

      for (const transaction of postsFiltered || []) {
        if (transaction.note) {
          const { note, sender, id } = transaction

          // Check if the post with the same ID already exists
          if (!uniquePostIds.has(id)) {
            const likes = (likesFiltered || []).filter((likeTransaction: TransactionInterface) => {
              const noteDecoded = base64.decode(likeTransaction.note)?.split(':')
              return noteDecoded[3] === id
            })

            const roundTime = transaction['round-time']
            const postData: PostProps = {
              text: note,
              creator_address: sender,
              transaction_id: id,
              timestamp: roundTime,
              status: 'accepted',
              likes: likes.length,
            }

            const post = await this.post.setPostData(postData)

            this.feedData.push(post)

            // Add the post ID to the set to ensure uniqueness
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
}
