import { useState } from 'react'
import ReactPlayer from 'react-player'
import useDarkMode from '../../utils/getThemeMode'

interface FileWithLoadingProps {
  cid: string
  format: string
}

const FileWithLoading: React.FC<FileWithLoadingProps> = ({ cid, format }) => {
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
      {format.includes("video") && (
        <ReactPlayer
          style={{ opacity: isLoading ? 0 : 1 }}
          url={`https://ipfs.algonode.xyz/ipfs/${cid}`}
          controls
          onReady={handleImageLoad}
          width={"100%"}
          height={"auto"}
        />
      )}
      {(format.includes("image") || format === "png") && (
        <img
          className={`w-full h-auto rounded-2xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500`}
          src={`https://ipfs.algonode.xyz/ipfs/${cid}`}
          onLoad={handleImageLoad}
          alt="IPFS content"
        />
      )
      }
    </div>
  )
}

export default FileWithLoading
