import { FaSpinner } from 'react-icons/fa6'
import { PostProps } from '../services/Post'
import PostCard from './PostCard'

interface FeedPropsInterface {
  postsList: PostProps[]
}

const Feed = ({ postsList }: FeedPropsInterface) => {
  const sortedPostList = postsList.sort((a, b) => {
    return b.timestamp! - a.timestamp!
  })

  const renderedPosts = sortedPostList.map((post) => <PostCard post={post} />)

  return (
    <>
      {postsList.length > 0 ? (
        renderedPosts
      ) : (
        <div className="h-64 flex flex-col justify-start md:justify-center items-center text-gray-500">
          <FaSpinner className="animate-spin text-3xl" />
          <p>Loading posts</p>
        </div>
      )}
    </>
  )
}

export default Feed
