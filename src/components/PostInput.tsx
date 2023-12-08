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
  'Share your thoughts with the world...',
  "What's on your mind?",
  'Tell us your story...',
  'Write something memorable...',
  "What's your creative spark today?",
  'Share a piece of your wisdom...',
  'Write your dreams, make them real...',
  'Express yourself in 300 characters or less...',
  'Tell us about your favorite moment...',
  'Your thoughts matter, let them shine...',
  'Speak your truth and let it resonate...',
  'Craft your message for eternity...',
  'Unleash the power of your words...',
  'What message would you send to the future?',
  'Create a message that lasts forever...',
  'Inspire others with your words...',
  'Capture a moment in the sands of time...',
  'Let your words echo through the blockchain...',
  'Leave a mark with your unique message...',
  'Share positivity with the world...',
  'Leave a legacy in the blockchain...',
  'Speak from the heart, it never goes out of style...',
  'What message would you send to the universe?',
  'Contribute to the collective consciousness...',
  'Write a message that transcends time and space...',
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
