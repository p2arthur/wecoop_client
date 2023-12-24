import { minidenticon } from 'minidenticons'
import { useEffect, useState } from 'react'
import { FaCircleCheck, FaTrophy } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'
import EmptyFeed from '../components/EmptyFeed'
import FeedComponent from '../components/Feed'
import FollowButton from '../components/FollowButton'
import LoaderSpinner from '../components/LoaderSpinner'
import { AssetId } from '../enums/assetId'
import { getPostsByAddress, useGetPostsByAddress } from '../services/api/Posts'
import { useGetUserInfo } from '../services/api/Users'
import { Post, User } from '../services/api/types'
import { ellipseAddress } from '../utils/ellipseAddress'

const ProfilePage = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>()
  const [user, setUser] = useState<User | null>(null)
  const [postsList, setPostsList] = useState<Post[]>([])

  const { data: userData, isLoading: isLoadingUser } = useGetUserInfo(walletAddress as string)

  const { data, isLoading } = useGetPostsByAddress(walletAddress as string)

  useEffect(() => {
    if (userData) {
      setUser(userData)
    }
  }, [userData])

  useEffect(() => {
    if (data) {
      setPostsList(data)
      console.log('postss data', postsList)
    }
  }, [data])

  useEffect(() => {
    const appendInitialUserPosts = async () => {
      console.log('walletAddress', walletAddress)
      console.log('walletAddress changed')
      const data = useGetPostsByAddress(walletAddress!)
      setPostsList(data)
    }

    appendInitialUserPosts()
  }, [])

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
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
    setPostsList(newPostsList)
  }

  return (
    <div className="flex flex-col ">
      <section className="p-4">
        <div className="w-full h-44 border-2 flex flex-col gap-6 border-gray-900 border-b-4 p-5">
          <div className="flex gap-3 justify-between items-center">
            <div className="flex gap-3">
              <div className="border-2 border-gray-900 rounded-md overflow-hidden">
                {user?.avatar ? (
                  <img className="w-16" src={user?.avatar} alt="profile-photo" />
                ) : (
                  <img className="w-16" src={generateIdIcon(user?.address as string)} alt="profile-photo" />
                )}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <h3 className="text-xl md:text-3xl font-bold">
                    {user?.nfd.name !== null ? user?.nfd?.name : ellipseAddress(user?.address)}
                  </h3>
                  {user?.nfd.name !== null ? (
                    <span>
                      <FaCircleCheck className="text-md md:text-xl text-orange-500" />
                    </span>
                  ) : null}
                </div>
                <div className="flex gap-5 items-center">
                  {user?.balance !== undefined ? (
                    <div className="flex items-center gap-1">
                      <img
                        className="w-6 h-6"
                        src={`https://asa-list.tinyman.org/assets/${AssetId.coopCoin}/icon.png`}
                        alt="coopcoin-icon"
                      />
                      <p className="text-xl">{user.balance}</p>
                    </div>
                  ) : (
                    <LoaderSpinner text="loading balance" />
                  )}
                  {postsList.length >= 5 ? (
                    <div className="relative flex gap-2 items-center">
                      <span className="font-bold text-xl">5</span>
                      <FaTrophy className="text-yellow-500 text-md md:text-xl" />
                    </div>
                  ) : postsList.length >= 1 ? (
                    <div className="relative flex gap-2 items-center">
                      <span className="font-bold text-xl">1</span>
                      <FaTrophy className="text-green-500 text-xl" />
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
            <FollowButton walletAddress={userData?.address!} />
          </div>
          {/* <div className="flex justify-end">
            <DropDown buttonText="Donate $COOP" children={<>aaaaa</>} type="connect" options={[]} />
          </div> */}
        </div>
      </section>
      {isLoading || isLoadingUser ? (
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
