import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useEffect, useState } from 'react'
import { FaArrowsRotate, FaCircleInfo } from 'react-icons/fa6'
import { useOutletContext, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
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
import { PostTypeSwitch } from './PostTypeSwitch'

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

const PostInput = () => {
  const { usableAssetId } = useParams<{ usableAssetId: string }>()
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const { handleAddNewPost, handleDeletePost, handleRefreshPosts, postType } = usePosts()
  const [openTooltip, setOpenTooltip] = useState(false)
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState(usableAssetsList[0])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [placeholderSelected] = useState(placeholderPhrases[Math.floor(Math.random() * placeholderPhrases.length)])

  // vote states

  const [counter, setCounter] = useState(1)
  const [prizePool, setPrizePool] = useState(10)

  const [placeholder, setPlaceholder] = useState(placeholderSelected.slice(0, 0))
  const [placeholderIndex, setPlaceholderIndex] = useState(0)

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

  const { usableAsset, setUsableAsset } = useUsableAsset()

  useEffect(() => {
    const foundAsset = usableAssetsList.find((asset) => asset.assetId == Number(usableAssetId))

    if (!foundAsset) return

    setUsableAsset(foundAsset)
  }, [usableAsset])

  const handleAssetSelect = (asset: any) => {
    // navigate(`/global/${asset.assetId}`)
    console.log('change asset', asset)
    setSelectorOpen(!selectorOpen)
    setUsableAsset(asset)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setInputText(text)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    const country = await getUserCountry()

    const encodedInputText = encodeURIComponent(inputText)
    const note = `${NotePrefix.WeCoopPost}${country}:${encodedInputText}`

    const encodedNote = new Uint8Array(Buffer.from(note))

    try {
      let transaction: algosdk.Transaction

      // Get suggested transaction parameters from the Algod node
      const suggestedParams = await algod.getTransactionParams().do()

      console.log('selectedAsset', selectedAsset)

      // Check if it's a payment transaction or an asset transfer transaction
      if (usableAsset.assetId === 0) {
        // Payment transaction (Algo transfer)
        transaction = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
          from: userData.address,
          to: import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
          note: new Uint8Array(Buffer.from(note)), // Encode note
          suggestedParams: suggestedParams, // Use suggested transaction params,
          amount: 1,
        })
      } else {
        // Calculate the fee price based on the asset
        const feePrice = await getFeePriceByAsset(usableAsset.assetId, usableAsset.decimals, InteractionMultipliers.Post)
        // Split the fee by interaction type
        const splitFee = splitFeeByInteractionType({ totalFee: feePrice, type: 'post' })

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
      }

      const signedTransactions = await signTransactions([algosdk.encodeUnsignedTransaction(transaction)])
      const { id } = await sendTransactions(signedTransactions, 4)

      handleDeletePost('loading_id')
      handleAddNewPost({
        creator_address: userData.address,
        text: inputText,
        status: 'accepted',
        transaction_id: id,
        country,
        timestamp: new Date().getDate(),
        replies: [],
        likes: [],
        isPersonalized: {},
        assetId: usableAsset.assetId,
      })
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        handleDeletePost('loading_id')
        handleAddNewPost({
          text: inputText,
          creator_address: userData.address,
          status: 'rejected',
          timestamp: new Date().getDate(),
          transaction_id: uuidv4(),
          replies: [],
          country,
          likes: [],
          isPersonalized: {},
          assetId: usableAsset.assetId,
        })
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-500 bg-gray-100 dark:bg-gray-900">
        <div className="w-full relative">
          <textarea
            maxLength={postType === 'post' ? 300 : 100}
            onChange={handleChange}
            placeholder={postType === 'post' ? placeholder : 'Create your vote'}
            className={`w-full border-2  align-top text-start break-all whitespace-normal h-32 ${
              postType === 'post' ? 'p-2' : 'py-2 pl-2 pr-72'
            } resize-none z-20 focus:scale-101 focus:border-b-4 dark:border-gray-600 border-gray-900 focus:outline-gray-500`}
          />
          <div className="absolute right-5 bottom-2">{`${inputText.length}/${postType === 'post' ? 300 : 100}`}</div>
          {postType === 'vote' && (
            <div className={'absolute right-5 top-2 text-center'}>
              <span>Expires in:</span>
              <Counter count={counter} onIncrement={() => setCounter(counter + 1)} onDecrement={() => setCounter(counter - 1)} max={5} />
            </div>
          )}
        </div>

        <div className="grid gap-4  w-full justify-end">
          <div className={'flex justify-end items-center gap-4'}>
            <div className={'relative'}>
              <Button icon={<FaCircleInfo />} buttonFunction={() => setOpenTooltip(!openTooltip)} />
              {openTooltip && (
                <div
                  className={
                    'absolute translate-x-1/2 top-8 w-48 right-0 border-2 border-gray-900\n' +
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
          <div className={'flex gap-4 items-center'}>
            {postType === 'vote' && (
              <div className={'flex items-center gap-2'}>
                <span>Prize pool:</span>
                <input
                  type={'number'}
                  className={'w-24 border-black border-2 dark:bg-gray-700 rounded-sm text-center dark:text-white'}
                  min={10}
                  value={prizePool}
                  onChange={(e) => setPrizePool(e.target.value)}
                />
              </div>
            )}
            <PostTypeSwitch />
            <CoinDropdown
              usableAsset={usableAsset}
              handleAssetSelect={handleAssetSelect}
              setSelectorOpen={setSelectorOpen}
              selectedAsset={selectedAsset}
              selectorOpen={selectorOpen}
            />
            {activeAccount?.address && inputText !== '' && inputText.length <= 300 && userData.balance[selectedAsset.assetId] > 0.1 ? (
              <Button buttonText={`${postType === 'post' ? 'Send your message' : 'Create your vote'}`} full justify={'center'} />
            ) : (
              <Button
                inactive={true}
                buttonText={`${postType === 'post' ? 'Send your message' : 'Create your vote'}`}
                full
                justify={'center'}
              />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default PostInput
