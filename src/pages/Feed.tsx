import { useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import FeedComponent from '../components/Feed'
import MobileSidebar from '../components/interface/MobileSidebar'
import { ProfileMenu } from '../components/templates/FeaturedMenu'
import { MenuFeed } from '../components/templates/MenuFeed'
import { usePosts } from '../context/Posts/Posts'

const Feed = () => {
  const { postList, handleNewReply, isLoading, activeFeed, activeAssetId, handleFilterByAssetId, handleChangeFeed } = usePosts()

  const { activeAccount } = useWallet()

  const [params, setParams] = useSearchParams()

  useEffect(() => {
    if (params.get('activeFeed') === 'coinFeed' && params.get('activeAssetId') !== null) {
      const assetId = Number(params.get('activeAssetId'))
      handleFilterByAssetId(assetId)
    } else if (activeFeed === 'global' && activeAssetId === null) {
      setParams({ activeFeed: 'global' })
    } else if (activeFeed === 'personalized' && activeAssetId === null) {
      setParams({ activeFeed: 'personalized' })
    } else if (activeFeed === 'coinFeed' && activeAssetId !== null) {
      setParams({ activeFeed: 'coinFeed', activeAssetId: activeAssetId?.toString() || '' })
    }
  }, [activeFeed, activeAssetId])

  const updateUrlParams = (newFeed: string, newAssetId: number) => {
    const searchParams = new URLSearchParams()

    if (newFeed) {
      searchParams.set('activeFeed', newFeed)
    }

    if (newAssetId) {
      searchParams.set('activeAssetId', newAssetId.toString())
    }

    setParams(searchParams)
  }

  const handleFeedChange = (newFeed: string) => {
    if (activeAssetId) {
      updateUrlParams(newFeed, activeAssetId)
      handleChangeFeed(newFeed)
    }
  }

  const handleAssetIdChange = (newAssetId: number | null) => {
    if (activeFeed) {
      updateUrlParams(activeFeed, newAssetId || 0)
      handleFilterByAssetId(newAssetId)
    }
  }

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      <MobileSidebar />
      <div className="hidden md:flex overflow-y-scroll border-t-0 flex-col w-3/12 items-start justify-between border-2 border-b-0 dark:border-gray-800 border-gray-950">
        <MenuFeed
          openByParams={params.get('activeFeed') === 'coinFeed' && params.get('activeAssetId') !== null}
          hasFeedPosts={activeAccount !== null}
          activeFeed={activeFeed || ''}
          handleChangeFeed={handleFeedChange}
          handleChangeAssetId={handleAssetIdChange}
          activeAssetId={activeAssetId || 0}
        />
      </div>

      <div className="p-2 overflow-y-scroll md:overflow-y-hidden border-2 max-w-full md:max-w-[60%] w-full border-gray-950 dark:border-gray-800 flex flex-col gap-5 h-screen">
        <div className=" bg-gray"></div>
        <div className="md:overflow-y-hidden  h-full">
          <FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />
        </div>
      </div>
      <div className="w-3/12 hidden md:flex">
        <ProfileMenu activeAssetId={activeAssetId} />
      </div>
    </div>
  )
}

export default Feed
