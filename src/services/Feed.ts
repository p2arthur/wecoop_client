import axios from 'axios'
import { Post, PostProps } from './Post'

export class Feed {
  feedData: PostProps[] = []
  constructor(private post: Post = new Post()) {}

  public async getAllPosts() {
    const { data } = await axios.get(
      'https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?asset-id=10458941',
    )

    const { transactions } = data

    let postData: PostProps = {}

    for (let transaction of transactions) {
      if (transaction.note) {
        console.log(transaction)
        const { note, sender, id } = transaction
        const roundTime = transaction['round-time']
        postData = { text: note, creator_address: sender, transaction_id: id, timestamp: roundTime, status: 'accepted' }

        const post = this.post.setPostData(postData)
        this.feedData.push(post)
      }
    }

    return this.feedData
  }

  public setAllPosts(post: PostProps) {
    this.feedData.push(post)
  }
}
