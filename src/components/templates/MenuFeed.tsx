import { useState } from 'react'
import packageJson from '../../../package.json'
import { AssetId, FeedType, usePosts } from '../../context/Posts/Posts'
import { usableAssetsList } from '../../data/usableAssetsList'

interface IMenuFeed {
  hasFeedPosts: boolean
  activeFeed: FeedType
  handleChangeFeed: (feed: FeedType) => void
  handleChangeAssetId: (assetId: AssetId | null) => void
  activeAssetId: AssetId | null
}

interface PackageJson {
  version: string
}

const version = (packageJson as PackageJson).version

export const MenuFeed = ({ hasFeedPosts, handleChangeFeed, activeFeed, handleChangeAssetId, activeAssetId }: IMenuFeed) => {
  const [openCoinFeed, setOpenCoinFeed] = useState<boolean>(false)
  const { isLoading } = usePosts()

  return (
    <div className="w-full">
      {hasFeedPosts ? (
        <div
          onClick={() => {
            handleChangeFeed('personalized')
            setOpenCoinFeed(false)
          }}
          className={`w-full flex justify-start  p-3 cursor-pointer ${
            activeFeed === 'personalized' ? 'bg-black text-white dark:bg-white dark:text-black' : ''
          }`}
        >
          <p
            className={`font-bold text-xl cursor-pointer hover:scale-105 ${
              activeFeed === 'personalized' ? 'border-b-2 border-gray-900 dark:border-black' : 'border-b-2 border-transparent'
            }`}
          >
            Your Feed
          </p>
        </div>
      ) : (
        <p className="font-bold text-gray-400 text-xl cursor-pointer">Your feed</p>
      )}
      <div
        onClick={() => {
          handleChangeFeed('global')
          setOpenCoinFeed(false)
        }}
        className={`w-full flex justify-start  p-3 cursor-pointer ${
          activeFeed === 'global' ? 'bg-black text-white dark:bg-white dark:text-black' : ''
        }`}
      >
        <p
          className={`font-bold text-xl cursor-pointer ${
            activeFeed === 'global' ? 'border-b-2 border-gray-900 dark:border-black' : 'border-b-2 border-transparent hover:scale-105'
          }`}
        >
          Global Feed 🌎
        </p>
      </div>
      <div
        onClick={() => {
          if (!isLoading) {
            setOpenCoinFeed(!openCoinFeed)
            handleChangeFeed('coinFeed')
          }
        }}
        className={`w-full flex justify-start  p-3 cursor-pointer ${openCoinFeed ? 'border-1-black  dark:bg-white dark:text-black' : ''}
         ${isLoading ? 'text-gray-400' : ''}`}
      >
        <p
          className={`font-bold text-xl cursor-pointer ${
            openCoinFeed ? 'border-b-2 border-gray-900 dark:border-black' : 'border-b-2 border-transparent hover:scale-105'
          }`}
        >
          Coin Feed's 🪙
        </p>
      </div>

      {openCoinFeed && (
        <div>
          {usableAssetsList.map((asset) => (
            <div
              onClick={() => handleChangeAssetId(asset.assetId)}
              className={`w-full flex justify-start pl-5  p-3 cursor-pointer ${
                activeAssetId === asset.assetId ? 'bg-black text-white dark:bg-white dark:text-black' : ''
              }`}
            >
              <div
                className={`font-bold flex items-end gap-2 text-xl cursor-pointer ${
                  activeAssetId === asset.assetId
                    ? 'border-b-2 border-gray-900 dark:border-black'
                    : 'border-b-2 border-transparent hover:scale-105'
                }`}
              >
                <div className="rounded-full overflow-hidden">
                  <img src={asset.image} className="w-8 h-8" />
                </div>{' '}
                <h3 className="text-xl">{asset.name}</h3>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 p-3 right-0 w-auto md:left-0 md:right-auto">
        <p className="text-gray-600">Version: {version}</p>
      </div>
    </div>
  )
}
