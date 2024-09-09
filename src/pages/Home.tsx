import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'
import { Feed } from '../services/Feed'
import { Post } from '../services/api/types'
import { MenuFeed } from '../components/templates/MenuFeed'

const Home = () => {
  const { postList, handleNewReply, isLoading } = usePosts()
  const { activeAccount } = useWallet()
  const [feedPosts, setFeedPosts] = useState<Post[]>()
  const [activeTab, setActiveTab] = useState<'personalized' | 'global'>('global')
  const feedServices = new Feed()
  const getFeedPosts = async (walletAddress: string) => {
    const posts = await feedServices.getFeedByWalletAddress(walletAddress)
    setFeedPosts(posts)
  }

  useEffect(() => {
    const getFeedPostsEffect = async () => {
      if (activeAccount) {
        await getFeedPosts(activeAccount?.address || '')
      }

      return feedPosts
    }

    getFeedPostsEffect()
  }, [activeAccount])

  return (
    <div className="flex dark:bg-gray-950 bg-gray-100 overflow-hidden">
      <MenuFeed hasFeedPosts={(feedPosts && feedPosts?.length > 0) || false} activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="p-2 border-2 border-gray-950 dark:border-gray-800 h-screen flex flex-col gap-5 w-full">
        <div className="mt-12 bg-gray">
          <PostInput />
        </div>
        {activeTab === 'personalized' && feedPosts && (
          <div className="overflow-y-hidden h-full">
            {' '}
            {/* Make this container scrollable */}
            <FeedComponent postList={feedPosts!} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}

        {activeTab === 'global' && (
          <div className="overflow-y-hidden h-full">
            {' '}
            {/* Make this container scrollable */}
            <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
