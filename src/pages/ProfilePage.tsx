import { useEffect, useState } from 'react'
import { useOutletContext, useParams } from 'react-router-dom'
import Button from '../components/Button'
import { Feed } from '../services/Feed'
import { PostProps } from '../services/Post'
import { User, UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'

interface ProfilePageOutletContext {
  userData: UserInterface
}

const ProfilePage = () => {
  const { userData } = useOutletContext() as ProfilePageOutletContext
  const { walletAddress } = useParams<{ walletAddress: string }>()

  const [user, setUser] = useState<UserInterface | null>(null)
  const [postList, setPostList] = useState<PostProps[]>([])

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userService = new User({ address: walletAddress! })
        const profileUser = await userService.getUser()
        setUser(profileUser)

        const feedServices = new Feed()
        const posts = await feedServices.getPostsByAddress(walletAddress!)
        setPostList(posts)
      } catch (error) {
        console.error('Error fetching user data or posts', error)
      }
    }

    fetchData()
  }, [userData, walletAddress])

  const renderedUserPosts = postList.map((post) => (
    <div className="border-2 p-2 border-gray-900 h-32" key={post.transaction_id}>
      <p>{post.text}</p>
    </div>
  ))

  return (
    <div className="flex flex-col ">
      <section className="p-4">
        <div className="w-full h-44 border-2 flex flex-col gap-6 border-gray-900 p-5">
          <div className="flex items-center gap-3">
            <div className="border-2 border-gray-900 rounded-full">
              <img className="w-16" src={user?.avatarUri} alt="profile-photo" />
            </div>
            <div>
              <h3 className="text-3xl font-bold">{user?.nfd ? user.nfd : ellipseAddress(user?.address)}</h3>
            </div>
          </div>
          <div className="flex gap-6 justify-end">
            <Button buttonText="Donate $COOP" />
            <Button buttonText="Donate $COOP" />
          </div>
        </div>
      </section>
      <section className="h-screen p-4 flex flex-col gap-3">{renderedUserPosts}</section>
    </div>
  )
}

export default ProfilePage
