import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import Home from '../pages/Home'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import algosdk from 'algosdk'
import { useEffect, useState } from 'react'
import { User, UserInterface } from '../services/User'
import { useWallet } from '@txnlab/use-wallet'

export const Router = () => {
  const { activeAccount } = useWallet()

  const [userData, setUserData] = useState<UserInterface>({ address: '', avatarUri: '' })

  useEffect(() => {
    async function appendUserDate() {
      const userServices = new User({ address: activeAccount?.address! })
      const userData = await userServices.setUser()
      setUserData(userData)
    }

    if (activeAccount) {
      appendUserDate()
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
        { path: '/profile/:walletAddress', element: <Home /> },
      ],
    },
  ])

  return <RouterProvider router={router} />
}
