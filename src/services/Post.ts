export interface PostProps {
  text?: string
  creator_address?: string
  transaction_id?: string
  status?: 'loading' | 'accepted' | 'denied'
  timestamp?: number
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
    const unicodeMatches = text.match(/[\u009Fâ]/i)
    console.log(unicodeMatches)
    const convertedText = text.replace(/[\u009Fâ]/i, (match) => String.fromCodePoint(match.codePointAt(0)!))
    console.log('convertedp', convertedText)

    this.postData = {
      text: text,
      creator_address: postDataInput.creator_address,
      transaction_id: postDataInput.transaction_id,
      status: postDataInput.status,
      timestamp: postDataInput.timestamp! * 1000,
    }
    return this.postData
  }
}
