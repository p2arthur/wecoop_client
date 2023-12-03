import { useWallet } from '@txnlab/use-wallet'
import { useEffect } from 'react'
import { DropDown } from './DropDown'

const ConnectWallet = () => {
  const { providers, activeAccount } = useWallet()

  useEffect(() => {
    console.log(activeAccount?.address)
  }, [activeAccount])

  return (
    <div>
      {activeAccount ? (
        <DropDown options={providers} buttonText={activeAccount.address} />
      ) : (
        <DropDown options={providers} buttonText="Connect Wallet" />
      )}
    </div>
  )
}

export default ConnectWallet
