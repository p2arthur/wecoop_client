import { useQueryClient } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { minidenticon } from 'minidenticons'
import { useState } from 'react'
import { FaGlobe, FaRegMessage, FaRegThumbsUp, FaSpinner } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { Like } from '../services/Like'
import { PostProps } from '../services/Post'
import { Reply } from '../services/Reply'
import { UserInterface } from '../services/User'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getUserCountry } from '../utils/userUtils'
import { ReplyInput } from './ReplyInput'

interface PostPropsInterface {
  post: PostProps
  variant?: 'default' | 'reply'
  handleNewReply?: (newReply: PostProps, transactionCreatorId: string) => void
}

interface PostInputPropsInterface {
  algod: AlgodClient
  userData: UserInterface
}

const PostCard = ({ post, variant = 'default', handleNewReply }: PostPropsInterface) => {
  const queryClient = useQueryClient()

  const { sendTransactions, signTransactions } = useWallet()
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [isLoadingReply, setIsLoadingReply] = useState(false)
  const [replyText, setReplyText] = useState('')

  const [openReplyInput, setOpenReplyInput] = useState(false)

  const { algod, userData } = useOutletContext() as PostInputPropsInterface
  const replieservice = new Reply(algod)
  const likeService = new Like(algod)

  const generateIdIcon = (creatorAddress: string) => {
    const svgURI = `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
    return svgURI
  }

  const handlePostLike = async (event: React.FormEvent) => {
    try {
      setIsLoadingLike(true)

      const encodedGroupedTransactions = await likeService.handlePostLike({
        event,
        creatorAddress: post.creator_address,
        address: userData.address,
        transactionId: post.transaction_id as string,
      })

      const signedTransactions = await signTransactions(encodedGroupedTransactions)
      const waitRoundsToConfirm = 4

      await sendTransactions(signedTransactions, waitRoundsToConfirm)
      queryClient.refetchQueries({ queryKey: ['getAllPosts'] })

      setIsLoadingLike(false)
    } catch (error) {
      console.log(error)
    } finally {
      queryClient.refetchQueries({ queryKey: ['getAllPosts'] })
    }
  }

  const handlePostReply = async () => {
    setIsLoadingReply(true)
    const country = await getUserCountry()

    const newReply: PostProps = {
      text: encodeURIComponent(replyText),
      creator_address: userData.address,
      status: 'loading',
      timestamp: null,
      transaction_id: null,
      replies: [],
    }

    const parentReplyId = post.transaction_id as string

    handleNewReply && handleNewReply(newReply, parentReplyId)

    const encodedGroupedTransactions = await replieservice.handlePostReply({
      creatorAddress: post.creator_address,
      address: userData.address,
      transactionId: post.transaction_id as string,
      text: encodeURIComponent(replyText),
    })
    const signedTransactions = await signTransactions(encodedGroupedTransactions)
    const waitRoundsToConfirm = 4

    const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

    const acceptedReply: PostProps = {
      creator_address: userData.address,
      text: encodeURIComponent(replyText),
      status: 'accepted',
      transaction_id: id,
      likes: 0,
      country,
      nfd: userData.nfd,
      timestamp: Date.now(),
      replies: [],
    }

    handleNewReply && handleNewReply(acceptedReply, parentReplyId)

    setReplyText('')
    setIsLoadingReply(false)
    queryClient.invalidateQueries({ queryKey: ['getAllPosts'] })
  }

  return (
    <>
      <div>
        {post.status === 'accepted' ? (
          <div className="border-2 border-gray-900 border-b-4 flex flex-col gap-3 p-4 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-75 cursor-pointer min-h-[120px] post dark:hover:text-gray-100 dark:border-gray-500">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900 dark:bg-gray-100">
                  <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                </div>
                <a target="_blank" href={`/profile/${post.creator_address}`}>
                  <h2 className="font-bold text-xl h-full hover:underline">
                    {post.nfd ? post.nfd.toUpperCase() : ellipseAddress(post.creator_address)}
                  </h2>
                  {}
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

            <div className="grid gap-2">
              <p className="tracking-wide break-words w-full">{post.text.length > 0 && decodeURIComponent(post.text)}</p>
              <div className={'flex justify-end items-center gap-1 text-md '}>
                {variant === 'default' && (
                  <button
                    className="rounded-lg gap-1 hover:bg-gray-900 dark:hover:bg-gray-100 p-1 group transition-all flex items-center justify-center"
                    onClick={() => setOpenReplyInput(!openReplyInput)}
                  >
                    <FaRegMessage className="text-xl group-hover:text-gray-100 dark:group-hover:text-gray-900" />
                    <p className="group-hover:text-gray-100 dark:group-hover:text-gray-900">{post.replies?.length}</p>
                  </button>
                )}

                <div className={'flex gap-1 items-center'}>
                  {isLoadingLike ? (
                    <FaSpinner className="animate-spin text-2xl" />
                  ) : (
                    <>
                      <button
                        className="rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center"
                        onClick={handlePostLike}
                      >
                        <FaRegThumbsUp className="text-xl group-hover:text-gray-100 dark:group-hover:text-gray-900" />
                        {<p className="group-hover:text-gray-100 dark:group-hover:text-gray-900">{post.likes}</p>}
                      </button>
                    </>
                  )}
                </div>
                <a target="_blank" className={'cursor-pointer'} href={`https://algoexplorer.io/tx/${post.transaction_id}`}>
                  <FaGlobe className="text-xl group-hover:text-gray-100 dark:group-hover:text-gray-900" />
                </a>
              </div>
              {openReplyInput && (
                <div className={'grid gap-4'}>
                  <p className={'text-lg'}>replies</p>

                  {post.replies && post.replies.length > 0 && post.replies.map((reply) => <PostCard post={reply} variant={'reply'} />)}

                  {!isLoadingReply && (
                    <ReplyInput
                      handleChange={(e) => setReplyText(e.target.value)}
                      placeholder={'Reply message...'}
                      value={replyText}
                      handleSubmit={handlePostReply}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
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
              <p className="w-full">{decodeURIComponent(post.text)}</p>
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
