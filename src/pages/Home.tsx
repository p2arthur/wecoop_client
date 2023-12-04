import Feed from '../components/Feed'
import PostInput from '../components/PostInput'
import { PostProps } from '../services/Post'

interface HomeInterface {
  postsList: PostProps[]
  setPosts(posts: PostProps): void
}

const Home = ({ postsList, setPosts }: HomeInterface) => {
  const handleSetPosts = (newPost: PostProps) => {
    console.log('setposts')
    console.log(newPost)
    console.log('postlist', postsList)
    setPosts(newPost)
  }

  console.log(postsList)

  return (
    <div className="flex flex-col gap-2 h-screen p-2">
      <PostInput setPosts={handleSetPosts} />
      <p className="font-bold text-2xl">Feed</p>
      <Feed postsList={postsList} />
      <div></div>
    </div>
  )
}

export default Home
