import { RiSearchLine } from 'react-icons/ri'
import packageJson from '../../../package.json'
import { AssetId, FeedType, usePosts } from '../../context/Posts/Posts'
import { useState } from 'react'
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
      <div className="p-3">
        <div className="flex items-center justify-between p-3 gap-3 border-2 border-black w-full">
          <RiSearchLine className="text-2xl" />
          <input type="text" className="w-full bg-gray-100" />
        </div>
      </div>
      {hasFeedPosts ? (
        <div
          onClick={() => {
            handleChangeFeed('personalized')
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
          onClick={() => {
            setOpenCoinFeed(!openCoinFeed)
          }}
        >
          Coin Feed's 🪙
        </p>
      </div>

      {openCoinFeed && (
        <div>
          {usableAssetsList.map((asset) => (
            <div
              onClick={() => handleChangeAssetId(asset.assetId)}
              className={`w-full flex justify-center  p-3 cursor-pointer ${
                activeAssetId === asset.assetId ? 'bg-black text-white dark:bg-white dark:text-black' : ''
              }`}
            >
              <p
                className={`font-bold flex gap-2 text-xl cursor-pointer ${
                  activeAssetId === asset.assetId
                    ? 'border-b-2 border-gray-900 dark:border-black'
                    : 'border-b-2 border-transparent hover:scale-105'
                }`}
              >
                {asset.name} <img src={asset.image} alt={asset.name} className="w-6 h-6" />
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="fixed bottom-0 p-3">
        <p className="text-gray-600">Version: {version} </p>
      </div>
    </div>
  )
}
