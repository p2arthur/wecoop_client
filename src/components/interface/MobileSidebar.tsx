import { useEffect } from 'react'
import { RiCloseFill } from 'react-icons/ri'
import { useMobileSidebar } from '../../context/Interface/MobileSidebar'
import useDarkMode from '../../utils/getThemeMode'
import ThemeSwitcher from '../ThemeSwitcher'
import { MenuFeed } from '../templates/MenuFeed'
import { usePosts } from '../../context/Posts/Posts'
import { useWallet } from '@txnlab/use-wallet'
import { useSearchParams } from 'react-router-dom'

export default function MobileSidebar() {
  const { isOpen, closeSidebar } = useMobileSidebar()
  const { activeFeed, activeAssetId, handleFilterByAssetId, handleChangeFeed } = usePosts()
  const { activeAccount } = useWallet()
  const [params, setParams] = useSearchParams()
  const { isDarkMode } = useDarkMode()

  // Função para atualizar a URL com base no activeFeed e activeAssetId
  const updateUrlParams = (newFeed, newAssetId) => {
    const searchParams = new URLSearchParams()

    if (newFeed) {
      searchParams.set('activeFeed', newFeed)
    }

    if (newAssetId) {
      searchParams.set('activeAssetId', newAssetId)
    }

    // Atualiza os parâmetros de URL e navega
    setParams(searchParams)
  }

  // Atualizar a handleChangeFeed para mudar a URL
  const handleFeedChange = (newFeed) => {
    updateUrlParams(newFeed, activeAssetId)
    handleChangeFeed(newFeed)
  }

  // Atualizar handleFilterByAssetId para mudar a URL
  const handleAssetIdChange = (newAssetId) => {
    updateUrlParams(activeFeed, newAssetId)
    handleFilterByAssetId(newAssetId)
  }

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
          <MenuFeed
            openByParams={params.get('activeFeed') === 'coinFeed' && params.get('activeAssetId') !== null}
            hasFeedPosts={activeAccount !== null}
            activeFeed={activeFeed}
            handleChangeFeed={handleFeedChange}
            handleChangeAssetId={handleAssetIdChange}
            activeAssetId={activeAssetId}
          />
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
