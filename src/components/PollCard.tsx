import ProgressBar from '@ramonak/react-progress-bar'
import { useWallet } from '@txnlab/use-wallet'
import { minidenticon } from 'minidenticons'
import { Fragment, useEffect, useState } from 'react'
import CountUp from 'react-countup'
import { FaCheckCircle, FaCircleNotch, FaExclamation, FaParachuteBox, FaThumbsUp } from 'react-icons/fa'
import { FaBoxOpen, FaClock } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { toast } from 'react-toastify'
import { createAppClient, makeVote, withdrawPollShare } from '../contracts/app-calls/wecoopDaoMethods'
import { WecoopDaoClient } from '../contracts/clients/WecoopDaoClient'
import { usableAssetsList } from '../data/usableAssetsList'
import { useClaimPoll, useCreateVote } from '../services/api/Posts'
import { PollRequest } from '../services/api/types'
import { useGetUserInfo } from '../services/api/Users'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getAssetDecimals } from '../utils/getAssetDecimals'
import { getFeePriceByAsset, InteractionMultipliers } from '../utils/interaction_pricing/getFeePriceByAsset'
import { PostInputOutletContext } from './PostInput'

interface PollCardPropsInterface {
  poll: PollRequest
  type?: 'poll' | 'feed'
}

