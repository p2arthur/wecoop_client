import {useSearchParams} from "react-router-dom";
import {useGetPostByTransactionId} from "../services/api/Posts";
import PostCard from "../components/PostCard";

const PostPage = () => {

  const [searchParams] = useSearchParams()

  const id = searchParams.get('id') || ''

  const {data, isLoading} = useGetPostByTransactionId(id)


  return (
    <div className="flex flex-col p-2 dark:bg-gray-950 bg-gray-100">
      {isLoading ? (
        <div className="flex justify-center items-center h-96">
          <p>Loading...</p>
        </div>
      ) : data ? (
        <PostCard post={data}/>
      ) : (
        <div className="flex justify-center items-center h-96">
          <p>Post not found</p>
        </div>
      )}
    </div>
  )
}

export default PostPage
