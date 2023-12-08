import axios from 'axios'
import base64 from 'base-64'

export interface PostProps {
  text: string
  creator_address: string
  transaction_id: string | null
  status: 'loading' | 'accepted' | 'denied' | null
  timestamp: number | null
  country?: string
  nfd?: string
}

export class Post {
  postData: PostProps = { text: '', creator_address: '', transaction_id: null, status: null, timestamp: null }
  constructor() {}

  private decryptPostNote(note: string): string {
    const decodedString = atob(note)

    return decodedString
  }

  public async setPostData(postDataInput: PostProps): Promise<PostProps> {
    const text = this.decryptPostNote(postDataInput.text!)
    const allText = text.split(':')
    console.log(allText)
    const nfd = await this.getPostNfd(postDataInput.creator_address!)

    this.postData = {
      text: allText[3],
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
      timestamp: postDataInput.timestamp! * 1000,
      country: allText[2],
      nfd: nfd,
    }
    return this.postData
  }

  private async getPostNfd(address: string) {
    try {
      console.log('Getting nfd')
      const { data } = await axios.get(`https://api.testnet.nf.domains/nfd/lookup?address=${address}`)

      const nfd = data[address].name
      console.log(nfd)
      return nfd
    } catch (error) {
      console.error(error)
      return null
    }
  }

  private async getPostLikes(transactionId: string) {
    const notePrefix = base64.encode(`wecoop:like:${transactionId}`)

    const { data } = await axios.get(
      `https://testnet-idx.algonode.cloud/v2/accounts/GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ/transactions?note-prefix=${notePrefix}`,
    )

    const { transactions } = data
  }
}
