import axios from 'axios'

export interface PostProps {
  text: string
  creator_address: string
  transaction_id: string | null
  status: 'loading' | 'accepted' | 'denied' | string | null
  timestamp: number | null
  country?: string
  nfd?: string
  likes?: number
  replys?: PostProps[]
}

export class Post {
  postData: PostProps = { text: '', creator_address: '', transaction_id: null, status: null, timestamp: null, likes: undefined }

  constructor() {}

  public async setPostData(postDataInput: PostProps): Promise<PostProps> {
    const text = this.decryptPostNote(postDataInput.text!)
    const allText = text.split(':')
    const nfd = await this.getPostNfd(postDataInput.creator_address!)

    this.postData = {
      text: allText[3],
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
      timestamp: postDataInput.timestamp! * 1000,
      country: allText[2],
      nfd: nfd,
      likes: postDataInput.likes,
      replys: postDataInput.replys,
    }
    return this.postData
  }

  private decryptPostNote(note: string): string {
    const decodedString = atob(note)

    return decodedString
  }

  private async getPostNfd(address: string) {
    try {
      const { data } = await axios.get(`https://api.nf.domains/nfd/lookup?address=${address}&view=tiny&allowUnverified=true`)

      const nfd = data[address].name
      return nfd
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
