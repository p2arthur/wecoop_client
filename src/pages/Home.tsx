import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { MenuFeed } from '../components/templates/MenuFeed'
import { ProfileMenu } from '../components/templates/ProfileMenu'
import { AssetId, usePosts } from '../context/Posts/Posts'
import { isMobileDevice } from '../utils/isMobile'

const Home = () => {
  const { postList, handleNewReply, isLoading, activeFeed, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const isMobile = isMobileDevice()

  const [activeAssetId, setActiveAssetId] = useState<AssetId | null>(null)

  const handleChangeAssetId = (assetId: AssetId | null) => {
    setActiveAssetId(assetId)
  }

  const filteredPosts =
    postList?.filter(
      (post) => (activeAssetId ? post.assetId === activeAssetId : true) && (activeFeed === 'personalized' ? post.isPersonalized : true), // Ajuste conforme a lógica do feed
    ) || []

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      {!isMobile && (
        <div className="flex border-t-0 flex-col w-1/6 items-start justify-between border-2 border-b-0 dark:border-gray-800 border-gray-950 bg-gray-100 dark:bg-gray-900">
          <MenuFeed
            hasFeedPosts={activeAccount !== null}
            activeFeed={activeFeed || 'global'}
            handleChangeFeed={handleChangeFeed}
            handleChangeAssetId={handleChangeAssetId}
            activeAssetId={activeAssetId}
          />
        </div>
      )}
      <div className="p-2 border-2 w-4/6 border-gray-950 dark:border-gray-800 h-screen flex flex-col gap-5 w-full h-screen">
        <div className=" bg-gray">
          <PostInput />
        </div>
        {filteredPosts.length > 0 && (
          <div className="overflow-y-hidden h-full">
            <FeedComponent postList={filteredPosts} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}
      </div>
      {!isMobile && <ProfileMenu />}
    </div>
  )
}

export default Home
