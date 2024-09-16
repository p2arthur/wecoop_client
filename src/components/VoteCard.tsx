import { minidenticon } from 'minidenticons'
import { Fragment } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { MdTravelExplore } from 'react-icons/md'
import { usableAssetsList } from '../data/usableAssetsList'
import { useGetUserInfo } from '../services/api/Users'
import { PostRequest, ReplyResponse } from '../services/api/types'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { ShareButton } from './ShareButton'

interface VoteCardPropsInterface {
  vote: PostRequest | ReplyResponse
}

const VoteCard = ({ vote }: VoteCardPropsInterface) => {
  console.log(vote, 'vote')
  const { data: userData } = useGetUserInfo(vote.creator_address)

  const currentPostUsableAsset = usableAssetsList.find((usableAsset) => vote.assetId === usableAsset.assetId)

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const handleTimestamp = () => {
    const date = vote.timestamp! * 1000
    return formatDateFromTimestamp(date)
  }

  const handleGoToPostPage = () => {
    window.location.href = `/post?id=${vote.transaction_id}`
  }

  const handleTextPost = (text: string) => {
    const decodedText = decodeURIComponent(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g

    const parts = decodedText.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Fragment key={index}>
            <a href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
              {part}
            </a>
          </Fragment>
        )
      }
      return part
    })
  }

  return (
    <>
      <div>
        {vote.status === 'accepted' ? (
          <div
            onClick={handleGoToPostPage}
            className="border-4 border-gray-900 flex flex-col gap-3 p-4 hover:bg-gray-100 h-content  transition-all duration-75 cursor-pointer dark:border-white bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden border-b-4">
                  <img className="w-full bg-cover" src={userData?.nfd?.avatar || generateIdIcon(vote.creator_address!)} alt="" />
                </div>
                <a href={`/profile/${vote.creator_address}`}>
                  <h2 className="font-bold text-lg md:text-xl h-full underline hover:text-blue-500">
                    {userData?.nfd?.name ? userData?.nfd?.name.toUpperCase() : ellipseAddress(vote.creator_address)} {<img />}
                  </h2>
                </a>
              </div>
              <h2 className={'font-bold text-2xl'}>Vote</h2>
              <div className="md:flex flex-col md:flex-row md:gap-2 hidden">
                {vote.country ? (
                  <div className="flex gap-0 flex-col items-center justify-center">
                    <div className="w-6 rounded-full overflow-hidden">
                      <img className="w-full h-full" src={`https://flagsapi.com/${vote.country}/flat/64.png`} alt="" />
                    </div>
                    <p className="w-full text-center">{vote.country}</p>
                  </div>
                ) : null}
                <p>{handleTimestamp()}</p>
              </div>
            </div>

            <div className="gap-2 w-full" onClick={(e) => e.stopPropagation()}>
              <p className="tracking-wide break-words w-full">{vote?.text?.length > 0 && handleTextPost(vote.text)}</p>
              <div className={'flex w-full items-center gap-1 text-md justify-between md:justify-end'}>
                <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
                  <img className="h-8 w-8" src={currentPostUsableAsset?.image} alt={`${vote?.assetId}-icon`} />
                  <button
                    className={
                      'cursor-pointer rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center'
                    }
                  >
                    <a target="_blank" href={`https://allo.info/tx/${vote.transaction_id}`}>
                      <MdTravelExplore className="text-lg group-hover:text-gray-100 dark:group-hover:text-gray-900 hover:text-blue-500" />
                    </a>
                  </button>
                  <ShareButton id={vote.transaction_id} />
                </div>
                <div className="flex flex-col md:gap-2 md:hidden">
                  {vote.country ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 rounded-full overflow-hidden">
                        <img className="w-full h-full" src={`https://flagsapi.com/${vote.country}/flat/64.png`} alt="" />
                      </div>
                      <p className="text-center">{vote.country}</p>
                    </div>
                  ) : null}
                  <p className="text-center">{handleTimestamp()}</p>
                </div>
              </div>
            </div>
            <div className={'w-full flex items-center bg-red'}>
              <button className={''}>YES</button>
              <button>NO</button>
            </div>
          </div>
        ) : vote.status === 'loading' ? (
          <div
            key={vote.transaction_id}
            className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900">
                  <img className="w-full" src={generateIdIcon(vote.creator_address!)} alt="" />
                </div>
                <h2 className="font-bold text-xl h-full">{vote.nfd ? vote.nfd.toUpperCase() : ellipseAddress(vote.creator_address)}</h2>
              </div>
              <p className="w-full" onClick={(e) => e.stopPropagation()}>
                {handleTextPost(vote.text)}
              </p>
            </div>
            <span>
              <FaSpinner className="w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <div
            key={vote.text}
            className="border-2 opacity-40 border-red-900 flex-col p-2   hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
          >
            <h2>{vote.nfd ? vote.nfd.toUpperCase() : ellipseAddress(vote.creator_address)}</h2>
            <p className="w-full">{vote.text}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default VoteCard
