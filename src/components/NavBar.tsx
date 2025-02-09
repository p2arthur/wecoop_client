import { useWallet } from '@txnlab/use-wallet'
import { MdOutlineMenu } from 'react-icons/md'
import { useMobileSidebar } from '../context/Interface/MobileSidebar'
import { User as UserInterface } from '../services/api/types'
import ConnectWallet from './ConnectWallet'
import { Notifications } from './Notifications'
import ThemeSwitcher from './ThemeSwitcher'

interface NavBarProps {
  user: UserInterface
}

const NavBar = ({ user }: NavBarProps) => {
  const { openSidebar } = useMobileSidebar()
  const { activeAccount } = useWallet()
  return (
    <div className="px-2 py-0 py fixed z-40 bg-gray-100 dark:bg-gray-950 w-screen border-b-4 border-gray-900 flex justify-between items-center h-14">
      <a className="flex gap-2 items-center" href="/feed">
        <img className="w-2/3 dark:hidden" src="/images/logoblack.png" alt="wecoop_mascot" />
        <img className="w-2/3 hidden dark:block" src="/images/logowhite.png" alt="wecoop_mascot" />
      </a>
      <div className="flex items-center gap-2 ">
        <a className='flex gap-1 bg-black text-white p-1' href="/the-trenches">
          <span className=' text-white text-lg animate-bounce'>!</span>
          <p className="font-bold text-md md:text-md underline hidden md:block">The trenches</p>

        </a>
        <a href="/about">
          <p className="font-bold text-md md:text-md underline hidden md:block">About us</p>
        </a>

        {activeAccount && (
          <div>
            <Notifications walletAddress={activeAccount.address} />
          </div>
        )}
        <div className="hidden md:block">
          <ThemeSwitcher />
        </div>

        <ConnectWallet user={user} />
        <div onClick={() => openSidebar()}>
          <MdOutlineMenu className="text-3xl md:hidden" />
        </div>
      </div>
    </div>
  )
}

export default NavBar
