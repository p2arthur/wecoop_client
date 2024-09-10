import { useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { useMobileSidebar } from '../../context/Interface/MobileSidebar'
import useDarkMode from '../../utils/getThemeMode'
import ThemeSwitcher from '../ThemeSwitcher'
import { MenuFeed } from '../templates/MenuFeed'
import { usePosts } from '../../context/Posts/Posts'
import { useWallet } from '@txnlab/use-wallet'

export default function MobileSidebar() {
  const { isOpen, closeSidebar } = useMobileSidebar()
  const { handleChangeFeed, activeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const { isDarkMode } = useDarkMode()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  return (
    <div className={`w-screen h-screen bg-black/50 fixed z-50 justify-end overflow-hidden ${isOpen ? 'flex' : 'hidden'}`}>
      <nav className="w-80 p-2 h-screen bg-white dark:bg-gray-900 border-l-4 border-black flex flex-col gap-5 justify-between">
        <div className="h-12 items-center justify-between flex">
          <a className="flex gap-2 items-center" href="/">
            <img
              className="w-4 md:w-5 "
              src={`${!isDarkMode ? '/images/WeCoop_logo_mascot.svg' : '/images/WeCoop_logo_mascot_white.svg'}`}
              alt="wecoop_mascot"
            />
            <p className="font-bold text-xl md:text-2xl">WeCOOP</p>
          </a>
          <div onClick={closeSidebar}>
            <RiCloseFill className="text-3xl" />
          </div>
        </div>

        <ul className="h-full">
          <h1>Feed</h1>
          <MenuFeed hasFeedPosts={activeAccount !== null} activeFeed={activeFeed || 'global'} handleChangeFeed={handleChangeFeed} />
        </ul>

        <div className="flex gap-2">
          <ThemeSwitcher />
          <a href="/about">
            <p className="font-bold text-mdk underline">About us</p>
          </a>
        </div>
      </nav>
    </div>
  )
}
