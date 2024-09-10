import { RiSearchLine } from 'react-icons/ri'
import { FeedType } from '../../context/Posts/Posts'

interface IMenuFeed {
  hasFeedPosts: boolean
  activeFeed: FeedType
  handleChangeFeed: (feed: FeedType) => void
}

export const MenuFeed = ({ hasFeedPosts, handleChangeFeed, activeFeed }: IMenuFeed) => {
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
          className={`w-full flex justify-start  p-3 cursor-pointer ${activeFeed === 'personalized' ? 'bg-black text-white' : ''}`}
        >
          <p
            className={`font-bold text-xl cursor-pointer hover:scale-105 ${
              activeFeed === 'personalized' ? 'border-b-2 border-gray-900 dark:border-gray-600' : 'border-b-2 border-transparent'
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
        className={`w-full flex justify-start  p-3 cursor-pointer ${activeFeed === 'global' ? 'bg-black text-white' : ''}`}
      >
        <p
          className={`font-bold text-xl cursor-pointer ${
            activeFeed === 'global' ? 'border-b-2 border-gray-900 dark:border-gray-300' : 'border-b-2 border-transparent hover:scale-105'
          }`}
        >
          Global Feed 🌎
        </p>
      </div>
    </div>
  )
}
