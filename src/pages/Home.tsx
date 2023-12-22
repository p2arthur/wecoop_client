import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'

const Home = () => {
  const { postList, handleNewReply, isLoading } = usePosts()

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput />
      <p className="font-bold text-2xl">Feed - </p>
      {<FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />}
    </div>
  )
}

export default Home
