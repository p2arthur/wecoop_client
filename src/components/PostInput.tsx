import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useEffect, useState } from 'react'
import { FaArrowRight } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { usePosts } from '../context/Posts/Posts'
import { AssetId } from '../enums/assetId'
import { NotePrefix } from '../enums/notePrefix'
import { Transaction } from '../services/Transaction'
import { User as UserInterface } from '../services/api/types'
import { getUserCountry } from '../utils/userUtils'
import Button from './Button'

interface PostInputOutletContext {
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
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const { handleAddNewPost, handleDeletePost } = usePosts()
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')
  const [placeholderSelected] = useState(placeholderPhrases[Math.floor(Math.random() * placeholderPhrases.length)])

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

  const transactionServices = new Transaction(algod)
  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setInputText(text)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const country = await getUserCountry()
    handleAddNewPost({
      text: inputText,
      creator_address: userData.address,
      status: 'loading',
      timestamp: new Date().getDate(),
      country: country,
      replies: [],
      likes: [],
      transaction_id: 'loading_id',
    })
    const encodedInputText = encodeURIComponent(inputText)
    const note = `${NotePrefix.WeCoopPost}${country}:${encodedInputText}`

    try {
      const transaction = await transactionServices.createTransaction(
        userData.address,
        import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
        100000,
        note,
      )

      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)
      const signedTransactions = await signTransactions([encodedTransaction])
      const waitRoundsToConfirm = 4
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
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
      })
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        handleDeletePost('loading_id'),
          handleAddNewPost({
            text: inputText,
            creator_address: userData.address,
            status: 'rejected',
            timestamp: new Date().getDate(),
            transaction_id: uuidv4(),
            replies: [],
            country,
            likes: [],
          })
      }, 1000)
    }
  }
  return (
    <form onSubmit={handleSubmit} action="">
      {' '}
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-500 bg-gray-100 dark:bg-gray-900">
        <div className="w-full relative ">
          <textarea
            maxLength={300}
            onChange={handleChange}
            placeholder={placeholder}
            className="w-full border-2  align-top text-start break-all whitespace-normal h-32 p-2 resize-none  z-20 focus:scale-101 focus:border-b-4  dark:border-gray-600 border-gray-900 focus:outline-gray-500"
          />
          <div className="absolute right-5 bottom-2">{`${inputText.length}/300`}</div>
        </div>
        <div>
          <div className="flex items-center text-red-600 gap-1">
            <FaArrowRight />

            <p className="w-full">Note: All posts and interactions are permanently recorded on the Algorand blockchain.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {' '}
          <div className="flex gap-1">
            <span>
              <img className="h-6 w-6" src={`https://asa-list.tinyman.org/assets/${AssetId.coopCoin}/icon.png`} alt="" />
            </span>
            <span>{userData.balance || 0}</span>
          </div>
          {activeAccount?.address && inputText !== '' && inputText.length <= 300 && userData.balance! > 0.1 ? (
            <Button buttonText="Send your message" />
          ) : (
            <Button inactive={true} buttonText="Send your message" />
          )}
        </div>
      </div>
    </form>
  )
}

export default PostInput
