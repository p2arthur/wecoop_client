import ProgressBar from '@ramonak/react-progress-bar'
import { minidenticon } from 'minidenticons'
import { Fragment, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { FaCheckCircle, FaParachuteBox } from 'react-icons/fa'
import { usableAssetsList } from '../data/usableAssetsList'
import { PollRequest } from '../services/api/types'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'

interface PollCardPropsInterface {
  poll: PollRequest
  onRenderComplete?: () => void // Add this prop
}

export const PollCardTweet = ({ poll, onRenderComplete }: PollCardPropsInterface) => {
  const [pollPrize, setPollPrize] = useState(0)
  const [currentVotes, setCurrentVotes] = useState({ yesVotes: poll.yesVotes, totalVotes: poll.totalVotes })

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const handleTimestamp = (timestamp: number) => {
    if (!timestamp) return
    const date = timestamp * 1000
    return formatDateFromTimestamp(date)
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

  // Call onRenderComplete after rendering
  useEffect(() => {
    if (onRenderComplete) {
      onRenderComplete()
    }

    // Calculate poll prize
    const asset = usableAssetsList.find((asset) => asset.assetId === poll.assetId)
    if (asset) {
      const prize = poll.depositedAmount / 10 ** asset.decimals
      setPollPrize(prize)
    }
  }, [onRenderComplete, poll])

  return (
    <div id={`vote-card-${poll.pollId}`} className="relative border-4 border-yellow-400 flex flex-col p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden">
            <img className="w-full bg-cover" src={generateIdIcon(poll.creator_address)} alt="" />
          </div>
          <a href={`/profile/${poll.creator_address}`}>
            <h2 className="font-bold text-lg md:text-xl underline hover:text-blue-500">{ellipseAddress(poll.creator_address)}</h2>
          </a>
        </div>
        <div className="md:flex flex-col md:flex-row md:gap-2 hidden gap-4">
          {poll.country ? (
            <div className="flex gap-0 flex-col items-center justify-center">
              <div className="w-6 rounded-full overflow-hidden">
                <img className="w-full h-full" src={`https://flagsapi.com/${poll.country}/flat/64.png`} alt="" />
              </div>
              <p className="w-full text-center">{poll.country}</p>
            </div>
          ) : null}
          {poll.timestamp ? <p>{handleTimestamp(poll.timestamp)}</p> : null}
        </div>
      </div>

      <div className="flex flex-col justify-between w-full flex-grow min-h-full">
        <div className="flex flex-col gap-1 w-full flex-grow-0 min-h-full">
          <div className="border-b-2 py-2 border-gray-300/30 flex flex-col justify-start h-full">
            <p className="tracking-wide break-words w-full font-bold h-24">{poll?.text?.length > 0 && handleTextPost(poll.text)}</p>
          </div>
          <div className="flex w-full select-none">
            <h2 className="font-bold md:text-xl w-full flex gap-2 items-center">
              <span>Prize pool: </span>
              <CountUp end={Number(pollPrize)} duration={2} />
              <div className="rounded-full overflow-hidden animate-bounce w-8 h-8">
                <img className="h-full w-full" src={usableAssetsList.filter((asset) => asset.assetId === poll.assetId)[0]?.image} alt="" />
              </div>
            </h2>
            <h4>Expires: {handleTimestamp(poll.expiry_timestamp)}</h4>
          </div>
          <ProgressBar
            className={'w-full '}
            height={'30px'}
            bgColor={'rgb(22 163 74)'}
            animateOnRender={true}
            baseBgColor={'rgb(220 38 38)'}
            borderRadius={'10px'}
            completed={currentVotes.totalVotes > 0 ? (currentVotes.yesVotes / currentVotes.totalVotes) * 100 : 0}
          />
          <div className="flex items-center justify-between">
            <span className="flex items-center ">Yes {currentVotes.yesVotes}</span>
            <span className="flex items-center">No {currentVotes.totalVotes - currentVotes.yesVotes}</span>
          </div>
          <div className="pt-4 border-t-2 border-gray-300/30 flex justify-end">
            <div className="flex gap-2 items-end">
              <div className="flex justify-end w-full">
                <h3 className="flex gap-2 bg-white p-1 text-black rounded-md">
                  <FaCheckCircle className="text-2xl text-green-500" />
                  <p>Claimed</p>
                </h3>
              </div>
            </div>
            <div className="flex text-white items-end gap-8 justify-between w-full">
              <div className="relative">
                <div className=" rounded-md absolute border-2 w-full h-full animate-ping pointer-events-none"></div>
                <h2 className="bg-white font-bold p-1 text-black rounded-md flex gap-2 items-center">
                  <FaParachuteBox className="text-green-500" />
                  <p>Claim now</p>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
