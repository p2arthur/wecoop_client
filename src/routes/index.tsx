import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Footer from '../components/Footer'
import NavBar from '../components/NavBar'
import Home from '../pages/Home'
import ProfilePage from '../pages/ProfilePage'
import { User, UserInterface } from '../services/User'

export const Router = () => {
  const { activeAccount } = useWallet()

  const [userData, setUserData] = useState<UserInterface>({ address: '', avatarUri: '' })

  useEffect(() => {
    async function appendUserData() {
      const userServices = new User({ address: activeAccount?.address! })
      const userData = await userServices.setUser()
      setUserData(userData)
    }

    if (activeAccount) {
      appendUserData()
    }
  }, [activeAccount])

  const algod = new algosdk.Algodv2('a'.repeat(64), 'https://testnet-api.algonode.cloud', '')

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
      ],
    },
  ])

  return <RouterProvider router={router} />
}
