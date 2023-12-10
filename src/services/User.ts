import axios from 'axios'
import { minidenticon } from 'minidenticons'
import { Feed } from './Feed'
import { PostProps } from './Post'

export interface UserInterface {
  address: string
  avatarUri?: string
  nfd?: string
}

export class User {
  constructor(
    private userData: UserInterface,
    private feedServices: Feed = new Feed(),
  ) {}

  async signTransaction(post: PostProps) {
    this.feedServices.setAllPosts(post)
  }

  public async getUser(address: string) {
    console.log('get user address', address)
    const user = await this.setUser()
    return user
  }

  public async setUser() {
    const avatarUri = this.generateIdIcon(this.userData.address)
    const nfd = await this.getUserNfd(this.userData.address)
    this.userData = { address: this.userData.address, avatarUri, nfd }
    return this.userData
  }

  public generateIdIcon(creatorAddress: string): string {
    const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
    return svgURI
  }

  private async getUserNfd(address: string) {
    try {
      const { data } = await axios.get(`https://api.testnet.nf.domains/nfd/lookup?address=${address}`)

      const nfd = data[address].name
      return nfd
    } catch (error) {
      console.error(error)
      return null
    }
  }
}
