import { FaSpinner } from 'react-icons/fa6'
import { PostProps } from '../services/Post'
import { ellipseAddress } from '../utils/ellipseAddress'

interface FeedPropsInterface {
  postsList: PostProps[]
}

const Feed = ({ postsList }: FeedPropsInterface) => {
  return (
    <>
      {postsList
        ? postsList?.map((post) => {
            return (
              <div>
                {post.status === 'accepted' ? (
                  <div
                    key={post.text}
                    className="border-2 border-gray-900 flex flex-col p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer"
                  >
                    <h2>{ellipseAddress(post.creator_address)}</h2>
                    <p className="w-full">{post.text}</p>
                  </div>
                ) : post.status === 'loading' ? (
                  <div
                    key={post.text}
                    className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
                  >
                    <div className="flex flex-col">
                      <h2>{ellipseAddress(post.creator_address)}</h2>
                      <p className="w-full">{post.text}</p>
                    </div>
                    <span>
                      <FaSpinner className="w-6 animate-spin" />
                    </span>
                  </div>
                ) : (
                  <div
                    key={post.text}
                    className="border-2 opacity-40 border-red-900 flex-col p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
                  >
                    <h2>{ellipseAddress(post.creator_address)}</h2>
                    <p className="w-full">{post.text}</p>
                  </div>
                )}
              </div>
            )
          })
        : null}
    </>
  )
}

export default Feed
