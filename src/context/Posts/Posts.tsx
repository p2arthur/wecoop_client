import { useWallet } from '@txnlab/use-wallet'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useGetAllPosts, useGetAllPostsByWalletAddress, useGetPostByTransactionId } from '../../services/api/Posts'
import { Like, Post } from '../../services/api/types'

export enum AssetId {
  coopCoin = 796425061,
  xusd = 760037151,
}

export type FeedType = 'personalized' | 'global'
export type ExtendedFeedType = {
  feed: FeedType
  assetId?: AssetId
}
type IPostsContext = {
  postList: Post[] | null
  handleGetPostByAddress(address: string): Post | undefined
  handleAddNewPost(post: Post): void
  handleNewReply(newReply: Post, transactionCreatorId: string): void
  handleNewLike(newLike: Like, transactionCreatorId: string): void
  handleDeletePost(transactionCreatorId: string): void
  handleGetPostByTransactionId(transactionId: string): Post | undefined
  handleRefreshPosts(): void
  handleChangeFeed(feed: FeedType): void
  activeFeed?: FeedType
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
  handleChangeFeed: () => undefined,
  activeFeed: 'global',
  isLoading: false,
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<Post[]>([])

  const [activeFeed, setActiveFeed] = useState<FeedType>('global')
  const { activeAccount } = useWallet()
  const [assetId, setAssetId] = useState<AssetId | null>(null)

  const [transactionId, setTransactionId] = useState<string>('')

  const { data, isFetching: isLoadingGetAllPosts, refetch } = useGetAllPosts(false)

  const { data: postData, refetch: refetchPostData } = useGetPostByTransactionId(transactionId, false)

  const {
    data: postDataByWalletAddress,
    isFetching: isLoadingPostDataByWalletAddress,
    refetch: refetchPostByWalletAddress,
  } = useGetAllPostsByWalletAddress(activeAccount?.address || '', false)

  const isLoading = isLoadingGetAllPosts || isLoadingPostDataByWalletAddress

  useEffect(() => {
    const savedPosts = sessionStorage.getItem('postList')
    if (savedPosts) {
      setPostList(JSON.parse(savedPosts))
    } else {
      refetch()
    }
  }, [refetch])

  useEffect(() => {
    if (postList.length > 0) {
      sessionStorage.setItem('postList', JSON.stringify(postList))
    }
  }, [postList])

  useEffect(() => {
    if (activeFeed === 'global' && data) {
      setPostList(
        data
          .filter((post) => !assetId || post.assetId === assetId)
          .map((post) => ({
            ...post,
            status: 'accepted',
            replies: post.replies.map((reply) => ({
              ...reply,
              status: 'accepted',
            })),
          })),
      )
    }
  }, [data, assetId, activeFeed])

  useEffect(() => {
    if (postDataByWalletAddress && activeFeed === 'personalized') {
      setPostList(
        postDataByWalletAddress
          .filter((post) => !assetId || post.assetId === assetId)
          .map((post) => ({
            ...post,
            status: 'accepted',
            replies: post.replies.map((reply) => ({
              ...reply,
              status: 'accepted',
            })),
          })),
      )
    }
  }, [postDataByWalletAddress, assetId, activeFeed])

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

  const handleChangeFeed = (feed: FeedType, assetIdFilter?: number) => {
    setActiveFeed(feed)
    setAssetId(assetIdFilter || null)

    if (feed === 'personalized') {
      refetchPostByWalletAddress()
    } else if (feed === 'global') {
      refetch()
    }
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
      activeFeed,
      handleNewReply,
      handleGetPostByAddress,
      handleGetPostByTransactionId,
      handleRefreshPosts,
      handleAddNewPost,
      handleDeletePost,
      handleChangeFeed,
      isLoading,
    }),
    [postList, activeFeed, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
