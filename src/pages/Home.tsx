import PostInput from '../components/PostInput'
import { PostProps } from '../services/Post'
import { ellipseAddress } from '../utils/ellipseAddress'

interface HomeInterface {
  postsList: PostProps[]
}

const Home = ({ postsList }: HomeInterface) => {
  return (
    <div className="flex flex-col gap-2 h-screen">
      <PostInput />
      {postsList?.map((post) => {
        return (
          <div className="border-2 flex flex-col break-words">
            <h2>{ellipseAddress(post.creator_address)}</h2>
            <p className="w-screen ">{post.text}</p>
          </div>
        )
      })}
    </div>
  )
}

export default Home
