import { useWallet } from '@txnlab/use-wallet'
import { useOutletContext } from 'react-router-dom'
import { User, UserInterface } from '../services/User'
import { ellipseAddress } from '../utils/ellipseAddress'
import { DropDown } from './DropDown'

interface ConnectWalletOutletContext {
  userData: UserInterface | null
}

const ConnectWallet = () => {
  const { providers, activeAccount } = useWallet()
  const outletContext = useOutletContext() as ConnectWalletOutletContext

  const userServices = new User({ address: activeAccount?.address! })

  const svgUri = userServices.generateIdIcon(activeAccount?.address!)

  return (
    <div>
      {activeAccount ? (
        <div>
          <DropDown icon={svgUri} options={providers} buttonText={ellipseAddress(activeAccount.address)} />
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
