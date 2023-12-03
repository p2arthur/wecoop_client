import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders, useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { useEffect, useState } from 'react'
import NavBar from './components/NavBar'
import { Feed, Post } from './services/Feed'
import { getAlgodConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

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
  const [postsList, setPostsList] = useState<Post[]>()

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

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <NavBar />
        <div className="flex flex-col gap-10 h-screen">
          {postsList?.map((post) => {
            return (
              <div className="border-2 flex flex-col break-words">
                <p className="w-screen ">{post.text}</p>
              </div>
            )
          })}
        </div>
      </WalletProvider>
    </SnackbarProvider>
  )
}
