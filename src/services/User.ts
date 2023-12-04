import { Feed } from './Feed'
import { PostProps } from './Post'

export interface UserInterface {
  address: string
}

export class User {
  constructor(
    private userData: UserInterface,
    private feedServices: Feed = new Feed(),
  ) {}

  async signTransaction(post: PostProps) {
    this.feedServices.setAllPosts(post)
    console.log('user sign transaction')
  }
}
