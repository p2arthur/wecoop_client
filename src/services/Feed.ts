import axios from 'axios'

import { Post as PostInterface } from '../services/api/types'
import { getIndexerConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'
import { Post as PostService } from './Post'

export class Feed {
  feedData: PostInterface[] = []
  server = getIndexerConfigFromViteEnvironment().server

  constructor(private postServices: PostService = new PostService()) {}

  public setAllPosts(post: PostInterface) {
    this.feedData.push(post)
  }

  public async getPostsByAddress(address: string) {
    const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/${address}`)
  }

  public async getFeedByWalletAddress(walletAddress: string): Promise<PostInterface[]> {
    const { data } = await axios.get(`${import.meta.env.VITE_WECOOP_API}/feed/by/${walletAddress}`)

    this.feedData = data

    return this.feedData
  }
}
