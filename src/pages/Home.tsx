import { useEffect, useState } from 'react'
import FeedComponent from '../components/Feed'
import LoaderSpinner from '../components/LoaderSpinner'
import PostInput from '../components/PostInput'
import { Feed } from '../services/Feed'
import { PostProps } from '../services/Post'
import { debounce } from '../utils/debounce'

const Home = () => {
  const [postsList, setPostsList] = useState<PostProps[]>([])
  const [nextToken, setNextToken] = useState(null)
  const [loading, setLoading] = useState(false)
  const [allCaughtUp, setAllCaughtUp] = useState(false)

  const feed = new Feed()
  const getAllPosts = async () => {
    if (!loading) {
      setLoading(true)
      try {
        const { data, next, currentRound } = await feed.getAllPosts({ next: nextToken })

        if (postsList.length === 0) {
          const existingTransactionIds = postsList.map((post) => post.transaction_id)

          const uniquePosts = data.filter((post) => !existingTransactionIds.includes(post.transaction_id))
          setPostsList(uniquePosts)
        } else {
          const existingTransactionIds = postsList.map((post) => post.transaction_id)

          const uniquePosts = data.filter((post) => !existingTransactionIds.includes(post.transaction_id))

          setPostsList((prev) => [...prev, ...uniquePosts])
        }
        if (!next) {
          setAllCaughtUp(true)
        }
        setNextToken(next)
      } catch (error) {
        console.error('Error fetching posts:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  const setPosts = (newPost: PostProps) => {
    setPostsList([newPost, ...postsList])
  }

  const handleScroll = debounce(() => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (isAtBottom && nextToken) {
      getAllPosts().then()
    }
  }, 380)

  useEffect(() => {
    getAllPosts().then()
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [nextToken])

  const handleSetPosts = (newPost: PostProps) => {
    setPosts(newPost)
  }

  const handleNewReply = (newReply: PostProps, transactionCreatorId: string) => {
    const newPostsList = postsList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replys === undefined) {
          return { ...post, replys: [newReply] }
        }
        return { ...post, replys: [...post.replys, newReply] }
      }
      return post
    })
    setPostsList(newPostsList)
  }

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput setPosts={handleSetPosts} />
      <p className="font-bold text-2xl">Feed - </p>
      <FeedComponent postsList={postsList} getAllPosts={getAllPosts} handleNewReply={handleNewReply} />
      {loading && <LoaderSpinner text={'loading feed'} />}
      {allCaughtUp && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Home
