import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { ProfileMenu } from '../components/templates/FeaturedMenu'
import { MenuFeed } from '../components/templates/MenuFeed'
import { AssetId, usePosts } from '../context/Posts/Posts'
import { isMobileDevice } from '../utils/isMobile'

const Home = () => {
  const { postList, handleNewReply, isLoading, activeFeed, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const isMobile = isMobileDevice()
  const navigate = useNavigate()

  const [activeAssetId, setActiveAssetId] = useState<AssetId | null>(null)

  const handleChangeAssetId = (assetId: AssetId | null) => {
    setActiveAssetId(assetId)
  }

  useEffect(() => {
    navigate('/global/796425061')
  }, [])

  const filteredPosts =
    postList?.filter(
      (post) => (activeAssetId ? post.assetId === activeAssetId : true) && (activeFeed === 'personalized' ? post.isPersonalized : true), // Ajuste conforme a lógica do feed
    ) || []

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      <div className="hidden md:flex border-t-0 flex-col w-3/12 items-start justify-between border-2 border-b-0 dark:border-gray-800 border-gray-950">
        <MenuFeed
          hasFeedPosts={activeAccount !== null}
          activeFeed={activeFeed || 'global'}
          handleChangeFeed={handleChangeFeed}
          handleChangeAssetId={handleChangeAssetId}
          activeAssetId={activeAssetId}
        />
      </div>

      <div className="p-2 border-2 w-full border-gray-950 dark:border-gray-800 flex flex-col gap-5 h-screen">
        <div className=" bg-gray">
          <PostInput />
        </div>
        {filteredPosts.length > 0 && (
          <div className="overflow-y-hidden  h-full">
            <FeedComponent postList={filteredPosts} isLoading={isLoading} handleNewReply={handleNewReply} />
          </div>
        )}
      </div>
      <div className="w-3/12 hidden md:flex">
        {' '}
        <ProfileMenu />
      </div>
    </div>
  )
}

export default Home
