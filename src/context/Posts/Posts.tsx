import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useGetAllPosts, useGetPostByTransactionId } from '../../services/api/Posts'
import { Like, Post } from '../../services/api/types'

type IPostsContext = {
  postList: Post[] | null
  handleGetPostByAddress(address: string): Post | undefined
  handleAddNewPost(post: Post): void
  handleNewReply(newReply: Post, transactionCreatorId: string): void
  handleNewLike(newLike: Like, transactionCreatorId: string): void
  handleDeletePost(transactionCreatorId: string): void
  handleGetPostByTransactionId(transactionId: string): Post | undefined
  handleRefreshPosts(): void
  isLoading: boolean
}

interface IPostsProviderProps {
  children: JSX.Element | JSX.Element[]
}

const PostsContext = createContext<IPostsContext>({
  postList: null,
  handleGetPostByAddress: () => undefined,
  handleAddNewPost: () => undefined,
  handleNewReply: () => undefined,
  handleNewLike: () => undefined,
  handleDeletePost: () => undefined,
  handleGetPostByTransactionId: () => undefined,
  handleRefreshPosts: () => undefined,
  isLoading: false,
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<Post[]>([])

  const [transactionId, setTransactionId] = useState<string>('')

  const { data, isFetching: isLoading, refetch } = useGetAllPosts(false)

  const { data: postData, refetch: refetchPostData } = useGetPostByTransactionId(transactionId, false)

  useEffect(() => {
    const savedPosts = sessionStorage.getItem('postList')
    if (savedPosts) {
      setPostList(JSON.parse(savedPosts))
    } else {
      refetch()
    }
  }, [])

  useEffect(() => {
    if (postList.length > 0) {
      sessionStorage.setItem('postList', JSON.stringify(postList))
    }
  }, [postList])

  useEffect(() => {
    if (data) {
      setPostList(
        data.map((post) => ({
          ...post,
          status: 'accepted',
          replies: post.replies.map((reply) => ({
            ...reply,
            status: 'accepted',
          })),
        })),
      )
    }
  }, [data])

  const handleRefreshPosts = () => {
    sessionStorage.removeItem('postList')
    refetch().then(() => {
      if (data) {
        setPostList(
          data.map((post) => ({
            ...post,
            status: 'accepted',
            replies: post.replies.map((reply) => ({
              ...reply,
              status: 'accepted',
            })),
          })),
        )
      }
    })
  }

  const handleDeletePost = (transactionCreatorId: string) => {
    const newPostsList = postList.filter((post) => post.transaction_id !== transactionCreatorId)
    setPostList(newPostsList)
  }

  const handleGetPostByAddress = (address: string) => {
    return postList.find((post) => post.creator_address === address)
  }

  const handleGetPostByTransactionId = (transactionId: string) => {
    const postLocal = postList.find((post) => post.transaction_id === transactionId)
    if (postLocal) {
      return postLocal
    } else {
      setTransactionId(transactionId)
      refetchPostData()
      return postData
    }
  }

  const handleAddNewPost = (post: Post) => {
    setPostList((prevPosts) => [post, ...(prevPosts || [])])
  }

  const handleNewReply = (newReply: Post, transactionCreatorId: string) => {
    const newPostsList = postList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        return { ...post, replies: [...(post.replies || []), newReply] }
      }
      return post
    })
    setPostList(newPostsList)
  }

  const handleNewLike = (newLike: Like, transactionCreatorId: string) => {
    const newPostsList = postList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        return { ...post, likes: [...(post.likes || []), newLike] }
      }
      return post
    })
    setPostList(newPostsList)
  }

  const postProviderValues = useMemo(
    () => ({
      postList,
      handleNewLike,
      handleNewReply,
      handleGetPostByAddress,
      handleGetPostByTransactionId,
      handleRefreshPosts,
      handleAddNewPost,
      handleDeletePost,
      isLoading,
    }),
    [postList, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
