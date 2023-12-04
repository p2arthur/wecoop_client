import PostInput from '../components/PostInput'
import { PostProps } from '../services/Post'
import { ellipseAddress } from '../utils/ellipseAddress'

interface HomeInterface {
  postsList: PostProps[]
}

const Home = ({ postsList }: HomeInterface) => {
  return (
    <div className="flex flex-col gap-2 h-screen p-2">
      <PostInput />
      <p className="font-bold text-2xl">Feed</p>
      {postsList?.map((post) => {
        return (
          <div
            key={post.text}
            className="border-2 border-gray-900 flex flex-col p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer"
          >
            <h2>{ellipseAddress(post.creator_address)}</h2>
            <p className="w-full">{post.text}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Home
