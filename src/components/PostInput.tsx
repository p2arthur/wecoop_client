import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useEffect, useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PostProps } from '../services/Post'
import { Transaction } from '../services/Transaction'
import { UserInterface } from '../services/User'
import { getUserCountry } from '../utils/userUtils'
import Button from './Button'

interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

interface PostPropsInterface {
  setPosts(post: PostProps): void
}

const placeholderPhrases = [
  'Craft a Coop Coin message on WeCoop, make it timeless in Algorand!',
  'Compose your message on WeCoop, pay with Coop Coin, live forever on Algorand!',
  'Share your message on WeCoop, use Coop Coin, eternal in Algorand.',
  'Type your message on WeCoop, pay with Coop Coin, Algorand bound.',
  'Craft with Coop Coin on WeCoop, your words echo in Algorand.',
  'WeCoop awaits your message, unlock with Coop Coin, Algorand awaits.',
  "Tell your story on WeCoop, use Coop Coin, secure in Algorand's history.",
  'Create, share, repeat your message on WeCoop with Coop Coin, echo in Algorand!',
  'Unlock creativity! Craft your message on WeCoop with Coop Coin, resonate in Algorand.',
  'Coop Coin: Your key to WeCoop. Start writing, resonate in Algorand!',
  "Speak up with your message on WeCoop! Coop Coin, a part of Algorand's message history.",
  'Compose your message on WeCoop, Coop Coin makes it seamless, echoing through Algorand.',
  'Let your message fly on WeCoop, Coop Coin makes it happen, immortalizing in Algorand.',
  "WeCoop's message wall is yours. Coop Coin opens the gate, your message in Algorand.",
  'Craft your message on WeCoop, pay with Coop Coin, your words resonate in Algorand.',
  "Coop Coin is your ink for your message on WeCoop's paper. Start creating, resonate in Algorand.",
  "WeCoop's message arena awaits. Pay with Coop Coin, your message in Algorand forever.",
  "Create impact with your message on WeCoop, Coop Coin your ticket to Algorand's eternity.",
  'WeCoop: Your platform, your messages. Coop Coin echoes your message in Algorand.',
]

const PostInput = ({ setPosts }: PostPropsInterface) => {
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
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
    setPosts({ text: inputText, creator_address: userData.address, status: 'loading', timestamp: null, transaction_id: null })
    const country = await getUserCountry()
    const note = `wecoop:post:${country}:${inputText}`

    const transaction = await transactionServices.createTransaction(
      userData.address,
      'GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ',
      1000,
      note,
    )

    try {
      const encodedTransaction = algosdk.encodeUnsignedTransaction(transaction)
      const signedTransactions = await signTransactions([encodedTransaction])
      const waitRoundsToConfirm = 4
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      setPosts({
        creator_address: userData.address,
        text: inputText,
        status: 'accepted',
        transaction_id: id,
        country,
        nfd: userData.nfd,
        timestamp: null,
      })
    } catch (error) {
      console.error(error)
      setTimeout(
        () => setPosts({ text: inputText, creator_address: userData.address, status: 'denied', timestamp: null, transaction_id: null }),
        1000,
      )
    }
  }
  return (
    <form onSubmit={handleSubmit} action="">
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-800">
        <textarea
          maxLength={300}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full border-2 border-gray-400 align-top text-start break-all whitespace-normal h-32 p-2 resize-none dark:border-gray-800"
        />
        {activeAccount?.address ? <Button buttonText="Send your message" /> : <Button inactive={true} buttonText="Send message" />}
      </div>
    </form>
  )
}

export default PostInput
