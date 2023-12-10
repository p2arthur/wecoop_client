import axios from 'axios/index'
import base64 from 'base-64'
import { Transaction } from 'algosdk'
import { PostProps } from '../Post'

const getAllPosts = async () => {
  const { data } = await axios.get(
    `https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=${base64.encode(
      'wecoop',
    )}`,
  )

  const { transactions } = data

  const postsFiltered = transactions?.filter((transaction: Transaction) => base64.decode(transaction.note).includes('wecoop:post'))
  const likesFiltered = transactions?.filter((transaction: Transaction) => base64.decode(transaction.note).includes('wecoop:like'))

  const postData: PostProps[] = []

  for (const transaction of postsFiltered) {
    if (transaction.note) {
      const { note, sender, id } = transaction

      const likes = likesFiltered.filter((likeTransaction: Transaction) => {
        const noteDecoded = base64.decode(likeTransaction.note)?.split(':')
        return noteDecoded[3] === id
      })

      const roundTime = transaction['round-time']
      const postFormatted = {
        text: note,
        creator_address: sender,
        transaction_id: id,
        timestamp: roundTime,
        status: 'accepted',
        likes: likes.length,
      }

      postData.push(postFormatted)
    }
  }

  return this.feedData
}
