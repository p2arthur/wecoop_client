import { useWallet } from '@txnlab/use-wallet'
import { useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { SlUserFollow, SlUserUnfollow } from 'react-icons/sl'
import { useOutletContext } from 'react-router-dom'
import { Follow } from '../services/Follow'
import Button from './Button'

interface FollowButtonProps {
  walletAddress: string
}

const FollowButton = ({ walletAddress }: FollowButtonProps) => {
  const { algod, userData } = useOutletContext() as any
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const [buttonState, setButtonState] = useState<'loading' | 'success' | null>(null)
  const handleFollowClick = async (event: React.FormEvent) => {
    event?.preventDefault()
    setButtonState('loading')

    try {
      const followServices = new Follow(algod)

      const encodedGroupedTransactions = await followServices.handleUserFollow({
        subjectUserWalletAddress: walletAddress,
        followerUserWalletAddress: activeAccount?.address!,
      })

      const signedTransactions = await signTransactions(encodedGroupedTransactions)
      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      setButtonState('success')
      console.log(id)
    } catch (error) {
      setButtonState(null)
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleFollowClick}>
      <Button
        buttonText={buttonState == 'loading' ? 'loading' : buttonState == 'success' ? 'unfollow' : 'follow'}
        icon={
          buttonState == 'loading' ? (
            <FaSpinner className="animate-spin" />
          ) : buttonState == 'success' ? (
            <SlUserUnfollow />
          ) : (
            <SlUserFollow />
          )
        }
      />
    </form>
  )
}

export default FollowButton
