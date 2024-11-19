import { useSearchParams } from 'react-router-dom'
import PostCard from '../components/PostCard'
import { usePosts } from '../context/Posts/Posts'
import { Daum } from '../services/api/types'

const PostPage = () => {
  const [searchParams] = useSearchParams()
  const { handleGetPostByTransactionId, handleNewReply } = usePosts()

  const transactionId = searchParams.get('id') || ''

  const post = handleGetPostByTransactionId(transactionId)

  const updateRepliesStatus = (post: Daum) => {
    return {
      ...post,
      replies: post.replies?.map((reply) => ({
        ...reply,
        status: 'accepted',
      })),
    }
  }

  const postWithUpdatedReplies = post ? updateRepliesStatus(post) : null

  return (
    <div className="flex flex-col p-2 pt-24 dark:bg-gray-950 bg-gray-100">
      {!post ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      ) : postWithUpdatedReplies ? (
        <PostCard imagesVisible={true} post={postWithUpdatedReplies} handleNewReply={handleNewReply} />
      ) : (
        <div className="flex justify-center items-center h-96">
          <p>Post not found</p>
        </div>
      )}
    </div>
  )
}

export default PostPage
