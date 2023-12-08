import { minidenticon } from 'minidenticons'
import { FaSpinner } from 'react-icons/fa6'
import { PostProps } from '../services/Post'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'

interface PostPropsInterface {
  post: PostProps
}

const PostCard = ({ post }: PostPropsInterface) => {
  const generateIdIcon = (creatorAddress: string) => {
    const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
    return svgURI
  }

  return (
    <>
      <div>
        {post.status === 'accepted' ? (
          <a target="_blank" href={`https://testnet.algoexplorer.io/tx/${post.transaction_id}`}>
            <div className="border-2 border-gray-900 flex flex-col gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-75 cursor-pointer min-h-[120px] post dark:hover:text-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 rounded-full border-2 border-gray-900 dark:bg-gray-100">
                    <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                  </div>
                  <a target="_blank" href={`https://testnet.algoexplorer.io/address/${post.creator_address}`}>
                    <h2 className="font-bold text-xl h-full hover:underline">
                      {post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}
                    </h2>
                  </a>
                </div>
                <div className="flex gap-2">
                  {post.country ? (
                    <div className="flex gap-0 flex-col justify-center">
                      <div className="w-6 rounded-full overflow-hidden">
                        <img className="w-full h-full" src={`https://flagsapi.com/${post.country}/flat/64.png`} alt="" />
                      </div>
                      <p className="w-full text-center">{post.country}</p>
                    </div>
                  ) : null}
                  <p>{`${formatDateFromTimestamp(post.timestamp!).time} ${formatDateFromTimestamp(post.timestamp!).measure} ago`}</p>
                </div>
              </div>
              <p className="w-full tracking-wide">{post.text}</p>
            </div>
          </a>
        ) : post.status === 'loading' ? (
          <div
            key={post.text}
            className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900">
                  <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                </div>
                <h2 className="font-bold text-xl h-full">{post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}</h2>
              </div>
              <p className="w-full">{post.text}</p>
            </div>
            <span>
              <FaSpinner className="w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <div
            key={post.text}
            className="border-2 opacity-40 border-red-900 flex-col p-2   hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
          >
            <h2>{post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}</h2>
            <p className="w-full">{post.text}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default PostCard
