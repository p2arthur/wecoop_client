import axios from 'axios'
import { Post as PostInterface } from './api/types'

export interface NfdListProps {
  nfd: string
  address: string
}

export class Post {
  postData: PostInterface = {
    text: '',
    creator_address: '',
    transaction_id: '',
    timestamp: null,
    country: '',
    nfd: '',
    likes: [],
    replies: [],
    status: null,
  }

  public async setPostData(postDataInput: PostInterface): Promise<PostInterface> {
    const text = this.decryptPostNote(postDataInput.text!)
    const allText = text.split(':')
    this.postData = {
      text: allText[3],
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
      timestamp: postDataInput.timestamp! * 1000,
      country: allText[2],
      likes: postDataInput.likes,
      replies: postDataInput.replies,
    }
    return this.postData
  }

  private decryptPostNote(note: string): string {
    const decodedString = atob(note)

    return decodedString
  }

  public async getPostNfd(address: string) {
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
