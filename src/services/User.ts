import { minidenticon } from 'minidenticons'
import { Feed } from './Feed'
import { PostProps } from './Post'

export interface UserInterface {
  address: string
  avatarUri?: string
}

export class User {
  constructor(
    private userData: UserInterface,
    private feedServices: Feed = new Feed(),
  ) {}

  async signTransaction(post: PostProps) {
    this.feedServices.setAllPosts(post)
  }

  public setUser() {
    const avatarUri = this.generateIdIcon(this.userData.address)

    this.userData = { address: this.userData.address, avatarUri }

    return this.userData
  }

  public generateIdIcon(creatorAddress: string): string {
    const svgURI = 'data:image/svg+xml;utf8,' + encodeURIComponent(minidenticon(creatorAddress))

    console.log(svgURI)

    return svgURI
  }
}
