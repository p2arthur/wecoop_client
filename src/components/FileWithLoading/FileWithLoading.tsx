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
    <div>
      {isLoading && (
        <div className="inset-0 items-center justify-center flex">
          <img src={!isDarkMode ? '/images/wecoop_loading.gif' : '/images/wecoop_loading_white.gif'} alt={'gif loading'} />
          <p>Loading on ipfs...</p>
        </div>
      )}
      {format.includes("video") && (
        <div className="relative w-[400px] h-auto rounded-2xl">
          <ReactPlayer
            style={{ opacity: isLoading ? 0 : 1 }}
            url={`https://ipfs.algonode.xyz/ipfs/${cid}`}
            controls
            onReady={handleImageLoad}
            width={"100%"}
            height={"auto"}
          />
        </div>
      )}
      {(format.includes("image") || format === "png") && (
        <img
          className={`relative w-[400px] h-auto rounded-2xl ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-500 `}
          src={`https://ipfs.algonode.xyz/ipfs/${cid}`}
          onLoad={handleImageLoad}
          alt="IPFS content"
        />
      )
      }
      {format === "application/pdf" && (
        <iframe
          className="relative rounded-2xl"
          src={`https://ipfs.algonode.xyz/ipfs/${cid}#view=FitH&toolbar=1&navpanes=0`}
          onLoad={handleImageLoad}
          width={"100%"}
          height={"200px"}
          id="pdf"
        />
      )}
      {format === "application/vnd.ms-powerpoint" && (
        <iframe
          src={`https://view.officeapps.live.com/op/embed.aspx?src=https://ipfs.algonode.xyz/ipfs/${cid}`}
          className="relative w-[400px] rounded-2xl"
          onLoad={handleImageLoad}
          width={"100%"}
          height={"500px"}
          id="ppt"
        />
      )}
    </div>
  )
}

export default FileWithLoading
