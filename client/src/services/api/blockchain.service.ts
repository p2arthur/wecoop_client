import axios from 'axios/index'
import base64 from 'base-64'
import { PostProps } from '../Post'
import { TransactionInterface } from '../Transaction'

const getAllPosts = async (): Promise<PostProps[]> => {
  try {
    const { data } = await axios.get(
      `https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=${base64.encode(
        'wecoop',
      )}`,
    )

    const transactions = data?.transactions // Ensure transactions is defined

    const postsFiltered = transactions?.filter((transaction: TransactionInterface) =>
      base64.decode(transaction.note).includes('wecoop-v1post'),
    )
    const likesFiltered = transactions?.filter((transaction: TransactionInterface) =>
      base64.decode(transaction.note).includes('wecoop-v1like'),
    )

    const postData: PostProps[] = []

    for (const transaction of postsFiltered || []) {
      if (transaction.note) {
        const { note, sender, id } = transaction

        const likes = (likesFiltered || []).filter((likeTransaction: TransactionInterface) => {
          const noteDecoded = base64.decode(likeTransaction.note)?.split(':')
          return noteDecoded[3] === id
        })

        const roundTime = transaction['round-time']
        const postFormatted: PostProps = {
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

    return postData
  } catch (error) {
    // Handle errors here
    console.error('Error fetching posts:', error)
    throw error // Rethrow the error or handle it appropriately
  }
}

export default getAllPosts
