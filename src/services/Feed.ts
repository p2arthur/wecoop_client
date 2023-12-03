import axios from 'axios'
export interface Post {
  text?: string
  creator_address?: string
}

export class Feed {
  feedData: Post[] = []

  public async getAllPosts() {
    const { data } = await axios.get(
      'https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?asset-id=10458941',
    )

    const { transactions } = data

    let postData: Post = {}

    for (let transaction of transactions) {
      if (transaction.note) {
        postData = { text: transaction.note, creator_address: transaction.sender }
        this.feedData.push(postData)
      }
    }

    return this.feedData
  }
}
