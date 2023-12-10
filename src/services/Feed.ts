import axios from 'axios'
import base64 from 'base-64'
import { Post, PostProps } from './Post'
import { TransactionInterface } from './Transaction'

export class Feed {
  feedData: PostProps[] = []

  constructor(private post: Post = new Post()) {}

  public async getAllPosts() {
    try {
      const { data } = await axios.get(
        `https:testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=${base64.encode(
          'wecoop',
        )}`,
      )

      const { transactions } = data

      console.log('data from feed class', transactions)

      const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:post'),
      )

      console.log('posts filtered', postsFiltered)

      const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
        base64.decode(transaction.note).includes('wecoop:like'),
      )

      for (const transaction of postsFiltered || []) {
        if (transaction.note) {
          const { note, sender, id } = transaction

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

          this.feedData = [...this.feedData, post]
        }
      }

      return this.feedData
    } catch (error) {
      console.error('Error fetching posts:', error)
      throw error
    }
  }

  public setAllPosts(post: PostProps) {
    this.feedData.push(post)
  }

  public async getPostsByAddress(address: string) {
    const allPosts = await this.getAllPosts()
    console.log('allposts', allPosts)
    console.log(address)
    const postsByAdresss = allPosts.filter((post) => post.creator_address === address)

    console.log('posts by address', postsByAdresss)

    return postsByAdresss
  }
}
