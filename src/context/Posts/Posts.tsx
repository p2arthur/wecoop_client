import { useQueryClient } from '@tanstack/react-query'
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import { useGetFeedByMongo, useGetPostByTransactionId } from '../../services/api/Posts'
import { Daum, FilePost, Like, Poll } from '../../services/api/types'

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
  postList: Daum[] | null
  handleGetPostByAddress(address: string): Daum[] | undefined
  handleAddNewPost(post: Daum | Poll | FilePost): void
  handleNewReply(newReply: Daum, transactionCreatorId: string): void
  handleNewLike(newLike: { creator_address: any }, transactionCreatorId: string): void
  handleDeleteLoadingPost(transactionCreatorId: string): void
  handleGetPostByTransactionId(transactionId: string): Daum | undefined
  handleFilterByAssetId(assetId: number | null): void
  handleRefreshPosts(): void
  handleChangeFeed(feed: FeedType | string): void
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
  handleDeleteLoadingPost: () => undefined,
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
  const queryClient = useQueryClient()
  const [postList, setPostList] = useState<Daum[]>([])
  const [assetId, setAssetId] = useState<AssetId | null>(null)
  const [postType, setPostType] = useState<string>('post')
  const [transactionId, setTransactionId] = useState<string>('')
  const [activeFeed, setActiveFeed] = useState<FeedType>('global')

  const { data: dataMongo, isFetching: isLoadingGetAllPosts, refetch } = useGetFeedByMongo()

  const { data: postData, refetch: refetchPostData } = useGetPostByTransactionId(transactionId, false)

  useEffect(() => {
    if (dataMongo && assetId === null) {
      setPostList(dataMongo?.data)
    } else if (assetId !== null) {
      setPostList(dataMongo?.data?.filter((post) => post.assetId === assetId) || [])
    }
  }, [dataMongo, assetId])

  const isLoading = isLoadingGetAllPosts

  const handleChangePostType = (postType: string) => {
    setPostType(postType)
  }

  const handleFilterByAssetId = (assetId: number) => {
    setActiveFeed('coinFeed')
    setAssetId(assetId)
  }

  const handleRefreshPosts = () => {
    queryClient.refetchQueries({ queryKey: ['getFeedByMongo'] }).then(() => {
      if (dataMongo && assetId === null) {
        setPostList(dataMongo.data)
      } else {
        setPostList(dataMongo?.data?.filter((post) => post.assetId === assetId) || [])
      }
    })
  }

  const handleChangeFeed = (feed: FeedType) => {
    setActiveFeed(feed)

    if (feed === 'personalized') {
      setAssetId(null)
    } else if (feed === 'global') {
      setAssetId(null)
      refetch()
    }
  }

  const handleDeleteLoadingPost = (transactionCreatorId: string) => {
    const newPostsList = postList.filter((post) => post.status == 'accepted')
    setPostList(newPostsList)
  }

  const handleGetPostByAddress = (address: string) => {
    return postList.filter((post) => post.creator_address === address)
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

  const handleAddNewPost = (post: Daum | FilePost) => {
    setPostList((prevPosts) => [post, ...(prevPosts || [])])
  }

  const handleNewReply = (newReply: Daum, transactionCreatorId: string) => {
    const newPostsList = postList?.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        return { ...post, replies: [...(post.replies || []), newReply] }
      }
      return post
    })
    // @ts-ignore
    setPostList(newPostsList)
  }

  const handleNewLike = (newLike: Like, transactionCreatorId: string) => {
    const newPostsList = postList?.map((post) => {
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
      handleDeleteLoadingPost,
      handleChangeFeed,
      handleFilterByAssetId,
    }),
    [assetId, postType, postList, activeFeed, isLoading],
  )

  return <PostsContext.Provider value={postProviderValues}>{children}</PostsContext.Provider>
}

const usePosts = () => useContext(PostsContext)

export { PostsProvider, usePosts }
