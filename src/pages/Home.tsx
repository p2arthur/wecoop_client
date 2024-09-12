import { useWallet } from '@txnlab/use-wallet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { ProfileMenu } from '../components/templates/FeaturedMenu'
import { MenuFeed } from '../components/templates/MenuFeed'
import { usePosts } from '../context/Posts/Posts'
import { useEffect } from 'react'

const Home = () => {
  const { postList, handleNewReply, isLoading, activeFeed, activeAssetId, handleFilterByAssetId, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const [params, setParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    navigate('/feed')
    if (activeFeed === 'global') {
      setParams({ type: 'global' })
    } else if (activeFeed === 'personalized') {
      setParams({ type: 'personalized' })
    } else if (activeFeed === 'coinFeed' && activeAssetId) {
      setParams({ type: 'coinFeed', assetId: activeAssetId.toString() })
    }
  }, [])

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      <div className="hidden md:flex border-t-0 flex-col w-3/12 items-start justify-between border-2 border-b-0 dark:border-gray-800 border-gray-950">
        <MenuFeed
          hasFeedPosts={activeAccount !== null}
          activeFeed={activeFeed || 'global'}
          handleChangeFeed={handleChangeFeed}
          handleChangeAssetId={handleFilterByAssetId}
          activeAssetId={activeAssetId || null}
        />
      </div>

      <div className="p-2 border-2 w-full border-gray-950 dark:border-gray-800 flex flex-col gap-5 h-screen">
        <div className=" bg-gray">
          <PostInput />
        </div>
        <div className="overflow-y-hidden  h-full">
          <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
        </div>
      </div>
      <div className="w-3/12 hidden md:flex">
        {' '}
        <ProfileMenu />
      </div>
    </div>
  )
}

export default Home
