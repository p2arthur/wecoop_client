import { useState } from 'react'
import useDarkMode from '../../utils/getThemeMode'

interface ImageWithLoadingProps {
  cid: string
}

const ImageWithLoading: React.FC<ImageWithLoadingProps> = ({ cid }) => {
  const { isDarkMode } = useDarkMode()
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className="relative w-[400px] h-auto rounded-2xl">
      {isLoading && (
        <div className="inset-0 items-center justify-center flex">
          <img src={!isDarkMode ? '/images/wecoop_loading.gif' : '/images/wecoop_loading_white.gif'} alt={'gif loading'} />
          <p>Loading on ipfs...</p>
        </div>
      )}
      <img
        className={`w-full h-auto rounded-2xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
        src={`https://ipfs.algonode.xyz/ipfs/${cid}`}
        onLoad={handleImageLoad}
        alt="IPFS content"
      />
    </div>
  )
}

export default ImageWithLoading
