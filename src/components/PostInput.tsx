import { useWallet } from '@txnlab/use-wallet'
import algosdk, { Transaction } from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import React, { useEffect, useState } from 'react'
import { FaArrowsRotate, FaCircleInfo } from 'react-icons/fa6'
import { useOutletContext, useParams } from 'react-router-dom'
import { usePosts } from '../context/Posts/Posts'
import { useUsableAsset } from '../context/UsableAsset/UsableAssetContext'
import { usableAssetsList } from '../data/usableAssetsList'
import { NotePrefix } from '../enums/notePrefix'
import { User as UserInterface } from '../services/api/types'
import { getFeePriceByAsset, InteractionMultipliers } from '../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../utils/interaction_pricing/splitFeeByInteractionType'
import { getUserCountry } from '../utils/userUtils'
import Button from './Button'
import { CoinDropdown } from './CoinDropdown'
import Counter from './Counter'

//--------------
import { useQueryClient } from '@tanstack/react-query'
import { toast } from 'react-toastify'
import { createAppClient, makePoll } from '../contracts/app-calls/wecoopDaoMethods'
import { useCreatePost } from '../services/api/Posts'
import { captureVoteCard } from '../utils/captureComponentImage'
import { getAssetDecimals } from '../utils/getAssetDecimals'
import { getOptedIn } from '../utils/getOptedIn'
import { PostTypeSwitch } from './PostTypeSwitch'

//----------

export interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

const placeholderPhrases = [
  'Craft a Coop Coin message on WeCoop, be timeless in Algorand!',
  'Compose on WeCoop, pay with Coop Coin, live on Algorand!',
  "Share on WeCoop, Coop Coin ensures it's eternal in Algorand.",
  'WeCoop message, Coop Coin pays, Algorand bound.',
  'Craft with Coop Coin on WeCoop, echo in Algorand.',
  'WeCoop awaits, unlock with Coop Coin, Algorand bound.',
  "Tell your WeCoop story, use Coop Coin, Algorand's history.",
  'Create on WeCoop, Coop Coin resonates in Algorand.',
  'Coop Coin: Key to WeCoop. Start writing, resonate in Algorand!',
  "Speak up on WeCoop! Coop Coin, part of Algorand's history.",
  'Compose on WeCoop, Coop Coin echoes in Algorand.',
  'Let your WeCoop message fly, Coop Coin immortalizes in Algorand.',
  "WeCoop's wall is yours. Coop Coin opens, your message in Algorand.",
  'Craft your WeCoop message, pay with Coop Coin, resonate in Algorand.',
  "Coop Coin is your ink, WeCoop's paper. Start creating, resonate in Algorand.",
  "WeCoop's arena awaits. Pay with Coop Coin, your message in Algorand forever.",
  "Create impact on WeCoop, Coop Coin your ticket to Algorand's eternity.",
  'WeCoop Your platform, your messages. Coop Coin echoes in Algorand.',
]

type PostInputProps = {
  postTypeProp?: string
}

