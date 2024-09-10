import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'
import { MenuFeed } from '../components/templates/MenuFeed'
import { ProfileMenu } from '../components/templates/ProfileMenu'
import { isMobileDevice } from '../utils/isMobile'
import { useWallet } from '@txnlab/use-wallet'

const Home = () => {
  const { postList, handleNewReply, isLoading, activeFeed, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const isMobile = isMobileDevice()

  return (
    <div className="flex  pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      {!isMobile && (
        <div className="flex  border-t-0 flex-col w-1/6 items-start justify-between border-2 border-b-0 dark:border-gray-800  border-gray-950 bg-gray-100 dark:bg-gray-900">
          <MenuFeed hasFeedPosts={activeAccount !== null} activeFeed={activeFeed || 'global'} handleChangeFeed={handleChangeFeed} />
        </div>
      )}
      <div className="p-2 border-2 w-4/6 border-gray-950 dark:border-gray-800 h-screen flex flex-col gap-5 w-full h-screen">
        <div className=" bg-gray">
          <PostInput />
        </div>
        {activeFeed === 'personalized' && (
          <div className="overflow-y-hidden h-full">
            <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}

        {activeFeed === 'global' && (
          <div className="overflow-y-hidden h-full">
            <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}
      </div>
      {!isMobile && <ProfileMenu />}
    </div>
  )
}

export default Home
