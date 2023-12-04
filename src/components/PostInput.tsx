import { useWallet } from '@txnlab/use-wallet'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useOutletContext } from 'react-router-dom'
import { Transaction } from '../services/Transaction'
import { User, UserInterface } from '../services/User'
import Button from './Button'

interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

const PostInput = () => {
  const { signTransactions, sendTransactions } = useWallet()
  const { algod, userData } = useOutletContext() as PostInputOutletContext

  console.log('algod', algod)
  console.log(userData)
  const transactionServices = new Transaction(algod)
  const userServices = new User({ address: userData.address })

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    console.log('handlesubmit')
    const transaction = await transactionServices.createTransaction(
      userData.address,
      'GYET4OG2L3PIMYSEJV5GNACHFA6ZHFJXUOM7NFR2CDFWEPS2XJRTS45YMQ',
      1000,
      'This is the first true post on SCOOP',
    )
    try {
      const signedTransactions = await signTransactions([transaction])
      console.log('transaction signed', signedTransactions)
      const waitRoundsToConfirm = 4
      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      console.log('Transaction id', id)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <form onSubmit={handleSubmit} action="">
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4">
        <input type="text" placeholder="Enter your message" className="w-full border-2 text-left break-all whitespace-normal h-32 p-2" />
        <Button buttonText="Send your message" />
      </div>
    </form>
  )
}

export default PostInput
