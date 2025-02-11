import { useQueryClient } from '@tanstack/react-query'
import { useWallet } from '@txnlab/use-wallet'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { minidenticon } from 'minidenticons'
import { Fragment, useState } from 'react'
import { FaMagnifyingGlass, FaRegMessage, FaRegThumbsUp, FaSpinner } from 'react-icons/fa6'
import { MdTravelExplore } from 'react-icons/md'
import { useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { usePosts } from '../context/Posts/Posts'
import { Like } from '../services/Like'
import { Reply } from '../services/Reply'

import { toast } from 'react-toastify'
import { useUsableAsset } from '../context/UsableAsset/UsableAssetContext'
import { likeOnChainFilePost, replyOnChainPost } from '../contracts/app-calls/filePostMethods'
import { usableAssetsList } from '../data/usableAssetsList'
import { useCreateLike, useCreateReply } from '../services/api/Posts'
import { useGetUserInfo } from '../services/api/Users'
import { Daum, Reply as IReply, User } from '../services/api/types'
import formatDateFromTimestamp from '../utils'
import { ellipseAddress } from '../utils/ellipseAddress'
import { getUserCountry } from '../utils/userUtils'
import DecodingText from './DecodeText'
import FileWithLoading from './FileWithLoading/FileWithLoading'

import { ReplyInput } from './ReplyInput'
import { ShareButton } from './ShareButton'

interface PostPropsInterface {
  post: Daum | IReply
  variant?: 'default' | 'reply'
  handleNewReply?: (newReply: Daum, transactionCreatorId: string) => void
  imagesVisible: boolean
}

interface PostInputPropsInterface {
  algod: AlgodClient
  userData: User
}

export const handleTextPost = (text: string) => {
  if (!text) return

  let decodedText: string
  try {
    // Ensure %0A is replaced with actual newlines (\n)
    decodedText = decodeURIComponent(text).replace(/%0A/g, '\n')
  } catch (error) {
    console.error('Error decoding URI component:', error)
    // If decoding fails, return the original text or handle accordingly
    decodedText = text
  }

  const urlRegex = /(https?:\/\/[^\s]+)/g
  const parts = decodedText.split(urlRegex)

  return parts.map((part, index) => {
    if (urlRegex.test(part)) {
      return (
        <Fragment key={index}>
          <a href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-300 underline break-all">
            {part}
          </a>
        </Fragment>
      )
    }

    // Split the text part by newlines and render them with <br /> for line breaks
    return (
      <Fragment key={index}>
        {part.split('\n').map((line, i) => (
          <Fragment key={i}>
            {line}
            <br />
          </Fragment>
        ))}
      </Fragment>
    )
  })
}

const PostCard = ({ post, variant = 'default', handleNewReply, imagesVisible }: PostPropsInterface) => {
  const queryClient = useQueryClient()
  const { handleNewLike } = usePosts()
  const { activeAccount, signer } = useWallet()
  const { sendTransactions, signTransactions } = useWallet()
  const { data: userData } = useGetUserInfo(post.creator_address)
  const { algod } = useOutletContext() as PostInputPropsInterface
  const replieservice = new Reply(algod)
  const likeService = new Like(algod)
  const [isLoadingLike, setIsLoadingLike] = useState(false)
  const [isLoadingReply, setIsLoadingReply] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [openReplyInput, setOpenReplyInput] = useState(false)
  const [userCountry, setUserContry] = useState('')

  const { mutate: createLike } = useCreateLike()

  const { mutate: createReply } = useCreateReply()

  const { usableAsset } = useUsableAsset()

  const currentPostUsableAsset = usableAssetsList.find((usableAsset) => post.assetId === usableAsset.assetId)

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  const handleDefaultPostLike = async (event: React.FormEvent) => {
    try {
      const encodedGroupedTransactions = await likeService.handlePostLike({
        event,
        creatorAddress: post.creator_address,
        address: activeAccount?.address || '',
        transactionId: post.transaction_id as string,
        usableAsset: usableAsset,
      })

      const signedTransactions = await signTransactions(encodedGroupedTransactions)
      const waitRoundsToConfirm = 4

      const like = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      handleNewLike && handleNewLike({ creator_address: userData?.address || '' }, post.transaction_id as string)
      createLike({
        creator_address: userData?.address || '',
        transaction_id: like.id,
        post_transaction_id: post.transaction_id as string,
      })
    } catch (error) {
      console.error(error)
    }
  }

  const handleFilePostLike = async (event: React.FormEvent) => {
    setIsLoadingLike(true)
    event.preventDefault()

    try {
      const result = await likeOnChainFilePost(activeAccount?.address!, usableAsset.assetId, signer, post as Daum)

      setIsLoadingLike(false)
    } catch (error) {
      setIsLoadingLike(false)
      console.error('error liking file post', error)
    }
  }

  const handleFilePostReply = async () => {
    setIsLoadingReply(true)
    const country = await getUserCountry()
    setUserContry(country)

    const result = await replyOnChainPost(
      activeAccount?.address!,
      country,
      usableAsset.assetId!,
      signer,
      post as Daum,
      encodeURIComponent(replyText),
    )

    setIsLoadingReply(false)
  }

  const defineLikeAction = async (event: React.FormEvent) => {
    let action

    if (post.file_1_cid) {
      await handleFilePostLike(event)
    } else if (!post.file_1_cid) {
      await handleDefaultPostLike(event)
    }

    return action
  }

  const handlePostLike = async (event: React.FormEvent) => {
    try {
      setIsLoadingLike(true)

      const likeAction = defineLikeAction(event)

      setIsLoadingLike(false)
    } catch (error) {
      console.error(error)
      setIsLoadingLike(false)
      toast('Error sending like', {
        position: 'bottom-right',
        theme: 'dark',
      })
    }
  }

  const handlePostReply = async () => {
    setIsLoadingReply(true)
    const country = await getUserCountry()
    setUserContry(country)

    if (post.file_1_cid) {
      handleFilePostReply()
    } else {
      try {
        const parentReplyId = post.transaction_id as string
        const encodedGroupedTransactions = await replieservice.handlePostReply({
          creatorAddress: userData?.address || '',
          address: activeAccount?.address || '',
          transactionId: post.transaction_id as string,
          text: encodeURIComponent(replyText),
          assetId: usableAsset.assetId,
        })
        const signedTransactions = await signTransactions(encodedGroupedTransactions)
        const waitRoundsToConfirm = 4

        const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)

        const acceptedReply: Daum = {
          creator_address: activeAccount?.address || '',
          text: encodeURIComponent(replyText),
          status: 'accepted',
          transaction_id: id,
          likes: [],
          country,
          timestamp: Math.floor(new Date().getTime() / 1000),
          replies: [],
          type: 'post',
          assetId: usableAsset.assetId,
        }

        handleNewReply && handleNewReply(acceptedReply, parentReplyId)
        createReply({
          creator_address: activeAccount?.address || '',
          transaction_id: id,
          post_transaction_id: parentReplyId,
          text: encodeURIComponent(replyText),
          timestamp: Math.floor(new Date().getTime() / 1000),
          country,
          assetId: usableAsset.assetId,
        })
        setReplyText('')
        setIsLoadingReply(false)
      } catch (error) {
        toast('Error sending reply', {
          position: 'bottom-right',
          theme: 'dark',
        })
        setReplyText('')
        setIsLoadingReply(false)
      }
    }
  }

  const handleTimestamp = () => {
    const date = post.timestamp! * 1000
    return formatDateFromTimestamp(date)
  }

  const handleGoToPostPage = () => {
    window.location.href = `/post?id=${post.transaction_id}`
  }

  return (
    <>
      <div>
        {post.status === 'loading' ? (
          <div
            key={post.transaction_id}
            className="border-2 opacity-80 animate-pulse border-gray-900 flex p-2 hover:bg-gray-100 transition-all duration-75 cursor-pointer justify-between"
          >
            <div className="flex flex-col">
              <div className="flex items-center gap-3">
                <div className="w-10 rounded-full border-2 border-gray-900">
                  <img className="w-full" src={generateIdIcon(post.creator_address!)} alt="" />
                </div>
                <h2 className="font-bold text-xl h-full">{ellipseAddress(post.creator_address)}</h2>
              </div>
              <p className="w-full" onClick={(e) => e.stopPropagation()}>
                {handleTextPost(post.text)}
              </p>
            </div>
            <span>
              <FaSpinner className="w-6 animate-spin" />
            </span>
          </div>
        ) : (
          <div
            onClick={handleGoToPostPage}
            className={`flex flex-col gap-3 p-4 hover:bg-gray-100 h-content  transition-all duration-75 cursor-pointer bg-white dark:bg-gray-900`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-md border-2 border-gray-900 bg-white overflow-hidden border-b-4">
                  <img className="w-full bg-cover" src={userData?.nfd?.avatar || generateIdIcon(post.creator_address!)} alt="" />
                </div>
                <a href={`/profile/${post.creator_address}`}>
                  <DecodingText
                    finalText={ellipseAddress(post.creator_address)}
                    speed={100}
                    initialText={userData?.nfd?.name?.replace('.algo', '').toUpperCase()}
                    className='font-bold text-lg md:text-xl h-full underline hover:text-blue-500' />
                </a>
              </div>
              <div className="md:flex flex-col md:flex-row md:gap-2 hidden">
                {post.country ? (
                  <div className="flex gap-0 flex-col items-center justify-center">
                    <div className="w-6 rounded-full overflow-hidden">
                      <img className="w-full h-full" src={`https://flagsapi.com/${post.country}/flat/64.png`} alt="" />
                    </div>
                    <p className="w-full text-center">{post.country}</p>
                  </div>
                ) : null}
                <p>{handleTimestamp()}</p>
              </div>
            </div>

            <div className="gap-2 w-full flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
              <div className="py-2 border-y-2 border-gray-500/10">
                <p className="tracking-wide break-words w-full">{post?.text?.length > 0 && handleTextPost(post.text)}</p>

                {post.file_1_cid && post.file_1_format ? (
                  <div className="relative flex  py-3">
                    <div
                      className={`w-[400px] rounded-2xl h-full bg-white/50 absolute backdrop-blur-md flex gap-2 items-center justify-center ${imagesVisible ? 'hidden' : ''
                        }`}
                    >
                      <p>View image</p>
                      <FaMagnifyingGlass />
                    </div>
                    <FileWithLoading cid={post.file_1_cid} format={post.file_1_format} />
                  </div>
                ) : null}</div>
              <div className={'flex w-full items-center gap-1 text-md justify-between md:justify-end'}>
                <div className="flex gap-2 items-center" onClick={(e) => e.stopPropagation()}>
                  <div className="flex items-center gap-2"><h3 className="hidden">Created with ${currentPostUsableAsset?.name}</h3><img className="h-10 w-10 rounded-full" src={currentPostUsableAsset?.image} alt={`${post.assetId}-icon`} /></div>
                  {variant === 'default' && (
                    <button
                      className="cursor-pointer rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center"
                      onClick={() => setOpenReplyInput(!openReplyInput)}
                    >
                      <FaRegMessage className="text-2xl group-hover:text-gray-100 dark:group-hover:text-gray-900 hover:text-blue-500" />
                      <p className="text-md group-hover:text-gray-100 dark:group-hover:text-gray-900 hover:text-blue-500">
                        {post?.replies?.length}
                      </p>
                    </button>
                  )}

                  <div className={'flex gap-1 items-center'}>
                    {isLoadingLike ? (
                      <FaSpinner className="animate-spin text-2xl" />
                    ) : (
                      <>
                        <button
                          className="cursor-pointer rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center"
                          onClick={handlePostLike}
                        >
                          <FaRegThumbsUp className="text-2xl group-hover:text-gray-100 dark:group-hover:text-gray-900" />
                          {<p className="group-hover:text-gray-100 dark:group-hover:text-gray-900">{post?.likes?.length}</p>}
                        </button>
                      </>
                    )}
                  </div>
                  <button
                    className={
                      'cursor-pointer rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center'
                    }
                  >
                    <a target="_blank" href={`https://allo.info/tx/${post.transaction_id}`}>
                      <MdTravelExplore className="text-lg group-hover:text-gray-100 dark:group-hover:text-gray-900 hover:text-blue-500" />
                    </a>
                  </button>
                  <ShareButton id={post.transaction_id || ''} />
                </div>
                <div className="flex flex-col md:gap-2 md:hidden">
                  {post.country ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-6 rounded-full overflow-hidden">
                        <img className="w-full h-full" src={`https://flagsapi.com/${post.country}/flat/64.png`} alt="" />
                      </div>
                      <p className="text-center">{post.country}</p>
                    </div>
                  ) : null}
                  <p className="text-center text-[12px]">{handleTimestamp()}</p>
                </div>
              </div>

              {openReplyInput && (
                <div className={'grid gap-4 h-full'} onClick={(e) => e.stopPropagation()}>
                  <p className={'text-lg'}>replies</p>

                  {post?.replies &&
                    post?.replies?.length > 0 &&
                    post.replies
                      .sort((a, b) => {
                        return a.timestamp! - b.timestamp!
                      })
                      .map((reply) => <PostCard imagesVisible={false} post={reply} variant={'reply'} />)}
                  {isLoadingReply && (
                    <PostCard
                      imagesVisible={false}
                      post={{
                        text: `${encodeURIComponent(replyText)}`,
                        creator_address: userData?.address || '',
                        nfd: '',
                        replies: [],
                        likes: [],
                        type: 'post',
                        post_transaction_id: post.transaction_id,
                        status: 'loading',
                        country: userCountry,
                        timestamp: new Date().getDate(),
                        transaction_id: uuidv4(),
                        assetId: 0,
                      }}
                      variant={'reply'}
                    />
                  )}

                  {!isLoadingReply && (
                    <ReplyInput
                      handleChange={(e) => setReplyText(e.target.value)}
                      placeholder={'Reply message...'}
                      value={replyText}
                      handleSubmit={() => {
                        !post.file_1_cid ? handlePostReply() : handleFilePostReply()
                      }}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default PostCard
