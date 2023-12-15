import { PostProps } from '../services/Post'
import PostCard from './PostCard'

interface FeedPropsInterface {
  postsList: PostProps[]
  getAllPosts: () => Promise<void>
}

const FeedComponent = ({ postsList, getAllPosts }: FeedPropsInterface) => {
  const sortedPostList = postsList.sort((a, b) => {
    return b.timestamp! - a.timestamp!
  })

  const renderedPosts = sortedPostList.map((post) => <PostCard post={post} getAllPosts={getAllPosts} />)

  return <>{postsList.length > 0 && renderedPosts}</>
}

export default FeedComponent
