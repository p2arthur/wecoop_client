import { useOutletContext } from 'react-router-dom'
import { UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'

interface ProfilePageOutletContext {
  userData: UserInterface
}

const ProfilePage = () => {
  const { userData } = useOutletContext() as ProfilePageOutletContext

  console.log('user data from ProfilePage', userData)

  return (
    <div className="flex flex-col">
      <section className="p-6">
        <div className="w-full h-44 border-2 border-gray-900 p-5 bg-green-300">
          <div className="flex flex-col">
            <img src="" alt="" />
            <div>{userData.nfd ? userData.nfd : ellipseAddress(userData.address)}</div>
          </div>
        </div>
      </section>
      <section className="h-screen"></section>
    </div>
  )
}

export default ProfilePage
