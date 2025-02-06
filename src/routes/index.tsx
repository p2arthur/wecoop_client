import { useWallet } from '@txnlab/use-wallet'
import algosdk, { AlgodTokenHeader } from 'algosdk'
import { useEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import NavBar from '../components/NavBar'
import Whitepaper from '../pages/About'
import Feed from '../pages/Feed'
import FeedPage from '../pages/FeedPage'
import { Home } from '../pages/Home'
import { PollFeed } from '../pages/PollFeed'
import PostPage from '../pages/PostPage'
import ProfilePage from '../pages/ProfilePage'
import TheTrenches from '../pages/TheTrenches'
import TrenchesWhitepaper from '../pages/trenches/ReadmeTrenches'
import { User } from '../services/User'
import { User as UserInterface } from '../services/api/types'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

export const Router = () => {
  const { activeAccount } = useWallet()

  const [userData, setUserData] = useState<UserInterface>({
    address: '',
    avatar: 'string',
    nfd: {
      name: '',
      avatar: '',
    },
    balance: {},
    followTargets: [],
  })

  useEffect(() => {
    async function appendUserData() {
      const userServices = new User({
        address: activeAccount?.address ?? '',
        avatar: '',
        nfd: { name: '', avatar: '' },
        balance: {},
        followTargets: [],
      })
      const userData = await userServices.setUser(activeAccount?.address || '', algod)
      setUserData(userData)
    }

    if (activeAccount) {
      appendUserData()
    }
  }, [activeAccount])

  const algodServer = getAlgodConfigFromViteEnvironment().server
  const algodToken = getAlgodConfigFromViteEnvironment().token
  const algodPort = getAlgodConfigFromViteEnvironment().port

  const algod = new algosdk.Algodv2(algodToken as AlgodTokenHeader, algodServer, algodPort)

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar user={userData} />
          <Outlet context={{ algod, userData }} />
          {/* <Footer /> */}
        </>
      ),
      children: [
        { path: '/', element: <Home /> },
        { path: '/feed', element: <Feed /> },
        { path: '/profile/:walletAddress', element: <ProfilePage /> },
        { path: '/feed/by/:walletAddress', element: <FeedPage /> },
        { path: '/about', element: <Whitepaper /> },
        { path: '/post', element: <PostPage /> },
        { path: '/polls', element: <PollFeed /> },
        { path: '/the-trenches', element: <TheTrenches /> },
        { path: '/the-trenches/read-me', element: <TrenchesWhitepaper /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
