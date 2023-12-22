import { useEffect } from 'react'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { usePosts } from '../context/Posts/Posts'
import { useGetUserInfo } from '../services/api/Users'

const Home = () => {
  const { postList, handleNewReply, isLoading } = usePosts()
  const { data } = useGetUserInfo('AENCK6AVVGCOQM6XGSGTSMZXVHV34QDAHH7RDH226GLD55U34BLT6YP5L4')

  useEffect(() => {
    console.log(data)
  }, [data])

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput />
      <p className="font-bold text-2xl">Feed - </p>
      {<FeedComponent postList={postList} isLoading={isLoading} handleNewReply={handleNewReply} />}
    </div>
  )
}

export default Home