const PostInput = ({ postTypeProp = 'post' }: PostInputProps) => {
  const { usableAssetId } = useParams<{ usableAssetId: string }>()
  const { signTransactions, sendTransactions, activeAccount, signer } = useWallet()
  const { handleAddNewPost, handleDeleteLoadingPost, handleRefreshPosts, postType, handleChangePostType } = usePosts()
  const [openTooltip, setOpenTooltip] = useState(false)
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState(usableAssetsList[0])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [placeholderSelected] = useState(placeholderPhrases[Math.floor(Math.random() * placeholderPhrases.length)])
  const { mutate: createPost, isSuccess: isSuccessCreatePost } = useCreatePost()
  const [loadingSubmit, setLoadingSubmit] = useState(false)

  const { usableAsset, setUsableAsset } = useUsableAsset()

  const [expiresCounter, setExpiresCounter] = useState(1)
  const [prizePool, setPrizePool] = useState(0.0)

  const [placeholder, setPlaceholder] = useState(placeholderSelected.slice(0, 0))
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

  const handleSetPrizePool = (event: React.ChangeEvent<HTMLInputElement>) => {
    const prizePool = event.target.value
    setPrizePool(Number(prizePool))
  }

  const queryClient = useQueryClient()

  useEffect(() => {
    handleChangePostType(postTypeProp)
  }, [postTypeProp])

  useEffect(() => {
    const intr = setInterval(() => {
      setPlaceholder((prevPlaceholder) => {
        const nextChar = placeholderSelected[prevPlaceholder.length]

        return nextChar !== undefined ? prevPlaceholder + nextChar : prevPlaceholder
      })

      if (placeholderIndex + 1 > placeholderSelected.length) {
        clearInterval(intr)
      } else {
        setPlaceholderIndex((prevIndex) => prevIndex + 1)
      }
    }, 50)

    return () => {
      clearInterval(intr)
    }
  }, [placeholderIndex, placeholderSelected])

  useEffect(() => {
    const foundAsset = usableAssetsList.find((asset) => asset.assetId == Number(usableAssetId))

    if (!foundAsset) return

    setUsableAsset(foundAsset)
  }, [usableAsset])

  const handleAssetSelect = (asset: any) => {
    // navigate(`/global/${asset.assetId}`)
    setSelectorOpen(!selectorOpen)
    setUsableAsset(asset)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setInputText(text)
  }

  const handleCreatePoll = async (event: React.FormEvent) => {
    try {
      setLoadingSubmit(true)
      event.preventDefault()
      toast('Creating a poll - processing and creating your wecoop poll', {
        position: 'top-right',
        theme: 'dark',
      })
      const wecoopDaoAppId = Number(import.meta.env.VITE_WECOOP_POLL_APP_ID)
      const daoAssetId = usableAsset.assetId
      const pollQuestion = inputText

      const expiresInDays = expiresCounter

      const expires_in_ms = expiresInDays * 86400

      const country = await getUserCountry()

      const assetDecimals = await getAssetDecimals(algod, usableAsset.assetId)

      const newPoll = {
        pollId: 150,
        creator_address: activeAccount?.address!,
        text: pollQuestion,
        timestamp: Math.floor(new Date().getTime() / 1000),
        expiry_timestamp: Math.floor(new Date().getTime()) / 1000 + expires_in_ms,
        country: country,
        depositedAmount: prizePool,
        assetId: usableAsset.assetId,
        totalVotes: 0,
        yesVotes: 0,
        status: 'loading',
        voters: [],
        type: 'poll',
      }

      handleAddNewPost(newPoll)

      const appClient = createAppClient(activeAccount?.address!, signer, algod)

      const { totalPolls } = await appClient.getGlobalState()

      try {
        const result = await makePoll(
          appClient,
          activeAccount?.address!,
          signer,
          prizePool * 10 ** assetDecimals,
          expiresInDays,
          daoAssetId,
          pollQuestion,
          totalPolls?.asNumber()! + 1,
          activeAccount?.address!,
          country,
          prizePool * 10 ** assetDecimals,
        )
      } catch (error) {
        console.error('error creating poll ', error)
      }

      handleDeleteLoadingPost('loading_id')
      toast('Create a pool vote successfully', {
        position: 'bottom-right',
        theme: 'dark',
      })

      queryClient.invalidateQueries({ queryKey: ['getFeedByMongo'] })

      setInputText('')
      setLoadingSubmit(false)
      setPrizePool(10)
    } catch (e) {
      setInputText('')
      setLoadingSubmit(false)
      toast('Failed to make a vote try', {
        position: 'bottom-right',
        className: 'black-background',
        bodyClassName: 'grow-font-size',
        progressClassName: 'fancy-progress-bar',
      })
    }
  }

  const handleSubmitPost = async (event: React.FormEvent) => {
    event.preventDefault()
    setLoadingSubmit(true)
    const country = await getUserCountry()

    try {
      handleAddNewPost({
        text: inputText,
        creator_address: userData.address,
        status: 'loading',
        timestamp: new Date().getDate(),
        transaction_id: 'loading_id',
        replies: [],
        type: 'post',
        country,
        likes: [],
        assetId: usableAsset.assetId,
      })

      // Get suggested transaction parameters from the Algod node
      const suggestedParams = await algod.getTransactionParams().do()

      const allTransactions: Transaction[] = []

      for (const asset of usableAssetsList) {
        const userOptedIn = await getOptedIn(activeAccount?.address!, asset.assetId, algod)

        if (asset.assetId === 0) continue

        if (!userOptedIn) {
          const transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
            from: userData.address,
            to: userData.address,
            amount: 0, // Amount of asset to transfer
            assetIndex: asset.assetId,
            suggestedParams: suggestedParams, // Use suggested transaction params
          })

          allTransactions.push(transaction)
        }
      }

      const encodedInputText = encodeURIComponent(inputText.replace(/\n/g, '%0A'))
      const note = `${NotePrefix.WeCoopPost}${country}:${encodedInputText}`

      let transaction: algosdk.Transaction
      let crvDaoTransaction: algosdk.Transaction
      // Check if it's a payment transaction or an asset transfer transaction
      if (usableAsset.assetId === 0) {
        // Payment transaction (Algo transfer)
        transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: userData.address,
          to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
          note: new Uint8Array(Buffer.from(note)), // Encode note
          suggestedParams: suggestedParams, // Use suggested transaction params,
          amount: 100000,
        })
      } else {
        // Calculate the fee price based on the asset
        const feePrice = await getFeePriceByAsset(usableAsset.assetId, usableAsset.decimals, InteractionMultipliers.Post)

        // Split the fee by interaction type
        const splitFee = splitFeeByInteractionType({ totalFee: feePrice!, type: 'post' })

        // Example calculation to ensure platformFee is used as an integer
        const finalFeeForTransaction = Math.floor(splitFee.platformFee * 1000 * 1000) // ensure this is an integer

        // Asset transfer transaction (ASA)
        transaction = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
          from: userData.address,
          to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
          amount: finalFeeForTransaction, // Amount of asset to transfer
          assetIndex: usableAsset.assetId, // ASA (Asset ID)
          note: new Uint8Array(Buffer.from(note)), // Encode note
          suggestedParams: suggestedParams, // Use suggested transaction params
        })

        allTransactions.push(transaction)
      }

      algosdk.assignGroupID(allTransactions)

      const encodedTransactions = allTransactions.map((transaction) => algosdk.encodeUnsignedTransaction(transaction))
      const signedTransactions = await signTransactions(encodedTransactions)
      const { id } = await sendTransactions(signedTransactions, 4)
      const postToMongo = {
        creator_address: userData.address,
        text: inputText,
        transaction_id: id,
        country,
        timestamp: Math.floor(new Date().getTime() / 1000),
        assetId: usableAsset.assetId,
      }
      createPost(postToMongo)

      handleDeleteLoadingPost('loading_id')
      setLoadingSubmit(false)
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        handleDeleteLoadingPost('loading_id')
        toast('Failed to create post, try again later', {
          position: 'bottom-right',
          className: 'black-background',
          bodyClassName: 'grow-font-size',
          progressClassName: 'fancy-progress-bar',
        })
        setLoadingSubmit(false)
      }, 1000)
    }
  }

  return (
    <form onSubmit={(e) => (postType === 'post' ? handleSubmitPost(e) : handleCreatePoll(e))}>
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-500 bg-gray-100 dark:bg-gray-900">
        <div className="w-full relative">
          <textarea
            maxLength={postType === 'post' ? 300 : 300}
            value={inputText}
            onChange={handleChange}
            placeholder={postType === 'post' ? placeholder : 'Create your vote'}
            className={`w-full border-2  align-top text-start break-all whitespace-normal h-32 ${
              postType === 'post' ? 'p-2' : 'py-2 pl-2 pr-72'
            } resize-none z-20 focus:scale-101 focus:border-b-4 dark:border-gray-600 border-gray-900 focus:outline-gray-500`}
          />
          <div className="absolute right-5 bottom-2">{`${inputText.length}/${postType === 'post' ? 300 : 100}`}</div>
          {postType === 'poll' && (
            <div className={'absolute right-5 top-2 text-center'}>
              <span>Expires in:</span>
              <Counter
                count={expiresCounter}
                onIncrement={() => setExpiresCounter(expiresCounter + 1)}
                onDecrement={() => setExpiresCounter(expiresCounter - 1)}
                max={5}
              />
            </div>
          )}
        </div>

        <div className="grid items-start  grid-cols-2 md:block gap-4  w-full justify-end">
          <div className={'flex justify-end items-center gap-4'}>
            <div className={'relative'}>
              <div
                onMouseEnter={() => {
                  setOpenTooltip(true)
                }}
                onMouseLeave={() => setOpenTooltip(false)}
                onClick={() => setOpenTooltip(!openTooltip)}
              >
                <FaCircleInfo />{' '}
              </div>
              {openTooltip && (
                <div
                  className={
                    'absolute translate-x-1/2 top-8 w-48 right-0 border-2 border-gray-900\n z-50' +
                    'p-1  bg-white font-bold\n' +
                    'hover:bg-gray-200 active:bg-gray-300 flex items-center dark:border-gray-100 dark:text-gray-100 gap-2 border-b-4 active:border-b-transparent active:translate-y-px dark:border-b-4 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-sm md:text-md'
                  }
                >
                  <p className={'text-red-600 text-center'}>
                    Note: All posts and interactions are permanently recorded on the Algorand blockchain.
                  </p>
                </div>
              )}
            </div>
            <Button buttonFunction={handleRefreshPosts} type={'button'} buttonText="Refresh" icon={<FaArrowsRotate />} />
          </div>
          <div className={'grid justify-items-end md:flex md:justify-end md:mt-4 gap-4 md:items-center'}>
            {postType === 'poll' && (
              <div className={'flex items-center gap-2'}>
                <span>Prize pool:</span>
                <input
                  type={'number'}
                  className={'w-24 border-black border-2 dark:bg-gray-700 rounded-sm text-center dark:text-white'}
                  min={0.1}
                  step={0.1}
                  value={prizePool}
                  onChange={(event) => handleSetPrizePool(event)}
                />
              </div>
            )}
            {postTypeProp !== 'poll' && <PostTypeSwitch />}
            <CoinDropdown
              usableAsset={usableAsset}
              handleAssetSelect={handleAssetSelect}
              setSelectorOpen={setSelectorOpen}
              selectedAsset={selectedAsset}
              selectorOpen={selectorOpen}
            />
            {activeAccount?.address &&
            inputText !== '' &&
            inputText.length <= 300 &&
            userData.balance[selectedAsset.assetId] > 0.1 &&
            !loadingSubmit ? (
              <Button buttonText={`${postType === 'post' ? 'Send message' : 'Create poll'}`} full justify={'center'} />
            ) : (
              <Button inactive={true} buttonText={`${postType === 'post' ? 'Send message' : 'Create poll'}`} full justify={'center'} />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default PostInput
