import { useWallet } from '@txnlab/use-wallet'
import { useNavigate, useSearchParams } from 'react-router-dom'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { ProfileMenu } from '../components/templates/FeaturedMenu'
import { MenuFeed } from '../components/templates/MenuFeed'
import { usePosts } from '../context/Posts/Posts'

const Feed = () => {
  const { postList, handleNewReply, isLoading, activeFeed, activeAssetId, handleFilterByAssetId, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const [params, setParams] = useSearchParams()

  console.log(params, 'params')
  const navigate = useNavigate()

  // Função para atualizar a URL com base no activeFeed e activeAssetId
  const updateUrlParams = (newFeed, newAssetId) => {
    const searchParams = new URLSearchParams()

    if (newFeed) {
      searchParams.set('activeFeed', newFeed)
    }

    if (newAssetId) {
      searchParams.set('activeAssetId', newAssetId)
    }

    // Atualiza os parâmetros de URL e navega
    setParams(searchParams)
  }

  // Atualizar a handleChangeFeed para mudar a URL
  const handleFeedChange = (newFeed) => {
    updateUrlParams(newFeed, activeAssetId)
    handleChangeFeed(newFeed)
  }

  // Atualizar handleFilterByAssetId para mudar a URL
  const handleAssetIdChange = (newAssetId) => {
    updateUrlParams(activeFeed, newAssetId)
    handleFilterByAssetId(newAssetId)
  }

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      <div className="hidden md:flex border-t-0 flex-col w-3/12 items-start justify-between border-2 border-b-0 dark:border-gray-800 border-gray-950">
        <MenuFeed
          hasFeedPosts={activeAccount !== null}
          activeFeed={activeFeed || params.get('activeFeed') || 'global'}
          handleChangeFeed={handleFeedChange}
          handleChangeAssetId={handleAssetIdChange}
          activeAssetId={activeAssetId || params.get('activeAssetId') || null}
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

export default Feed
