import { useWallet } from '@txnlab/use-wallet'
import { minidenticon } from 'minidenticons'
import { RiWallet2Fill } from 'react-icons/ri'
import { User as UserInterface } from '../services/api/types'
import { ellipseAddress } from '../utils/ellipseAddress'
import { DropDown } from './DropDown'

interface ConnectWalletProps {
  user: UserInterface
}

const ConnectWallet = ({ user }: ConnectWalletProps) => {
  const { providers, activeAccount } = useWallet()

  const actualProvider = providers?.find((provider) => provider.metadata.id === activeAccount?.providerId)

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  return (
    <div>
      {activeAccount ? (
        <div>
          <DropDown
            icon={<img className="bg-gray-100" src={user.avatar || generateIdIcon(user.address)} />}
            options={[actualProvider!]}
            type="activeAccount"
            buttonText={user.nfd.name || ellipseAddress(activeAccount.address) || 'Loading'}
            address={activeAccount.address}
          />
        </div>
      ) : (
        <div>
          <DropDown type="connect" options={providers} buttonText="Connect Wallet" icon={<RiWallet2Fill />} />
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
