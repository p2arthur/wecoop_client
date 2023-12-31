import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'
import { Feed } from '../services/Feed'
import { useGetUserInfo } from '../services/api/Users'
import { Post } from '../services/api/types'

const Home = () => {
  const { postList, handleNewReply, isLoading } = usePosts()
  const { activeAccount } = useWallet()
  const [feedPosts, setFeedPosts] = useState<Post[]>()
  const [activeTab, setActiveTab] = useState<'personalized' | 'global'>('global')
  const { data } = useGetUserInfo(activeAccount?.address!)
  const feedServices = new Feed()
  const getFeedPosts = async (walletAddress: string) => {
    const posts = await feedServices.getFeedByWalletAddress(walletAddress)
    setFeedPosts(posts)
  }

  useEffect(() => {
    const getFeedPostsEffect = async () => {
      if (activeAccount) {
        await getFeedPosts(activeAccount?.address!)
      }

      return feedPosts
    }

    getFeedPostsEffect()
  }, [activeAccount])

  return (
    <div className="flex flex-col p-2 dark:bg-gray-950 bg-gray-100">
      <div className="mt-20 bg-gray">
        <PostInput />
      </div>
      <div className="flex mt-6 items-center justify-around gap-10 border-2 border-b-0 dark:border-gray-800  border-gray-950 bg-gray-100 dark:bg-gray-900 p-2 w-full md:w-96">
        {feedPosts ? (
          <div className="w-1/2 flex justify-center">
            <p
              onClick={() => {
                setActiveTab('personalized')
              }}
              className={`font-bold text-xl cursor-pointer hover:scale-105 ${
                activeTab === 'personalized' ? 'border-b-2 border-gray-900 dark:border-gray-600' : 'border-b-2 border-transparent'
              }`}
            >
              Your Feed
            </p>
          </div>
        ) : (
          <p className="font-bold text-gray-400 text-xl cursor-pointer">Your feed</p>
        )}
        <div className="w-1/2 flex justify-center">
          <p
            onClick={() => {
              setActiveTab('global')
            }}
            className={`font-bold text-xl cursor-pointer  ${
              activeTab === 'global' ? 'border-b-2 border-gray-900 dark:border-gray-300' : 'border-b-2 border-transparent hover:scale-105'
            }`}
          >
            Global Feed 🌎
          </p>
        </div>
      </div>
      <div className="p-2 border-2 border-gray-950 dark:border-gray-800 dark:bg-gray-900">
        {activeTab === 'personalized' && feedPosts && (
          <>
            <FeedComponent postList={feedPosts!} isLoading={isLoading} handleNewReply={handleNewReply} />
          </>
        )}

        {activeTab === 'global' && (
          <>
            <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
          </>
        )}
      </div>
    </div>
  )
}

export default Home
