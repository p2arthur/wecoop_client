import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FeedComponent from '../components/Feed'
import { Feed } from '../services/Feed'
import { Post } from '../services/api/types'

const FeedPage = () => {
  const [feedPosts, setFeedPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const { walletAddress } = useParams<{ walletAddress: string }>()

  const feedServices = new Feed()

  const getFeedPosts = async (walletAddress: string) => {
    setIsLoading(true)
    const posts = await feedServices.getFeedByWalletAddress(walletAddress)
    setFeedPosts(posts)
    setIsLoading(false)
  }

  useEffect(() => {
    if (feedPosts.length <= 0) {
      getFeedPosts(walletAddress!)
    }
  }, [feedPosts, walletAddress])

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <p className="font-bold text-2xl">Feed - </p>
      {<FeedComponent postList={feedPosts} isLoading={isLoading} />}
    </div>
  )
}

export default FeedPage
