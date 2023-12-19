import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useGetAllPosts } from '../../services/api/Posts'

interface PostProps {
  text: string
  creator_address: string
  transaction_id: string | null
  status: 'loading' | 'accepted' | 'denied' | string | null
  timestamp: number | null
  country?: string
  nfd?: string
  likes?: number
  replies?: PostProps[]
}

type IPostsContext = {
  postList: PostProps[] | null
  handleDeletePost(postId: string): void
  handleGetPostByAddress(address: string): void
  handleAddNewPost(post: PostProps): void
  handleNewReply(newReply: PostProps, transactionCreatorId: string): void
  allCaughtUp: boolean
  isLoading: boolean
}

interface IPostsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const PostsContext = createContext<IPostsContext>({
  postList: null,
  handleDeletePost: () => Object,
  handleGetPostByAddress: () => Object,
  handleAddNewPost: () => Object,
  handleNewReply: () => Object,
  allCaughtUp: false,
  isLoading: false,
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<PostProps[] | null>([])
  const [nextToken, setNextToken] = useState<string | null>(null)
  const [allCaughtUp, setAllCaughtUp] = useState(false)

  const { data, refetch, isLoading } = useGetAllPosts({ next: nextToken })

  useEffect(() => {
    if (data) {
      setPostList(data.posts)
    }
  }, [data])

  const handleInfiniteScroll = useCallback(async () => {
    const isAtBottom = window.innerHeight + window.scrollY >= document.body.offsetHeight - 100
    if (isAtBottom && nextToken) {
      await refetch()
    }
  }, [nextToken, refetch])

  useEffect(() => {
    const fetchData = async () => {
      await handleInfiniteScroll()
      if (data && data.posts !== null) {
        if (!data.next) {
          setAllCaughtUp(true)
        }
        setNextToken(data.next)
        setPostList((prevPosts) => (prevPosts ? [...prevPosts, ...data.posts] : data.posts))
      }
    }

    fetchData()
  }, [handleInfiniteScroll])

  useEffect(() => {
    window.addEventListener('scroll', handleInfiniteScroll)
    return () => {
      window.removeEventListener('scroll', handleInfiniteScroll)
    }
  }, [nextToken, handleInfiniteScroll])

  const handleDeletePost = (postId: string) => {
    setPostList((prevPosts) => prevPosts?.filter((post) => post.transaction_id !== postId) || [])
  }

  const handleGetPostByAddress = (address: string) => {
    return postList?.find((post) => post.creator_address === address)
  }

  const handleAddNewPost = (post: PostProps) => {
    setPostList((prevPosts) => (prevPosts ? [post, ...prevPosts] : [post]))
  }

  const handleNewReply = (newReply: PostProps, transactionCreatorId: string) => {
    const newPostsList = postList?.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replies === undefined) {
          return { ...post, replies: [newReply] }
        }
        return { ...post, replies: [...post.replies, newReply] }
      }
      return post
    })
    setPostList(newPostsList!)
  }

  const postProviderValues = useMemo(
    () => ({
      postList,
      handleNewReply,
      handleDeletePost,
      handleGetPostByAddress,
      handleAddNewPost,
      allCaughtUp,
      isLoading,
    }),
    [postList, handleAddNewPost, handleNewReply, handleDeletePost, handleGetPostByAddress, allCaughtUp, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
