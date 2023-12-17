import { useEffect, useState } from 'react'
import { FaCircleCheck, FaTrophy } from 'react-icons/fa6'
import { useParams } from 'react-router-dom'
import { DropDown } from '../components/DropDown'
import EmptyFeed from '../components/EmptyFeed'
import FeedComponent from '../components/Feed'
import LoaderSpinner from '../components/LoaderSpinner'
import { AssetId } from '../enums/assetId'
import { Feed } from '../services/Feed'
import { PostProps } from '../services/Post'
import { User, UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'

interface ProfilePageStateInterface {
  state: null | 'loading' | 'success' | 'error'
}

const ProfilePage = () => {
  const { walletAddress } = useParams<{ walletAddress: string }>()
  const [user, setUser] = useState<UserInterface | null>(null)
  const [postsList, setPostsList] = useState<PostProps[]>([])
  const [profilePageState, setProfilePageState] = useState<ProfilePageStateInterface>({ state: null })

  console.log(postsList, 'postslist')

  const feed = new Feed()

  const getAllPosts = async () => {
    try {
      setProfilePageState({ state: 'loading' })

      const userService = new User({ address: walletAddress! })
      const user = await userService.getUser()

      const profilePageUserBalance = await userService.getUserAssetBalance(walletAddress!, AssetId.coopCoin)

      const profileUser = Object.assign(user, { balance: profilePageUserBalance })

      setUser(profileUser)

      setProfilePageState({ state: 'loading' })

      const { data } = await feed.getPostsByAddress(walletAddress!)

      console.log(data, 'data')

      if (postsList.length === 0) {
        const existingTransactionIds = postsList.map((post) => post.transaction_id)

        const uniquePosts = data.filter((post) => !existingTransactionIds.includes(post.transaction_id))
        setPostsList(uniquePosts)

        setProfilePageState({ state: 'success' })
      } else {
        const existingTransactionIds = postsList.map((post) => post.transaction_id)

        const uniquePosts = data.filter((post) => !existingTransactionIds.includes(post.transaction_id))

        setPostsList((prev) => [...prev, ...uniquePosts])

        setProfilePageState({ state: 'success' })
      }
    } catch (error) {
      console.error('Error fetching posts:', error)
    }
  }

  const setPosts = (newPost: PostProps) => {
    setPostsList([newPost, ...postsList])
  }

  useEffect(() => {
    getAllPosts().then()
  }, [])

  const handleNewReply = (newReply: PostProps, transactionCreatorId: string) => {
    const newPostsList = postsList.map((post) => {
      if (transactionCreatorId === post.transaction_id) {
        if (post.replys === undefined) {
          return { ...post, replys: [newReply] }
        }
        return { ...post, replys: [...post.replys, newReply] }
      }
      return post
    })
    setPostsList(newPostsList)
  }

  console.log(postsList)

  return (
    <div className="flex flex-col ">
      <section className="p-4">
        <div className="w-full h-44 border-2 flex flex-col gap-6 border-gray-900 border-b-4 p-5">
          <div className="flex gap-3 justify-between">
            <div className="flex gap-3 items-center">
              <div className="border-2 border-gray-900 rounded-full">
                {user?.avatarUri && <img className="w-16" src={user?.avatarUri} alt="profile-photo" />}
              </div>
              <div className="flex flex-col">
                <div className="flex items-center gap-1">
                  <h3 className="text-xl md:text-3xl font-bold">{user?.nfd ? user.nfd : ellipseAddress(user?.address)}</h3>
                  {user?.nfd ? (
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
          </div>
          <div className="flex justify-end">
            <DropDown buttonText="Donate $COOP" children={<>aaaaa</>} type="connect" options={[]} />
          </div>
        </div>
      </section>
      {profilePageState.state == 'loading' ? (
        <LoaderSpinner text="loading posts" />
      ) : profilePageState.state == 'success' ? (
        <section className="p-4 flex flex-col gap-3">
          <FeedComponent getAllPosts={getAllPosts} postsList={postsList} handleNewReply={handleNewReply} />
        </section>
      ) : (
        <EmptyFeed />
      )}
    </div>
  )
}

export default ProfilePage
