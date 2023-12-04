export interface PostProps {
  text?: string
  creator_address?: string
  transaction_id?: string
  status?: 'loading' | 'accepted' | 'denied'
  timestamp?: number
  country?: string
}

export class Post {
  postData: PostProps = {}
  constructor() {}

  private decryptPostNote(note: string): string {
    const decodedString = atob(note)
    return decodedString
  }

  public setPostData(postDataInput: PostProps): PostProps {
    const text = this.decryptPostNote(postDataInput.text!)

    const allText = text.split(' - ')

    this.postData = {
      text: allText[1] || allText[0],
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
      timestamp: postDataInput.timestamp! * 1000,
      country: allText[1] ? allText[0] : undefined,
    }
    return this.postData
  }
}
