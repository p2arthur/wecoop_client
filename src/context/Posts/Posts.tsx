import { createContext, useContext, useEffect, useMemo, useState } from 'react'
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
  isLoading: false,
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<PostProps[] | null>([])

  const { data, isLoading } = useGetAllPosts()

  useEffect(() => {
    if (data) {
      setPostList(data.posts)
    }
  }, [data])

  const handleDeletePost = (postId: string) => {
    setPostList((prevPosts) => prevPosts?.filter((post) => post.transaction_id !== postId) || [])
  }

  const handleGetPostByAddress = (address: string) => {
    return postList?.find((post) => post.creator_address === address)
  }

  const handleAddNewPost = (post: PostProps) => {
    setPostList((prevPosts) => prevPosts && [...prevPosts, post])
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
      isLoading,
    }),
    [handleAddNewPost, handleNewReply, handleDeletePost, handleGetPostByAddress, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
