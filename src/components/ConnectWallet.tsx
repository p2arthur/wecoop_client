import { useWallet } from '@txnlab/use-wallet'
import { User as UserInterface } from '../services/api/types'
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
            icon={user.avatar}
            options={[actualProvider!]}
            type="activeAccount"
            buttonText={user.nfd.name != null ? user?.nfd.name : ellipseAddress(activeAccount.address)}
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
