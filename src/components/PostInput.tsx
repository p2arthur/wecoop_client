import { useWallet } from '@txnlab/use-wallet'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import axios from 'axios'
import { useState } from 'react'
import { useOutletContext } from 'react-router-dom'
import { PostProps } from '../services/Post'
import { Transaction } from '../services/Transaction'
import { User, UserInterface } from '../services/User'
import Button from './Button'

interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

interface PostPropsInterface {
  setPosts(post: PostProps): void
}

const PostInput = ({ setPosts }: PostPropsInterface) => {
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')

  const transactionServices = new Transaction(algod)
  const userServices = new User({ address: userData.address })

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setInputText(text)
  }

  const getUserCountry = async () => {
    const { data } = await axios.get('https://api.country.is/')
    const { country } = data
    return country
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setPosts({ text: inputText, creator_address: userData.address, status: 'loading' })
    const country = await getUserCountry()
    const note = `${country} - ${inputText}`

    const transaction = await transactionServices.createTransaction(
      userData.address,
      'GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ',
      1000,
      note,
    )

    try {
      userServices.signTransaction({ text: inputText })
      const signedTransactions = await signTransactions([transaction])
      const waitRoundsToConfirm = 4
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      setPosts({ creator_address: userData.address, text: inputText, status: 'accepted', transaction_id: id, country })
    } catch (error) {
      console.error(error)
      setTimeout(() => setPosts({ text: inputText, status: 'denied' }), 1000)
    }
  }
  return (
    <form onSubmit={handleSubmit} action="">
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4">
        <textarea
          maxLength={300}
          onChange={handleChange}
          placeholder="Enter your message"
          className="w-full border-2 border-gray-400 align-top text-start break-all whitespace-normal h-32 p-2 resize-none"
        />
        {activeAccount?.address ? <Button buttonText="Send your message" /> : <Button inactive={true} buttonText="Send message" />}
      </div>
    </form>
  )
}

export default PostInput
