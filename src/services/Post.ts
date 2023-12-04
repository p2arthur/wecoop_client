export interface PostProps {
  text?: string
  creator_address?: string
  transaction_id?: string
}

export class Post {
  postData: PostProps = {}
  constructor() {}

  private decryptPostNote(note: string): string {
    const decodedString = atob(note)
    console.log(decodedString)
    return decodedString
  }

  public setPostData(postDataInput: PostProps): PostProps {
    const text = this.decryptPostNote(postDataInput.text!)
    this.postData = { text, creator_address: postDataInput.creator_address, transaction_id: postDataInput.transaction_id }
    console.log(this.postData)
    return this.postData
  }
}
