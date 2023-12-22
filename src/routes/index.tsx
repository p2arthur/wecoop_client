import { useWallet } from '@txnlab/use-wallet'
import algosdk, { AlgodTokenHeader } from 'algosdk'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import Whitepaper from '../pages/About'
import Home from '../pages/Home'
import ProfilePage from '../pages/ProfilePage'
import { User, UserInterface } from '../services/User'
import { getAlgodConfigFromViteEnvironment } from '../utils/network/getAlgoClientConfigs'

export const Router = () => {
  const { activeAccount } = useWallet()

  const [userData, setUserData] = useState<UserInterface>({ address: '', avatarUri: '' })

  useEffect(() => {
    async function appendUserData() {
      const userServices = new User({ address: activeAccount?.address ?? '' })
      const userData = await userServices.setUser()
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
          <Footer />
        </>
      ),
      children: [
        { path: '/', element: <Home /> },
        { path: '/profile/:walletAddress', element: <ProfilePage /> },
        { path: '/about', element: <Whitepaper /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
