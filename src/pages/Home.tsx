import Feed from '../components/Feed'
import PostInput from '../components/PostInput'
import { PostProps } from '../services/Post'

interface HomeInterface {
  postsList: PostProps[]
  setPosts(posts: PostProps): void
  getAllPosts(): Promise<void>
}

const Home = ({ postsList, setPosts, getAllPosts }: HomeInterface) => {
  const handleSetPosts = (newPost: PostProps) => {
    setPosts(newPost)
  }

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput setPosts={handleSetPosts} />
      <p className="font-bold text-2xl">Feed</p>
      <Feed postsList={postsList} getAllPosts={getAllPosts} />
    </div>
  )
}

export default Home
