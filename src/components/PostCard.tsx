import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { minidenticon } from 'minidenticons'
import { useState } from 'react'
import { FaRegThumbsUp, FaSpinner } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { PostProps } from '../services/Post'
import { Transaction } from '../services/Transaction'
import { UserInterface } from '../services/User'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getUserCountry } from '../utils/userUtils'

interface PostPropsInterface {
  post: PostProps
  getAllPosts: () => Promise<void>
}

interface PostInputPropsInterface {
  algod: AlgodClient
  userData: UserInterface
}

const PostCard = ({ post, getAllPosts }: PostPropsInterface) => {
  const { sendTransactions, signTransactions } = useWallet()
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const { algod, userData } = useOutletContext() as PostInputPropsInterface
  const transactionService = new Transaction(algod)

  const generateIdIcon = (creatorAddress: string) => {
    const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
    return svgURI
  }

  const handlePostLike = async (event: React.FormEvent) => {
    setIsLoadingLike(true)
    event.preventDefault()
    const country = await getUserCountry()
    const note = `wecoop:like:${country}:${post.transaction_id}`
    const scoopFeeTransaction = await transactionService.createTransaction(
      userData.address,
      'GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ',
      1000,
      note,
    )
    const postCreatorFee = await transactionService.createTransaction(
      userData.address,
      'GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ',
      1000,
      `creator-fee:${note}`,
    )

    const transactionsArray = [scoopFeeTransaction, postCreatorFee]
    const groupedTransactions = algosdk.assignGroupID(transactionsArray)
    const encodedGroupedTransactions = groupedTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))
    const signedTransactions = await signTransactions(encodedGroupedTransactions)
    const waitRoundsToConfirm = 4

    const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
    await getAllPosts()
    setIsLoadingLike(false)
  }

  return (
    <>
      <div>
        {post.status === 'accepted' ? (
          <a target="_blank" href={`https://testnet.algoexplorer.io/tx/${post.transaction_id}`}>
            <div className="border-2 border-gray-900 flex flex-col gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-75 cursor-pointer min-h-[120px] post dark:hover:text-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 rounded-full border-2 border-gray-900 dark:bg-gray-100">
                    <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                  </div>
                  <a target="_blank" href={`https://testnet.algoexplorer.io/address/${post.creator_address}`}>
                    <h2 className="font-bold text-xl h-full hover:underline">
                      {post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}
                    </h2>
                  </a>
                </div>
                <div className="flex flex-col md:flex-row md:gap-2">
                  {post.country ? (
                    <div className="flex gap-0 flex-col items-center justify-center">
                      <div className="w-6 rounded-full overflow-hidden">
                        <img className="w-full h-full" src={`https://flagsapi.com/${post.country}/flat/64.png`} alt="" />
                      </div>
                      <p className="w-full text-center">{post.country}</p>
                    </div>
                  ) : null}
                  <p>
                    {!formatDateFromTimestamp(post.timestamp!).time
                      ? 'Just now'
                      : `${formatDateFromTimestamp(post.timestamp!).time} ${formatDateFromTimestamp(post.timestamp!).measure} ago`}
                  </p>
                </div>
              </div>
              <p className="w-full tracking-wide">{post.text}</p>

              <div className="flex justify-end items-center gap-1 text-md">
                {isLoadingLike ? (
                  <FaSpinner className="animate-spin text-2xl" />
                ) : (
                  <>
                    <button
                      className="rounded-full hover:bg-gray-900 dark:hover:bg-gray-100 p-1 group transition-all flex items-center justify-center"
                      onClick={handlePostLike}
                    >
                      <FaRegThumbsUp className="text-xl group-hover:text-gray-100 dark:group-hover:text-gray-900" />
                    </button>
                    {post.likes && <p className="text-black dark:text-white">{post.likes}</p>}
                  </>
                )}
              </div>
            </div>
          </a>
        ) : post.status === 'loading' ? (
          <div
            key={post.text}
            className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900">
                  <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                </div>
                <h2 className="font-bold text-xl h-full">{post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}</h2>
              </div>
              <p className="w-full">{post.text}</p>
            </div>
            <span>
              <FaSpinner className="w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <div
            key={post.text}
            className="border-2 opacity-40 border-red-900 flex-col p-2   hover:bg-gray-100 transition-all duration-75 cursor-pointer hidden"
          >
            <h2>{post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}</h2>
            <p className="w-full">{post.text}</p>
          </div>
        )}
      </div>
    </>
  )
}

export default PostCard
