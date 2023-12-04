import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import Home from './pages/Home'
import { Feed } from './services/Feed'
import { PostProps } from './services/Post'
import { User, UserInterface } from './services/User'

let providersArray: ProvidersArray

providersArray = [
  { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
  { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
  { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
  { id: PROVIDER_ID.EXODUS },
  // If you are interested in WalletConnect v2 provider
  // refer to https://github.com/TxnLab/use-wallet for detailed integration instructions
]

export default function App() {
  const { activeAccount, providers } = useWallet()
  const [userData, setUserData] = useState<UserInterface>({ address: '' })
  const [postsList, setPostsList] = useState<PostProps[]>([])

  const feed = new Feed()

  const getAllPosts = async () => {
    const data = await feed.getAllPosts()
    console.log(data)
    setPostsList(data)
  }

  useEffect(() => {
    getAllPosts()
  }, [])

  useEffect(() => {
    if (activeAccount) {
      setUserData({ address: activeAccount.address })
      console.log('providers', providers)
      const user = new User(activeAccount)
      user.signTransaction()
    }
  }, [activeAccount])

  const algod = new algosdk.Algodv2('a'.repeat(64), 'https://testnet-api.algonode.cloud', '')

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: 'testnet',
      nodeServer: 'https://testnet-api.algonode.cloud',
      nodePort: '',
      nodeToken: 'a'.repeat(64),
    },
    algosdkStatic: algosdk,
  })

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar />
          <Outlet context={{ algod, userData }} />
        </>
      ),
      children: [{ path: '/', element: <Home postsList={postsList} /> }],
    },
  ])

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <RouterProvider router={router} />
      </WalletProvider>
    </SnackbarProvider>
  )
}
