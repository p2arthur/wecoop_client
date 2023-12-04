import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import { Outlet, RouterProvider, createBrowserRouter } from 'react-router-dom'
import NavBar from './components/NavBar'
import { Feed } from './services/Feed'
import { PostProps } from './services/Post'
import { ellipseAddress } from './utils/ellipseAddress'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'
import Home from './pages/Home'

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
  const { activeAccount } = useWallet()
  const [postsList, setPostsList] = useState<PostProps[]>([])

  const feed = new Feed()

  const getAllPosts = async () => {
    const data = await feed.getAllPosts()
    setPostsList(data)
  }

  useEffect(() => {
    getAllPosts()
  }, [])

  useEffect(() => {}, [activeAccount])

  const algodConfig = getAlgodConfigFromViteEnvironment()

  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: algodConfig.network,
      nodeServer: algodConfig.server,
      nodePort: String(algodConfig.port),
      nodeToken: String(algodConfig.token),
    },
    algosdkStatic: algosdk,
  })

  const router = createBrowserRouter([
    {
      element: (
        <>
          <NavBar />
          <Outlet />
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
