import { useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'
import { ellipseAddress } from '../utils/ellipseAddress'
import { DropDown } from './DropDown'

const ConnectWallet = () => {
  const { providers, activeAccount } = useWallet()

  useEffect(() => {}, [activeAccount])

  return (
    <div>
      {activeAccount ? (
        <DropDown options={providers} buttonText={ellipseAddress(activeAccount.address)} />
      ) : (
        <DropDown options={providers} buttonText="Connect Wallet" />
      )}
    </div>
  )
}

export default ConnectWallet
