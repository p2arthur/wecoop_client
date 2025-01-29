import { useEffect, useState } from 'react'
import { FaShareNodes } from 'react-icons/fa6'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import packageJson from '../../../package.json'
import { AssetId, FeedType, usePosts } from '../../context/Posts/Posts'
import { usableAssetsList } from '../../data/usableAssetsList'

interface IMenuFeed {
  hasFeedPosts: boolean
  activeFeed: FeedType | string
  handleChangeFeed: (feed: FeedType) => void
  handleChangeAssetId: (assetId: AssetId | number | null) => void
  activeAssetId: AssetId | null
  openByParams: boolean
}

interface PackageJson {
  version: string
}

const version = (packageJson as PackageJson).version

export const MenuFeed = ({ hasFeedPosts, handleChangeFeed, activeFeed, handleChangeAssetId, activeAssetId, openByParams }: IMenuFeed) => {
  const [openCoinFeed, setOpenCoinFeed] = useState<boolean>(true)
  const navigate = useNavigate()
  const { isLoading } = usePosts()

  useEffect(() => {
    if (openByParams) {
      setOpenCoinFeed(true)
    }
  }, [openByParams])

  return (
    <div className="w-full">
      <div
        onClick={() => {
          navigate('/polls')
        }}
        className={`w-full flex justify-start  p-3 cursor-pointer`}
      >
        <p className={`font-bold text-xl cursor-pointer border-b-2 border-transparent hover:scale-105`}>Polls Feed 🗳️</p>
      </div>
      <div
        onClick={() => {
          handleChangeFeed('global')
          setOpenCoinFeed(false)
        }}
        className={`w-full flex justify-start  p-3 cursor-pointer ${activeFeed === 'global' ? 'bg-black text-white dark:bg-white dark:text-black' : ''
          }`}
      >
        <p
          className={`font-bold text-xl cursor-pointer ${activeFeed === 'global' ? 'border-b-2 border-gray-900 dark:border-black' : 'border-b-2 border-transparent hover:scale-105'
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
        className={`w-full flex justify-start  p-3 cursor-pointer ${openCoinFeed ? 'border-1-black' : ''}
         ${isLoading ? 'text-gray-400' : ''}`}
      >
        <p
          className={`font-bold text-xl cursor-pointer ${openCoinFeed ? 'border-b-2 border-gray-900 dark:border-black' : 'border-b-2 border-transparent hover:scale-105'
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
              className={`w-full flex justify-between items-center pl-5  p-3 cursor-pointer ${activeAssetId === asset.assetId ? 'bg-black text-white dark:bg-white dark:text-black' : ''
                }`}
            >
              <div
                className={`font-bold flex items-end gap-2 text-xl cursor-pointer ${activeAssetId === asset.assetId
                  ? 'border-b-2 border-gray-900 dark:border-black'
                  : 'border-b-2 border-transparent hover:scale-105'
                  }`}
              >
                <div className="rounded-full overflow-hidden">
                  <img src={asset.image} className="w-8 h-8" />
                </div>{' '}
                <h3 className="text-xl">{asset.name}</h3>
              </div>
              {activeAssetId === asset.assetId && (
                <div
                  className={'p-2'}
                  onClick={(e) => {
                    e.stopPropagation()
                    const url = window.location.href

                    navigator.clipboard.writeText(url)

                    toast('Community coin feed copied to clipboard', {
                      position: 'bottom-right',
                      theme: 'dark',
                    })
                  }}
                >
                  <FaShareNodes />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <p className="text-gray-600">Version: {version}</p>
    </div>
  )
}