const VoteCard = ({ poll, type }: PollCardPropsInterface) => {
  const { algod } = useOutletContext() as PostInputOutletContext
  const [pollPrize, setPollPrize] = useState(0)
  const { activeAccount, signer } = useWallet()
  const { data: userData } = useGetUserInfo(poll.creator_address)
  const { mutate: createVote } = useCreateVote()
  const { mutate: claimPoll } = useClaimPoll()
  const [isClaiming, setIsClaiming] = useState(false)

  const [currentVotes, setCurrentVotes] = useState({ yesVotes: poll.yesVotes, totalVotes: poll.totalVotes })

  let appClient: WecoopDaoClient

  const [isVoted, setIsVoted] = useState(false)
  const [isClaimed, setIsClaimed] = useState(false)

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const handleTimestamp = (timestamp: number) => {
    if (!timestamp) return
    const date = timestamp! * 1000
    return formatDateFromTimestamp(date)
  }

  const handleVoteClick = async (inFavor: boolean, pollId: number, pollCreator: string) => {
    if (!activeAccount) return

    toast('Casting your vote into the wecoop poll', {
      position: 'top-right',
      className: 'black-background',
      bodyClassName: 'grow-font-size',
      progressClassName: 'fancy-progress-bar',
    })

    try {
      const wecoopDaoAppId = Number(import.meta.env.VITE_WECOOP_POLL_APP_ID)
      const daoAssetId = poll.assetId
      const daoAssetAmount = 1

      appClient = createAppClient(activeAccount?.address, signer, algod)

      const result = await makeVote(appClient, algod, pollId, activeAccount.address, signer, daoAssetId!, inFavor, pollCreator)

      const assetId = poll.assetId

      const assetDecimals = await getAssetDecimals(algod, assetId!)

      const assetVotePrice = await getFeePriceByAsset(assetId!, assetDecimals, InteractionMultipliers.VotePoll)

      if (inFavor) {
        setCurrentVotes({ totalVotes: (currentVotes.totalVotes += 1), yesVotes: (currentVotes.yesVotes += 1) })
      } else {
        setCurrentVotes({ ...currentVotes, totalVotes: currentVotes.totalVotes + 1 })
      }
      createVote({
        pollId: pollId,
        voterAddress: activeAccount.address,
        claimed: false,
      })

      setIsVoted(true)
      toast('Your vote into the wecoop poll was accepted', {
        position: 'top-right',
        className: 'black-background',
        bodyClassName: 'grow-font-size',
        progressClassName: 'fancy-progress-bar',
      })
    } catch (error) {
      console.error('error voting', error)
    }
  }

  const checkClaimed = (address: string) => {
    const currentUserVoted = poll?.voters?.find((voter) => voter.voterAddress == address)?.claimed

    return currentUserVoted || false
  }

  const handleClaimPoolShare = async () => {
    try {
      const { pollId } = poll

      setIsClaiming(true)
      toast('Claiming participation on wecoop pools prize', {
        position: 'top-right',
        className: 'black-background',
        bodyClassName: 'grow-font-size',
        progressClassName: 'fancy-progress-bar',
      })

      if (!activeAccount) return
      appClient = createAppClient(activeAccount.address, signer, algod)

      const isClaimed = checkClaimed(activeAccount.address!)

      if (isClaimed) return

      await withdrawPollShare(appClient, pollId, activeAccount.address!, signer)

      // claimPoll({ pollId, voterAddress: activeAccount.address! })
      toast('Claimed your participation prize successfully!', {
        position: 'top-right',
        className: 'black-background',
        bodyClassName: 'grow-font-size',
        progressClassName: 'fancy-progress-bar',
      })

      setIsClaiming(false)
      setIsClaimed(true)
    } catch (error) {
      setIsClaiming(false)
      toast('Failed to claim poll, if you think that is a mistake, please contact us', {
        position: 'top-right',
        className: 'black-background',
        bodyClassName: 'grow-font-size',
        progressClassName: 'fancy-progress-bar',
      })
    }
  }

  const checkIsCreator = (address: string) => {
    const currentPollCreator = poll.creator_address
    return currentPollCreator === address
  }

  const checkVoted = (address: string) => {
    const currentVote = poll.voters?.find((vote) => vote.voterAddress === address)

    if (!currentVote?.voterAddress) {
      return false
    } else {
      return true
    }
  }

  const appendPrizePoll = async () => {
    const assetDecimals = await getAssetDecimals(algod, poll.assetId!)

    setPollPrize(poll.depositedAmount / 10 ** assetDecimals)
  }

  useEffect(() => {
    appendPrizePoll()
  }, [])

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
      <div className="bg-red-300 h-full" id={`vote-card-${poll.pollId}`}>
        {poll.status === 'accepted' || poll.status === 'loading' ? (
          <div
            className={` ${poll.status === 'loading' ? 'animate-pulse opacity-70' : null} ${
              type === 'poll' ? 'min-h-[350px]' : ''
            }  relative border-4 border-yellow-400 h-full gap-2 flex flex-col p-4 hover:bg-gray-100 h-content transition-all duration-75 cursor-pointer dark:border-yellow-700 bg-white dark:bg-gray-900`}
          >
            {/* Overlay Loading Spinner if still loading */}
            <div className="flex justify-end py-1 items-center h-8 gap-4">
              {poll.expiry_timestamp! * 1000 > Date.now() ? (
                <div className="flex items-center gap-2 relative group">
                  <div className="absolute top-1/3 translate-y-1/2 -left-1/2 bg-gray-100 border-2 px-2 border-black w-32 hidden group-hover:block">
                    {' '}
                    <h4>expires: {handleTimestamp(poll.expiry_timestamp)}</h4>
                  </div>
                  <div className="font-bold flex gap-1 items-center text-white bg-green-600 border-b-2 border-black dark:border-white p-1 rounded-md">
                    <p className="font-bold">Live</p>
                    <FaBoxOpen />
                  </div>
                </div>
              ) : (
                <div className="font-bold text-white bg-yellow-500 border-b-2 border-black dark:border-white p-1 rounded-md flex items-center gap-1">
                  <p>Expired</p>
                  <FaClock />
                </div>
              )}
              {checkVoted(activeAccount?.address!) ? (
                <div className="font-bold text-white bg-green-600 border-b-2 border-black dark:border-white p-1 rounded-md flex gap-1">
                  <p>Voted</p>
                  <FaThumbsUp />
                </div>
              ) : (
                <div className="font-bold text-white bg-red-500 border-b-2 border-black dark:border-white p-1 rounded-md flex items-center gap-1">
                  <p>Not voted</p>
                  <FaExclamation />
                </div>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden border-b-4">
                  <img className="w-full bg-cover" src={userData?.nfd?.avatar || generateIdIcon(poll.creator_address!)} alt="" />
                </div>
                <a href={`/profile/${poll.creator_address}`}>
                  <h2 className="font-bold text-lg md:text-xl h-full underline hover:text-blue-500">
                    {userData?.nfd.name ? userData?.nfd?.name.replace('.algo', '').toUpperCase() : ellipseAddress(poll.creator_address)}{' '}
                    {<img />}
                  </h2>
                </a>
              </div>
              <div className="md:flex flex-col md:flex-row md:loagap-2 hidden gap-4">
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

            <div className="flex flex-col justify-between w-full flex-grow" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col justify-between w-full flex-grow-0 gap-2 min-h-full">
                <div className="border-b-2 py-2 border-gray-300/30 h-full flex flex-col justify-start">
                  <p className="tracking-wide break-words w-full font-bold">{poll?.text?.length > 0 && handleTextPost(poll.text)}</p>
                </div>
                <div className="h-full flex flex-col justify-end">
                  <div className="flex w-full select-none">
                    <h2 className={'font-bold md:text-xl w-full flex gap-2 items-center border-top'}>
                      <span>Prize pool: </span>
                      <CountUp end={Number(pollPrize)} duration={2} />{' '}
                      <div className="rounded-full overflow-hidden animate-bounce w-8 h-8">
                        <img
                          className="h-full w-full"
                          src={usableAssetsList.filter((asset) => asset.assetId == poll.assetId)[0]?.image}
                          alt=""
                        />
                      </div>
                    </h2>
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
                        completed={currentVotes.totalVotes > 0 ? ((currentVotes.yesVotes / currentVotes.totalVotes) * 100).toFixed(2) : 0}
                      />
                      <div className={'flex items-center justify-between'}>
                        <span className={'flex items-center '}>Yes {currentVotes.yesVotes}</span>
                        <span className={'flex items-center'}>No {currentVotes.totalVotes - currentVotes.yesVotes}</span>
                      </div>
                      <div className="pt-4 border-t-2 border-gray-300/30">
                        {checkVoted(activeAccount?.address!) && poll.expiry_timestamp * 1000 < Date.now() ? (
                          <div className="flex gap-2 items-end">
                            {checkClaimed(activeAccount?.address!) || isClaimed ? (
                              <div className="flex justify-end w-full">
                                <h3 className="flex gap-2 bg-white p-1 text-black rounded-md">
                                  <FaCheckCircle className="text-2xl text-green-500" />
                                  <p>Claimed</p>
                                </h3>
                              </div>
                            ) : (
                              <div className="flex dark:text-white items-end gap-8 justify-between w-full">
                                <p className="underline flex items-end gap-2 text-xl">
                                  {(poll.depositedAmount / poll.voters.length).toFixed(2)} x{' '}
                                  {usableAssetsList.filter((asset) => asset.assetId == poll.assetId)[0]?.name}
                                  <div className="rounded-full overflow-hidden w-8 h-8">
                                    <img
                                      className="h-full w-full"
                                      src={usableAssetsList.filter((asset) => asset.assetId == poll.assetId)[0]?.image}
                                      alt=""
                                    />
                                  </div>
                                </p>{' '}
                                <div className="relative">
                                  <div className=" rounded-md absolute border-2 w-full h-full animate-ping pointer-events-none"></div>
                                  <h2
                                    onClick={handleClaimPoolShare}
                                    className="bg-white font-bold p-1 text-black rounded-md flex gap-2 items-center text-xl"
                                  >
                                    {isClaiming ? (
                                      <div className="bg-white font-bold p-1 text-black rounded-md flex gap-2 items-center text-xl opacity-50">
                                        <FaCircleNotch className="animate-spin" />
                                        <p>Claiming</p>
                                      </div>
                                    ) : (
                                      <div
                                        onClick={handleClaimPoolShare}
                                        className="bg-white font-bold p-1 text-black rounded-md flex gap-2 items-center"
                                      >
                                        <FaParachuteBox className="text-green-500" />
                                        <p className="">Claim now</p>
                                      </div>
                                    )}
                                  </h2>
                                </div>
                              </div>
                            )}
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
                        onClick={() => handleVoteClick(true, Number(poll.pollId), poll.creator_address)}
                      >
                        YES
                      </button>
                      <button
                        className={
                          'w-1/2 h-10 border-b-4 text-white border-gray-900 dark:border-white bg-red-600 dark:bg-red-600 hover:border-b-2 active:border-b active:bg-red-700 dark:active:bg-red-700 dark:hover:text-white font-bold'
                        }
                        onClick={() => handleVoteClick(false, Number(poll.pollId), poll.creator_address)}
                      >
                        NO
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            key={poll.text}
            className="border-2 opacity-40 border-red-900 flex-col p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
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
