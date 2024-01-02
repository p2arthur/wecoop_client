import { User as UserInterface } from '../services/api/types'
import ConnectWallet from './ConnectWallet'
import ThemeSwitcher from './ThemeSwitcher'

interface NavBarProps {
  user: UserInterface
}

const NavBar = ({ user }: NavBarProps) => {
  return (
    <div className="px-5 py-0 fixed z-50 bg-gray-100 dark:bg-gray-950 w-screen border-b-4 border-gray-900 flex justify-between items-center h-14">
      <a className="flex gap-2 items-center" href="/">
        <img className="w-4 md:w-5" src="/images/WeCoop_logo_mascot.svg" alt="wecoop_mascot" />
        <p className="font-bold text-xl md:text-2xl">WeCOOP</p>
      </a>
      <div className="flex items-center gap-2">
        <ThemeSwitcher />
        <ConnectWallet user={user} />
      </div>
    </div>
  )
}

export default NavBar
