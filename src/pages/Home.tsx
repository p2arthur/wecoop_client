import { useEffect, useState } from 'react'
import FeedComponent from '../components/Feed'
import PostInput from '../components/PostInput'
import { Feed } from '../services/Feed'
import { PostProps } from '../services/Post'

const Home = () => {
  const [postsList, setPostsList] = useState<PostProps[]>([])

  const feed = new Feed()

  const getAllPosts = async () => {
    const data = await feed.getAllPosts()
    console.log('posts list from home', data)
    setPostsList(data)
  }

  const setPosts = (newPost: PostProps) => {
    setPostsList([newPost, ...postsList])
  }

  useEffect(() => {
    getAllPosts()
  }, [])

  const handleSetPosts = (newPost: PostProps) => {
    setPosts(newPost)
  }

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput setPosts={handleSetPosts} />
      <p className="font-bold text-2xl">Feed</p>
      <FeedComponent postsList={postsList} getAllPosts={getAllPosts} />
    </div>
  )
}

export default Home
