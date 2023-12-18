import { DeflyWalletConnect } from '@blockshake/defly-connect'
import { DaffiWalletConnect } from '@daffiwallet/connect'
import { PeraWalletConnect } from '@perawallet/connect'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { PROVIDER_ID, ProvidersArray, WalletProvider, useInitializeProviders } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import { SnackbarProvider } from 'notistack'
import { Router } from './routes'
import { getIndexerConfigFromViteEnvironment } from './utils/network/getAlgoClientConfigs'

const providersArray: ProvidersArray = [
  { id: PROVIDER_ID.DEFLY, clientStatic: DeflyWalletConnect },
  { id: PROVIDER_ID.PERA, clientStatic: PeraWalletConnect },
  { id: PROVIDER_ID.DAFFI, clientStatic: DaffiWalletConnect },
  { id: PROVIDER_ID.EXODUS },
]

const queryClient = new QueryClient()

export default function App() {
  const walletProviders = useInitializeProviders({
    providers: providersArray,
    nodeConfig: {
      network: 'testnet',
      nodeServer: getIndexerConfigFromViteEnvironment().server,
      nodePort: '',
      nodeToken: 'a'.repeat(64),
    },
    algosdkStatic: algosdk,
  })

  return (
    <SnackbarProvider maxSnack={3}>
      <WalletProvider value={walletProviders}>
        <QueryClientProvider client={queryClient}>
          <Router />
        </QueryClientProvider>
      </WalletProvider>
    </SnackbarProvider>
  )
}
