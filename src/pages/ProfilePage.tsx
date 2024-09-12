import { useWallet } from '@txnlab/use-wallet'
import { minidenticon } from 'minidenticons'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import EmptyFeed from '../components/EmptyFeed'
import FeedComponent from '../components/Feed'
import FollowButton from '../components/FollowButton'
import LoaderSpinner from '../components/LoaderSpinner'
import { usableAssetsList } from '../data/usableAssetsList'
import { useGetPostsByAddress } from '../services/api/Posts'
import { Post, User } from '../services/api/types'
import { useGetUserInfo } from '../services/api/Users'
import { ellipseAddress } from '../utils/ellipseAddress'

interface UserDataInterface {
  data: User | undefined
  isLoading: boolean
}

const ProfilePage = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>()
  const { activeAccount } = useWallet()
  const [user, setUser] = useState<User | null>(null)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [postsList, setPostsList] = useState<Post[]>([])
  const [isFollowing, setIsFollowing] = useState<boolean>(false)

  // Get the profile data for the walletAddress being viewed
  const { data: userData, isLoading: isLoadingUser } = useGetUserInfo(walletAddress as string) as UserDataInterface
  // Get the current logged-in user data
  const { data: currentUserData, isLoading: isLoadingCurrentUser } = useGetUserInfo(activeAccount?.address as string)

  const { data, isLoading } = useGetPostsByAddress(walletAddress as string)

  // Set user and currentUser separately
  useEffect(() => {
    if (userData) {
      setUser(userData) // This is the profile being viewed
    }
    if (currentUserData) {
      setCurrentUser(currentUserData) // This is the logged-in user
    }
  }, [userData, currentUserData])

  useEffect(() => {
    if (data) {
      const posts = setPostsList(updateRepliesStatus(data))
      console.log('posts', posts)
    }
  }, [data])

  useEffect(() => {
    if (currentUser && user) {
      getIsFollowing()
    }
  }, [currentUser, user])

  const updateRepliesStatus = (posts: Post[]): Post[] => {
    const updatedPosts = posts.map((post) => ({
      ...post,
      replies: post.replies.map((reply) => ({
        ...reply,
        status: 'accepted',
      })),
    }))

    console.log('updated posts', updatedPosts)

    return updatedPosts
  }

  const getIsFollowing = (): void => {
    if (currentUser?.followTargets.includes(user?.address!)) {
      console.log(true)
      setIsFollowing(true)
    } else {
      console.log(currentUser?.followTargets)
      console.log(false)
      setIsFollowing(false)
    }
  }

  const handleNewReply = (newReply: Post, transactionCreatorId: string) => {
    const newPostsList = postsList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replies === undefined) {
          return { ...post, replies: [newReply] }
        }
        return { ...post, replies: [...post.replies, newReply] }
      }
      return post
    })
    setPostsList(updateRepliesStatus(newPostsList))
  }

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const getAssetById = (assetId: string) => {
    return usableAssetsList.find((asset) => asset.assetId === Number(assetId))
  }

  return (
    <div className="flex flex-col ">
      <section className="p-4">
        <div className=" mt-14 w-full h-44 border-2 flex flex-col gap-6 border-gray-900 bg-gray-900 dark:border-gray-900 border-b-4 p-5">
          <div className="flex gap-3 justify-between items-start">
            <div className="flex flex-col  md:flex-row gap-3">
              <div className="border-2 border-b-4 h-32 w-32 bg-gray-100 border-gray-900 rounded-md overflow-hidden">
                {user?.avatar !== null ? (
                  <img className="w-32 h-32" src={user?.avatar} alt="profile-photo" />
                ) : (
                  <img className="w-32 h-32" src={generateIdIcon(user?.address as string)} alt="profile-photo" />
                )}
              </div>
              <div className="flex flex-col justify-between">
                <div className="flex items-center gap-1">
                  <h3 className="text-2xl md:text-4xl font-bold">
                    {user?.nfd?.name !== null ? user?.nfd?.name : ellipseAddress(user?.address)}
                  </h3>
                </div>
                <div className="flex gap-5 items-center">
                  {user?.balance ? (
                    <div className="flex items-center gap-1">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                          <div className="flex items-end gap-1">
                            <ul className="grid grid-cols-3 mt-2 gap-3 gap-y-5">
                              {Object.keys(user.balance).map((key) => (
                                <div className={'flex gap-2 items-end'}>
                                  <div className="w-6 h-6 rounded-full overflow-hidden border-b-4 border-black">
                                    <img src={getAssetById(key)?.image} alt="asset icon" className="w-6 h-6" />
                                  </div>
                                  <p> {user.balance[key]}</p>
                                </div>
                              ))}
                            </ul>
                            {/* <p className="text-xl">{user?.balance}</p>
                            <p className="border-gray-950 text-sm">{((user?.balance / 2100000) * 100).toFixed(3)}% of the supply</p> */}
                          </div>{' '}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <LoaderSpinner text="loading balance" />
                  )}
                </div>
              </div>
            </div>
            <FollowButton isFollowing={isFollowing} walletAddress={user?.address || ''} />
          </div>
        </div>
      </section>
      {isLoading ? (
        <LoaderSpinner text="loading posts" />
      ) : postsList.length > 0 ? (
        <section className="p-4 flex flex-col gap-3">
          <FeedComponent postList={postsList} isLoading={isLoading} handleNewReply={handleNewReply} />
        </section>
      ) : (
        <EmptyFeed />
      )}
    </div>
  )
}

export default ProfilePage
