import { useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'
import { UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'
import { DropDown } from './DropDown'

interface ConnectWalletProps {
  user: UserInterface
}

const ConnectWallet = ({ user }: ConnectWalletProps) => {
  const { providers, activeAccount } = useWallet()

  useEffect(() => {
    console.log('userData from connect wallet', user)
  }, [user])

  return (
    <div>
      {activeAccount ? (
        <div>
          <DropDown
            icon={user.avatarUri}
            options={providers}
            buttonText={!user.nfd ? ellipseAddress(activeAccount.address) : user.nfd.toUpperCase()}
          />
        </div>
      ) : (
        <div>
          <DropDown options={providers} buttonText="Connect Wallet" />
        </div>
      )}
    </div>
  )
}

export default ConnectWallet
