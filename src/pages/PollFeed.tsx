import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import LoaderSpinner from '../components/LoaderSpinner'
import VoteCard from '../components/PollCard'
import PostInput, { PostInputOutletContext } from '../components/PostInput'
import { useGetAllPolls, useGetPollsByVoterAddress } from '../services/api/Posts'
import { getAssetDecimals } from '../utils/getAssetDecimals'
import axios from 'axios'
import { useOutletContext, useSearchParams } from 'react-router-dom'

export const PollFeed = () => {
  const { algod, userData: user } = useOutletContext() as PostInputOutletContext
  const { data: pollList, isLoading } = useGetAllPolls()
  const { activeAccount } = useWallet()
  const [searchParams, setSearchParams] = useSearchParams()

  // Defina o estado inicial `activeTab` com base na URL
  const initialTab = (searchParams.get('activeTab') as 'personal' | 'polls' | 'prizes') || 'polls'
  const [activeTab, setActiveTab] = useState<'personal' | 'polls' | 'prizes'>(initialTab)
  const [totalPrizeToClaim, setTotalPrizeToClaim] = useState<number>(0)

  const { data: personalPolls, isLoading: isLoadingPolls } = useGetPollsByVoterAddress(
    activeAccount?.address || '',
    !!(activeAccount && activeAccount?.address && activeAccount?.address.length > 0),
  )

  const pollsToClaim = personalPolls?.filter(
    (poll) =>
      new Date(poll.expiry_timestamp * 1000) < new Date() &&
      poll.voters.some((voter) => voter.voterAddress === activeAccount?.address && !voter.claimed),
  )

  const calculateTotalPriceToClaim = async () => {
    let totalPrizes = 0
    if (pollsToClaim) {
      for (const poll of pollsToClaim) {
        const assetDecimals = await getAssetDecimals(algod, poll.assetId!)
        const calculatedPollPrize = poll.depositedAmount / 10 ** assetDecimals
        const { data } = await axios.get(`https://free-api.vestige.fi/asset/${poll.assetId}/price`)
        const pollAmountPrize = calculatedPollPrize * data.USD
        totalPrizes += pollAmountPrize / poll.voters.length
      }
    }
    return totalPrizes
  }

  useEffect(() => {
    const fetchTotalPrize = async () => {
      if (pollsToClaim) {
        const total = await calculateTotalPriceToClaim()
        setTotalPrizeToClaim(total)
      }
    }

    fetchTotalPrize()
  }, [personalPolls])

  useEffect(() => {
    setSearchParams({ activeTab })
  }, [activeTab, setSearchParams])

  if (isLoading || isLoadingPolls)
    return (
      <div className={'flex h-full w-full items-center justify-center pt-[10%]'}>
        <LoaderSpinner text={'Loading feed...'} />
      </div>
    )

  return (
    <div className="flex pt-14 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full">
      <div className="p-2 overflow-y-scroll md:overflow-y-scroll border-2 max-w-full w-full border-gray-950 dark:border-gray-800 flex flex-col h-screen">
        <div className=" bg-gray mb-8">
          <PostInput postTypeProp={'poll'} />
        </div>
        <div className="flex items-center justify-around gap-10 border-2 border-b-0 dark:border-gray-800  border-gray-950 bg-gray-100 dark:bg-gray-900 p-2 w-full md:w-1/2 ">
          <div className="flex justify-center">
            <p
              onClick={() => {
                setActiveTab('polls')
              }}
              className={`font-bold text-xl cursor-pointer  ${
                activeTab === 'polls' ? 'border-b-2 border-gray-900 dark:border-gray-300' : 'border-b-2 border-transparent hover:scale-105'
              }`}
            >
              Polls Feed {pollList?.data.length || 0}
            </p>
          </div>
          <div className="flex justify-center">
            <p
              onClick={() => {
                setActiveTab('personal')
              }}
              className={`font-bold text-xl cursor-pointer hover:scale-105 ${
                activeTab === 'personal' ? 'border-b-2 border-gray-900 dark:border-gray-600' : 'border-b-2 border-transparent'
              }`}
            >
              Your Votes 🗳️ {personalPolls?.length || 0}
            </p>
          </div>
          <div className="flex justify-center">
            <p
              onClick={() => {
                setActiveTab('prizes')
              }}
              className={`font-bold text-xl cursor-pointer hover:scale-105 ${
                activeTab === 'prizes' ? 'border-b-2 border-gray-900 dark:border-gray-600' : 'border-b-2 border-transparent'
              }`}
            >
              Prizes to claim 🤑 ${totalPrizeToClaim.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="p-2 border-2 border-gray-950 dark:border-gray-800 dark:bg-gray-900 mb-24">
          {activeTab === 'personal' && personalPolls && (
            <div className="grid grid-cols-1 h-full lg:grid-cols-2 xl:grid-cols-3 items-center gap-4 w-full h-full no-scrollbar overflow-x-hidden p-2">
              {personalPolls
                .sort((a, b) => b?.timestamp! - a?.timestamp!)
                .map((poll) => (
                  <VoteCard poll={poll} type={'poll'} />
                ))}
            </div>
          )}

          {activeTab === 'polls' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-4 w-full h-full no-scrollbar overflow-x-hidden p-2">
              {pollList?.data.map((poll) => <VoteCard poll={poll} type={'poll'} />)}
            </div>
          )}

          {activeTab === 'prizes' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 items-center gap-4 w-full h-full no-scrollbar overflow-x-hidden p-2">
              {pollsToClaim?.map((poll) => <VoteCard poll={poll} type={'poll'} />)}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
