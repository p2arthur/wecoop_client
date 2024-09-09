import { RiSearchLine } from 'react-icons/ri'

interface IMenuFeed {
  hasFeedPosts: boolean
  activeTab: string
  setActiveTab: React.Dispatch<React.SetStateAction<'personalized' | 'global'>>
}

export const MenuFeed = ({ hasFeedPosts, setActiveTab, activeTab }: IMenuFeed) => {
  return (
    <div className="flex  border-t-0 flex-col w-1/6 items-start justify-between border-2 border-b-0 dark:border-gray-800  border-gray-950 bg-gray-100 dark:bg-gray-900">
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
              setActiveTab('personalized')
            }}
            className={`w-full flex justify-start  p-3 cursor-pointer ${activeTab === 'personalized' ? 'bg-black text-white' : ''}`}
          >
            <p
              className={`font-bold text-xl cursor-pointer hover:scale-105 ${
                activeTab === 'personalized' ? 'border-b-2 border-gray-900 dark:border-gray-600' : 'border-b-2 border-transparent'
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
            setActiveTab('global')
          }}
          className={`w-full flex justify-start  p-3 cursor-pointer ${activeTab === 'global' ? 'bg-black text-white' : ''}`}
        >
          <p
            className={`font-bold text-xl cursor-pointer ${
              activeTab === 'global' ? 'border-b-2 border-gray-900 dark:border-gray-300' : 'border-b-2 border-transparent hover:scale-105'
            }`}
          >
            Global Feed 🌎
          </p>
        </div>
      </div>
      <div className="w-full text-center flex flex-col gap-2">
        <div>
          Made by{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://twitter.com/iam_p2">
            @iam_p2
          </a>{' '}
          and{' '}
          <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://github.com/FelipeQueiroz">
            Felipe
          </a>
        </div>
        <a href="/about">
          <p className="text-blue-700 underline">About the app</p>
        </a>
        <p className="text-xs text-gray-500">$COOP is not responsible for any post created on the platform</p>
        <div className="flex gap-2 items-center justify-center">
          <p>powered by</p>
          <a target="_blank" href="https://www.algorand.foundation/">
            <img className="h-12 dark:hidden" src="/images/algorand_logo.png" alt="algorand-logo" />
            <img className="h-6 hidden dark:flex" src="/images/algorand_logo_white.png" alt="algorand-logo" />
          </a>
        </div>
      </div>
    </div>
  )
}
