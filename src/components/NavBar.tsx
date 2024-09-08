import { MdOutlineMenu } from 'react-icons/md'
import { useMobileSidebar } from '../context/Interface/MobileSidebar'
import { User as UserInterface } from '../services/api/types'
import useDarkMode from '../utils/getThemeMode'
import ConnectWallet from './ConnectWallet'
import ThemeSwitcher from './ThemeSwitcher'

interface NavBarProps {
  user: UserInterface
}

const NavBar = ({ user }: NavBarProps) => {
  const { isOpen, openSidebar } = useMobileSidebar()
  const { isDarkMode } = useDarkMode()
  return (
    <div className="px-2 py-0 fixed z-40 bg-gray-100 dark:bg-gray-950 w-screen border-b-4 border-gray-900 flex justify-between items-center h-14">
      <a className="flex gap-2 items-center" href="/">
        <img
          className="w-4 md:w-5 "
          src={`${!isDarkMode ? '/images/WeCoop_logo_mascot.svg' : '/images/WeCoop_logo_mascot_white.svg'}`}
          alt="wecoop_mascot"
        />
        <p className="font-bold text-xl md:text-2xl">WeCOOP</p>
      </a>
      <div className="flex items-center gap-2">
        <a href="/about">
          <p className="font-bold text-md md:text-md underline hidden md:block">About us</p>
        </a>
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>
        <ConnectWallet user={user} />
        <div onClick={openSidebar}>
          <MdOutlineMenu className="text-3xl md:hidden" />
        </div>
      </div>
    </div>
  )
}

export default NavBar
