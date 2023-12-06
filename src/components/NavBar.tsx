import { UserInterface } from '../services/User'
import ConnectWallet from './ConnectWallet'

interface NavBarProps {
  user: UserInterface
}

const NavBar = ({ user }: NavBarProps) => {
  return (
    <div className="p-3 border-b-4 border-gray-900 flex justify-between items-center">
      <a href="/">
        <p className="font-bold text-3xl">$COOP</p>
      </a>
      <ConnectWallet user={user} />
    </div>
  )
}

export default NavBar
