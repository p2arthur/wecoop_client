import { PostProps } from '../services/Post'
import PostCard from './PostCard'

interface FeedPropsInterface {
  postsList: PostProps[]

  handleNewReply?: (newReply: PostProps, transactionCreatorId: string) => void
}

const FeedComponent = ({ postsList, handleNewReply }: FeedPropsInterface) => {
  const sortedPostList = postsList.sort((a, b) => {
    return b.timestamp! - a.timestamp!
  })

  const renderedPosts = sortedPostList.map((post) => <PostCard key={post.transaction_id} handleNewReply={handleNewReply} post={post} />)

  return <>{postsList.length > 0 && renderedPosts}</>
}

export default FeedComponent
