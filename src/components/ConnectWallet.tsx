import { useWallet } from '@txnlab/use-wallet'
import { UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'
import { DropDown } from './DropDown'

interface ConnectWalletProps {
  user: UserInterface
}

const ConnectWallet = ({ user }: ConnectWalletProps) => {
  const { providers, activeAccount } = useWallet()

  const actualProvider = providers?.find((provider) => provider.metadata.id === activeAccount?.providerId)

  return (
    <div>
      {activeAccount ? (
        <div>
          <DropDown
            icon={user.avatarUri}
            options={[actualProvider!]}
            type="activeAccount"
            buttonText={!user.nfd ? ellipseAddress(activeAccount.address) : user.nfd.toUpperCase()}
            address={activeAccount.address}
          />
        </div>
      ) : (
        <div>
          <DropDown type="connect" options={providers} buttonText="Connect Wallet" />
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
