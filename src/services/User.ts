import axios from 'axios'
import { minidenticon } from 'minidenticons'
import { User as UserInterface } from '../services/api/types'
import { Feed } from './Feed'
import { Post } from './api/types'

export class User {
  constructor(
    private userData: UserInterface,
    private feedServices: Feed = new Feed(),
  ) {}

  async signTransaction(post: Post) {
    this.feedServices.setAllPosts(post)
  }

  public async getUserByWalletAddress(walletAddress: string) {
    const { data } = await axios.get(`http://localhost:3000/user/${walletAddress}`)
    return data
  }

  public async setUser(walletAddress: string) {
    const { data } = await this.getUserByWalletAddress(walletAddress)
    this.userData = data
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
