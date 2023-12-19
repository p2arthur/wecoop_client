import { useEffect, useState } from 'react'
import FeedComponent from '../components/Feed'
import LoaderSpinner from '../components/LoaderSpinner'
import PostInput from '../components/PostInput'
import { PostProps } from '../services/Post'
import { useGetAllPosts } from '../services/api/Posts'
import { debounce } from '../utils/debounce'

const Home = () => {
  const [postsList, setPostsList] = useState<PostProps[]>([])
  const [nextToken, setNextToken] = useState<string | null>(null)
  const [allCaughtUp, setAllCaughtUp] = useState(false)

  const { data, isLoading, refetch, isRefetching } = useGetAllPosts({ next: nextToken })

  useEffect(() => {
    if (data) {
      if (!data.next) {
        setAllCaughtUp(true)
      }
      setNextToken(data.next)
    }
  }, [data])

  const handleScroll = debounce(() => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (isAtBottom && nextToken && !isRefetching) {
      refetch().then()
    }
  }, 380)

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [nextToken])

  const handleSetPosts = (newPost: PostProps) => {
    setPostsList([newPost, ...postsList])
  }

  const handleNewReply = (newReply: PostProps, transactionCreatorId: string) => {
    const newPostsList = postsList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replies === undefined) {
          return { ...post, replies: [newReply] }
        }
        return { ...post, replies: [...post.replies, newReply] }
      }
      return post
    })
    setPostsList(newPostsList)
  }

  return (
    <div className="flex flex-col gap-4 p-2 ">
      <PostInput setPosts={handleSetPosts} />
      <p className="font-bold text-2xl">Feed - </p>
      {data && <FeedComponent postsList={data?.posts} handleNewReply={handleNewReply} />}
      {isLoading || (isRefetching && <LoaderSpinner text={'loading feed'} />)}
      {allCaughtUp && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default Home
