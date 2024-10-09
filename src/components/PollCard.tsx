import ProgressBar from '@ramonak/react-progress-bar'
import { useWallet } from '@txnlab/use-wallet'
import { minidenticon } from 'minidenticons'
import { Fragment, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { FaSpinner } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { createAppClient, makeVote, withdrawPollShare } from '../contracts/app-calls/wecoopDaoMethods'
import { WecoopDaoClient } from '../contracts/clients/WecoopDaoClient'
import { PollRequest } from '../services/api/types'
import { useGetUserInfo } from '../services/api/Users'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { PostInputOutletContext } from './PostInput'

interface PollCardPropsInterface {
  poll: PollRequest
}

const VoteCard = ({ poll }: PollCardPropsInterface) => {
  const { algod } = useOutletContext() as PostInputOutletContext
  const { activeAccount, signer } = useWallet()
  const { data: userData } = useGetUserInfo(poll.creator_address)

  const [currentVotes, setCurrentVotes] = useState({ yesVotes: poll.yesVotes, totalVotes: poll.totalVotes })

  let appClient: WecoopDaoClient

  const [isVoted, setIsVoted] = useState(false)

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const handleTimestamp = (timestamp: number) => {
    if (!timestamp) return
    const date = timestamp! * 1000
    return formatDateFromTimestamp(date)
  }

  const handleVoteClick = async (inFavor: boolean, pollId: number) => {
    if (!activeAccount) return

    try {
      const wecoopDaoAppId = Number(import.meta.env.VITE_WECOOP_POLL_APP_ID)
      const daoAssetId = 721969155
      const daoAssetAmount = 1
      console.log(activeAccount, signer, algod)
      appClient = createAppClient(activeAccount?.address, signer, algod)

      const result = await makeVote(appClient, algod, pollId, activeAccount.address, signer, daoAssetId, inFavor)

      if (inFavor) {
        setCurrentVotes({ totalVotes: currentVotes.totalVotes + 1, yesVotes: currentVotes.yesVotes + 1 })
      } else {
        setCurrentVotes({ ...currentVotes, totalVotes: currentVotes.totalVotes + 1 })
      }

      setIsVoted(true)

      console.log('vote made successfully', result)
    } catch (error) {
      console.error('error voting', error)
    }
  }

  const checkClaimed = (address: string) => {
    const currentUserVoted = poll?.voters?.find((voter) => voter.voterAddress == address)?.claimed

    return currentUserVoted || false
  }

  const handleClaimPoolShare = async () => {
    const { pollId } = poll

    if (!activeAccount) return
    appClient = createAppClient(activeAccount.address, signer, algod)

    const isClaimed = checkClaimed(activeAccount?.address!)

    if (isClaimed) return

    const result = await withdrawPollShare(appClient, pollId, activeAccount?.address!, signer)

    console.log('claim result', result)
  }

  const checkIsCreator = (address: string) => {
    const currentPollCreator = poll.creator_address
    return currentPollCreator === address
  }

  const checkVoted = (address: string) => {
    const currentVote = poll.voters.find((vote) => vote.voterAddress === address)

    console.log('current vote', currentVote)

    if (!currentVote?.voterAddress) {
      console.log('this is false')

      return false
    } else {
      return true
    }
  }

  const checkIsExpired = () => {}

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

  useEffect(() => {
    const alreadyVoted = poll?.voters?.filter((voter) => voter.voterAddress == activeAccount?.address).length == 0 ? false : true
    if (alreadyVoted) {
      setIsVoted(true)
    }
  }, [activeAccount])

  return (
    <>
      <div>
        {poll.status === 'accepted' ? (
          <div
            // onClick={handleGoToPostPage}
            className="border-4 border-yellow-400 flex flex-col gap-3 p-4 hover:bg-gray-100 h-content  transition-all duration-75 cursor-pointer dark:border-yellow-700 bg-white dark:bg-gray-900"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <p></p>
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden border-b-4">
                  <img className="w-full bg-cover" src={userData?.nfd?.avatar || generateIdIcon(poll.creator_address!)} alt="" />
                </div>
                <a href={`/profile/${poll.creator_address}`}>
                  <h2 className="font-bold text-lg md:text-xl h-full underline hover:text-blue-500">
                    {userData?.nfd.name ? userData?.nfd?.name.toUpperCase() : ellipseAddress(poll.creator_address)} {<img />}
                  </h2>
                </a>
              </div>
              <div className="md:flex flex-col md:flex-row md:gap-2 hidden">
                {poll.country ? (
                  <div className="flex gap-0 flex-col items-center justify-center">
                    <div className="w-6 rounded-full overflow-hidden">
                      <img className="w-full h-full" src={`https://flagsapi.com/${poll.country}/flat/64.png`} alt="" />
                    </div>
                    <p className="w-full text-center">{poll.country}</p>
                  </div>
                ) : null}
                {poll.timestamp ? <p>{handleTimestamp(poll?.timestamp!)}</p> : null}
              </div>
            </div>

            <div className="gap-2 flex flex-col justify-between w-full items-end" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-1 w-full">
                <div className="border-b-2 py-2 border-gray-300/30">
                  <p className="tracking-wide break-words w-full ">{poll?.text?.length > 0 && handleTextPost(poll.text)}</p>
                </div>
                <div className="flex w-full">
                  <h2 className={'font-bold md:text-xl w-full flex gap-2 items-center border-top'}>
                    <span>Vote - Prize pool: </span>
                    <CountUp end={Number(poll.depositedAmount?.toFixed(0))} duration={2} />{' '}
                    <div className="rounded-full overflow-hidden animate-bounce w-8 h-8">
                      <img
                        className="h-full w-full"
                        src="https://algorand-wallet-mainnet.b-cdn.net/media/asset_verification_requests_logo_png/2023/12/27/9e4d1ca7fc5a408b87b2f47b50e4749b.png?width=200&quality=70"
                        alt=""
                      />
                    </div>
                  </h2>
                  <h4>expires: {handleTimestamp(poll.expiry_timestamp)}</h4>
                </div>
                {isVoted ||
                (activeAccount?.address && checkIsCreator(activeAccount?.address)) ||
                poll.expiry_timestamp! * 1000 < Date.now() ? (
                  <div className={'w-full relative flex flex-col gap-3'}>
                    <ProgressBar
                      className={'w-full '}
                      height={'30px'}
                      bgColor={'rgb(22 163 74)'}
                      animateOnRender={true}
                      baseBgColor={'rgb(220 38 38)'}
                      borderRadius={'10px'}
                      completed={currentVotes.totalVotes > 0 ? (currentVotes.yesVotes / currentVotes.totalVotes) * 100 : 0}
                    />
                    {
                      <div className={'flex items-center justify-between'}>
                        <span className={'flex items-center '}>Yes {currentVotes.yesVotes}</span>
                        <span className={'flex items-center'}>No {currentVotes.totalVotes - currentVotes.yesVotes}</span>
                      </div>
                    }
                    <div>
                      {checkVoted(activeAccount?.address!) && poll.expiry_timestamp * 1000 < Date.now() ? (
                        <div className="flex gap-2 items-end">
                          {checkClaimed(activeAccount?.address!) ? (
                            <button>Claimed</button>
                          ) : (
                            <div className="flex text-white gap-2 items-center">
                              <button onClick={handleClaimPoolShare} className="p-1 border-white border-2 bg-gray-800">
                                Claim now
                              </button>
                            </div>
                          )}
                          <p>
                            {poll.depositedAmount / poll.voters.length} x asset: {poll.assetId}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  </div>
                ) : null}
                {activeAccount?.address &&
                !checkVoted(activeAccount.address) &&
                !isVoted &&
                poll.expiry_timestamp * 1000 > Date.now() &&
                !checkIsCreator(activeAccount.address) ? (
                  <div className={'w-full flex justify-left items-center gap-6'}>
                    <button
                      className={
                        'w-1/2 h-10 border-b-4 text-white border-gray-900 dark:border-white bg-green-600 dark:bg-green-600 hover:border-b-2 active:border-b active:bg-green-700 dark:active:bg-green-700 dark:hover:text-white font-bold'
                      }
                      onClick={() => handleVoteClick(true, Number(poll.pollId))}
                    >
                      YES
                    </button>
                    <button
                      className={
                        'w-1/2 h-10 border-b-4 text-white border-gray-900 dark:border-white bg-red-600 dark:bg-red-600 hover:border-b-2 active:border-b active:bg-red-700 dark:active:bg-red-700 dark:hover:text-white font-bold'
                      }
                      onClick={() => handleVoteClick(false, Number(poll.pollId))}
                    >
                      NO
                    </button>
                  </div>
                ) : null}
              </div>
              <div className={'flex w-full items-center gap-1 text-md justify-between md:justify-end'}>
                <div className="flex flex-col md:gap-2 md:hidden">
                  {poll.country ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 rounded-full overflow-hidden">
                        <img className="w-full h-full" src={`https://flagsapi.com/${poll.country}/flat/64.png`} alt="" />
                      </div>
                      <p className="text-center">{poll.country}</p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : poll.status === 'loading' ? (
          <div
            key={poll.pollId}
            className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900">
                  <img className="w-full" src={generateIdIcon(poll.creator_address!)} alt="" />
                </div>
                <h2 className="font-bold text-xl h-full">{poll.nfd ? poll.nfd.toUpperCase() : ellipseAddress(poll.creator_address)}</h2>
              </div>
              <p className="w-full" onClick={(e) => e.stopPropagation()}>
                {handleTextPost(poll.text)}
              </p>
            </div>
            <span>
              <FaSpinner className="w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <div
            key={poll.text}
            className="border-2 opacity-40 border-red-900 flex-col p-2   hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
          >
            <h2>{poll.nfd ? poll.nfd.toUpperCase() : ellipseAddress(poll.creator_address)}</h2>
            <p className="w-full">{poll.text}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default VoteCard
