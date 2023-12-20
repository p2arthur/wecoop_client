import { UserInterface } from '../services/User'
import ConnectWallet from './ConnectWallet'
import ThemeSwitcher from './ThemeSwitcher'

interface NavBarProps {
  user: UserInterface
}

const NavBar = ({ user }: NavBarProps) => {
  return (
    <div className="p-3 border-b-4 border-gray-900 flex justify-between items-center">
      <a href="/">
        <p className="font-bold text-3xl">WeCOOP</p>
      </a>
      <div className="flex items-center">
        <ThemeSwitcher />
        <ConnectWallet user={user} />
      </div>
    </div>
  )
}

export default NavBar
