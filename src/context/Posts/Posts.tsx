import { useWallet } from '@txnlab/use-wallet'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useGetAllPosts, useGetAllPostsByWalletAddress, useGetPostByTransactionId } from '../../services/api/Posts'
import { Like, Post } from '../../services/api/types'

export enum AssetId {
  coopCoin = 796425061,
  xusd = 760037151,
  algo = 0,
  jaws = 2155690250,
  ora = 1284444444,
  niko = 1265975021,
}

export type FeedType = 'personalized' | 'global' | 'coinFeed'

type IPostsContext = {
  postList: Post[] | null
  handleGetPostByAddress(address: string): Post | undefined
  handleAddNewPost(post: Post): void
  handleNewReply(newReply: Post, transactionCreatorId: string): void
  handleNewLike(newLike: Like, transactionCreatorId: string): void
  handleDeletePost(transactionCreatorId: string): void
  handleGetPostByTransactionId(transactionId: string): Post | undefined
  handleFilterByAssetId(assetId: number | null): void
  handleRefreshPosts(): void
  handleChangeFeed(feed: FeedType): void
  activeAssetId?: AssetId | null
  activeFeed?: FeedType
  isLoading: boolean
  postType: string
  handleChangePostType: (postType: string) => void
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
  handleFilterByAssetId: () => undefined,
  handleChangePostType: () => undefined,
  activeFeed: 'global',
  activeAssetId: null,
  isLoading: false,
  postType: 'post',
})

const PostsProvider = ({ children }: IPostsProviderProps) => {
  const [postList, setPostList] = useState<Post[]>([])

  const [activeFeed, setActiveFeed] = useState<FeedType>('global')
  const { activeAccount } = useWallet()
  const [assetId, setAssetId] = useState<AssetId | null>(null)
  const [postType, setPostType] = useState<string>('post')

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

  const handleChangePostType = (postType: string) => {
    setPostType(postType)
  }

  const handleFilterByAssetId = (assetId: number) => {
    setAssetId(assetId)
    setPostList(data?.filter((post) => post.assetId === assetId) || [])
  }

  console.log(assetId, 'assetid', postList)

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

    if (feed === 'personalized') {
      setAssetId(assetIdFilter || null)
      refetchPostByWalletAddress()
    } else if (feed === 'global') {
      setAssetId(assetIdFilter || null)
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
      isLoading,
      activeFeed,
      postType,
      activeAssetId: assetId,
      handleNewLike,
      handleChangePostType,
      handleNewReply,
      handleGetPostByAddress,
      handleGetPostByTransactionId,
      handleRefreshPosts,
      handleAddNewPost,
      handleDeletePost,
      handleChangeFeed,
      handleFilterByAssetId,
    }),
    [assetId, postType, postList, activeFeed, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
