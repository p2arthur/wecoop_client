import axios from 'axios'
import { minidenticon } from 'minidenticons'
import { AssetId } from '../enums/assetId'
import { Feed } from './Feed'
import { PostProps } from './Post'

export interface UserInterface {
  address: string
  avatarUri?: string
  nfd?: string
  balance?: number
}

export class User {
  constructor(
    private userData: UserInterface,
    private feedServices: Feed = new Feed(),
  ) {}

  async signTransaction(post: PostProps) {
    this.feedServices.setAllPosts(post)
  }

  public async getUser() {
    const user = await this.setUser()
    return user
  }

  public async setUser() {
    const avatarUri = this.generateIdIcon(this.userData.address)
    const nfd = await this.getUserNfd(this.userData.address)
    const balance = await this.getUserAssetBalance(this.userData.address, AssetId.coopCoin)
    this.userData = { address: this.userData.address, avatarUri, nfd, balance }
    return this.userData
  }

  public generateIdIcon(creatorAddress: string): string {
    const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
    return svgURI
  }

  private async getUserNfd(address: string) {
    try {
      const { data } = await axios.get(`https://api.nf.domains/nfd/lookup?address=${address}&view=tiny&allowUnverified=true`)

      const nfd = data[address].name
      return nfd
    } catch (error) {
      console.error(error)
      return null
    }
  }

  public async getUserAssetBalance(userAddres: string, assetId: number): Promise<number> {
    try {
      const { data: userAssetsData } = await axios.get(
        `https://mainnet-idx.algonode.cloud/v2/accounts/${userAddres}/assets?asset-id=${assetId}&include-all=false`,
      )

      const { assets } = userAssetsData

      const { data: assetData } = await axios.get(`https://mainnet-idx.algonode.cloud/v2/assets/${assetId}`)

      const assetDecimals = assetData['asset'].params.decimals

      const balance = Number.parseFloat((assets[0].amount / 10 ** assetDecimals).toFixed(2))
      return balance
    } catch (error) {
      return 0
    }
  }
}
