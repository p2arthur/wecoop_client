import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useGetAllPosts } from '../../services/api/Posts'
import { Like, Post } from '../../services/api/types'

type IPostsContext = {
  postList: Post[] | null
  handleGetPostByAddress(address: string): void
  handleAddNewPost(post: Post): void
  handleNewReply(newReply: Post, transactionCreatorId: string): void
  handleNewLike(newLike: Like, transactionCreatorId: string): void
  isLoading: boolean
}

interface IPostsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const PostsContext = createContext<IPostsContext>({
  postList: null,
  handleGetPostByAddress: () => Object,
  handleAddNewPost: () => Object,
  handleNewReply: () => Object,
  handleNewLike: () => Object,
  isLoading: false,
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<Post[]>([])

  const { data, isLoading } = useGetAllPosts()

  useEffect(() => {
    if (data) {
      setPostList(
        data.map((post) => {
          return {
            ...post,
            status: 'accepted',
            replies: post.replies.map((reply) => {
              return { ...reply, status: 'accepted' }
            }),
          }
        }),
      )
    }
  }, [data])

  const handleGetPostByAddress = (address: string) => {
    return postList?.find((post) => post.creator_address === address)
  }

  const handleAddNewPost = (post: Post) => {
    setPostList((prevPosts) => [post, ...(prevPosts || [])])
  }

  const handleNewReply = (newReply: Post, transactionCreatorId: string) => {
    const newPostsList = postList?.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replies === undefined) {
          return { ...post, replies: [newReply] }
        }
        return { ...post, replies: [...post.replies, newReply] }
      }
      return post as Post
    })
    setPostList(newPostsList)
  }

  const handleNewLike = (newLike: Like, transactionCreatorId: string) => {
    const newPostsList = postList?.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.likes === undefined) {
          return { ...post, likes: [newLike] }
        }
        return { ...post, likes: [...post.likes, newLike] }
      }
      return post
    })
    setPostList(newPostsList!)
  }

  const postProviderValues = useMemo(
    () => ({
      postList,
      handleNewLike,
      handleNewReply,
      handleGetPostByAddress,
      handleAddNewPost,
      isLoading,
    }),
    [handleAddNewPost, handleNewReply, handleGetPostByAddress, handleNewLike, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
