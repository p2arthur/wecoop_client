import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Feed } from '../services/Feed'
import { PostProps } from '../services/Post'

const FeedPage = () => {
  const [feedPosts, setFeedPosts] = useState<PostProps[]>([])
  const { walletAddress } = useParams<{ walletAddress: string }>()

  const feedServices = new Feed()

  const getFeedPosts = async (walletAddress: string) => {
    const posts = await feedServices.getFeedByWalletAddress(walletAddress)
    setFeedPosts(posts)

    console.log('feed posts', feedPosts)
  }

  useEffect(() => {
    getFeedPosts(walletAddress!)
  }, [])

  return <div>Feed</div>
}

export default FeedPage
