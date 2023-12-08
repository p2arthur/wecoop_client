import axios from 'axios'

export interface PostProps {
  text?: string
  creator_address?: string
  transaction_id?: string
  status?: 'loading' | 'accepted' | 'denied'
  timestamp?: number
  country?: string
  nfd?: string
}

export class Post {
  postData: PostProps = {}
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
}
