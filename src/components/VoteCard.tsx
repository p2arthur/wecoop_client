import ProgressBar from '@ramonak/react-progress-bar'
import { useWallet } from '@txnlab/use-wallet'
import { minidenticon } from 'minidenticons'
import { Fragment, useState } from 'react'
import CountUp from 'react-countup'
import { FaSpinner } from 'react-icons/fa6'
import { MdTravelExplore } from 'react-icons/md'
import { useOutletContext } from 'react-router-dom'
import { createAppClient, makeVote } from '../contracts/app-calls/wecoopDaoMethods'
import { PostRequest } from '../services/api/types'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { PostInputOutletContext } from './PostInput'
import { ShareButton } from './ShareButton'

interface VoteCardPropsInterface {
  vote: PostRequest
}

const VoteCard = ({ vote }: VoteCardPropsInterface) => {
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const { activeAccount, signer } = useWallet()

  console.log('vote card', vote)

  const [isVoted, setIsVoted] = useState(false)

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

  const handleVoteClick = async (inFavor: boolean, pollId: number) => {
    if (!activeAccount) return

    try {
      const wecoopDaoAppId = 723107049
      const daoAssetId = 721969155
      const daoAssetAmount = 1

      const appClient = createAppClient(activeAccount?.address, signer, algod, wecoopDaoAppId)

      const result = await makeVote(appClient, algod, pollId, activeAccount.address, signer, daoAssetId)

      setIsVoted(true)

      console.log('vote made successfully', result)
    } catch (error) {
      console.error('error voting', error)
    }
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
            className="border-4 border-yellow-400 flex flex-col gap-3 p-4 hover:bg-gray-100 h-content  transition-all duration-75 cursor-pointer dark:border-yellow-700 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p></p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden border-b-4">
                  <img className="w-full bg-cover" src={userData?.nfd?.avatar || generateIdIcon(vote.creator_address!)} alt="" />
                </div>
                <a href={`/profile/${vote.creator_address}`}>
                  <h2 className="font-bold text-lg md:text-xl h-full underline hover:text-blue-500">
                    {userData?.nfd?.name ? userData?.nfd?.name.toUpperCase() : ellipseAddress(vote.creator_address)} {<img />}
                  </h2>
                </a>
              </div>
              <p>{vote.transaction_id}</p>
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
            <p className="tracking-wide break-words w-full">{vote?.text?.length > 0 && handleTextPost(vote.text)}</p>

            <div className="gap-2 flex justify-between w-full items-end" onClick={(e) => e.stopPropagation()}>
              <div className={'w-1/2'}>
                <h2 className={'font-bold text-2xl mb-2'}>
                  Vote - Prize pool: $<CountUp end={vote.depositedAmount!} duration={5} />
                </h2>
                {isVoted ? (
                  <div className={'w-full relative'} onClick={() => setIsVoted(false)}>
                    <div className={'flex items-center justify-between'}>
                      <span className={'flex items-center '}>Yes (69 votes)</span>
                      <span className={'flex items-center'}>No (69 votes)</span>
                    </div>
                    <ProgressBar
                      className={'w-full '}
                      height={'30px'}
                      bgColor={'rgb(22 163 74)'}
                      animateOnRender={true}
                      baseBgColor={'rgb(220 38 38)'}
                      borderRadius={'10px'}
                      completed={50}
                    />
                  </div>
                ) : (
                  <div className={'w-full flex justify-left items-center gap-2'}>
                    <button
                      className={
                        'w-1/2 h-10 rounded-md border-2 border-gray-900 bg-green-600 dark:bg-green-600 dark:border-gray-500 dark:hover:text-white hover:text-2xl  '
                      }
                      onClick={() => handleVoteClick(true, Number(vote.transaction_id))}
                    >
                      YES
                    </button>
                    <button
                      className={
                        'w-1/2 h-10 rounded-md border-2 border-gray-900 bg-red-600  dark:bg-red-600 dark:border-gray-500 dark:hover:text-white hover:text-2xl '
                      }
                      onClick={() => setIsVoted(true)}
                    >
                      NO
                    </button>
                  </div>
                )}
              </div>
              <div className={'flex w-full items-center gap-1 text-md justify-between md:justify-end'}>
                <div className="flex gap-1 items-center" onClick={(e) => e.stopPropagation()}>
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
