import FeedComponent from '../components/Feed'
import LoaderSpinner from '../components/LoaderSpinner'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'

const Home = () => {
  const { postList, handleNewReply, allCaughtUp, isLoading, handleAddNewPost } = usePosts()

  console.log(postList, 'postList')

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput setPosts={handleAddNewPost} />
      <p className="font-bold text-2xl">Feed - </p>
      {postList && <FeedComponent postsList={postList} handleNewReply={handleNewReply} />}
      {isLoading && <LoaderSpinner text={'loading feed'} />}
      {allCaughtUp && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Home
