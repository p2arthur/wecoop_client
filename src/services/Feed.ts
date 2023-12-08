import axios from 'axios'
import { Post, PostProps } from './Post'

export class Feed {
  feedData: PostProps[] = []
  constructor(private post: Post = new Post()) {}

  public async getAllPosts() {
    const { data } = await axios.get(
      'https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=d2Vjb29wOnBvc3Q%3D',
    )

    const { transactions } = data

    let postData: PostProps = {}

    for (let transaction of transactions) {
      if (transaction.note) {
        const { note, sender, id } = transaction

        const roundTime = transaction['round-time']
        postData = { text: note, creator_address: sender, transaction_id: id, timestamp: roundTime, status: 'accepted' }

        const post = await this.post.setPostData(postData)
        this.feedData.push(post)
      }
    }

    return this.feedData
  }

  public setAllPosts(post: PostProps) {
    this.feedData.push(post)
  }
}
