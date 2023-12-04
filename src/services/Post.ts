export interface PostProps {
  text?: string
  creator_address?: string
  transaction_id?: string
  status?: 'loading' | 'accepted' | 'denied'
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
    this.postData = {
      text,
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
    }
    return this.postData
  }
}
