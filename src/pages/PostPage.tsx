import { useSearchParams } from 'react-router-dom'
import { useGetPostByTransactionId } from '../services/api/Posts'
import PostCard from '../components/PostCard'
import { usePosts } from '../context/Posts/Posts'
import { Post } from '../services/api/types'

const PostPage = () => {
  const [searchParams] = useSearchParams()

  const id = searchParams.get('id') || ''

  const { data, isLoading } = useGetPostByTransactionId(id)

  const updateRepliesStatus = (post: Post) => {
    return {
      ...post,
      replies: post.replies.map((reply) => ({
        ...reply,
        status: 'accepted',
      })),
    }
  }

  const postWithUpdatedReplies = data ? updateRepliesStatus(data) : null

  const { handleNewReply } = usePosts()

  return (
    <div className="flex flex-col p-2 pt-24 dark:bg-gray-950 bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      ) : postWithUpdatedReplies ? (
        <PostCard post={postWithUpdatedReplies} handleNewReply={handleNewReply} />
      ) : (
        <div className="flex justify-center items-center h-96">
          <p>Post not found</p>
        </div>
      )}
    </div>
  )
}

export default PostPage
