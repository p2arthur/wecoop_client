import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import { FaSpinner } from 'react-icons/fa6'
import { RiUserFollowFill, RiUserUnfollowFill } from 'react-icons/ri'
import { useOutletContext } from 'react-router-dom'
import { Follow } from '../services/Follow'
import Button from './Button'

interface FollowButtonProps {
  walletAddress: string
  isFollowing: boolean
}

const FollowButton = ({ walletAddress, isFollowing }: FollowButtonProps) => {
  const { algod, userData } = useOutletContext() as any
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const [buttonState, setButtonState] = useState<'loading' | 'success' | null>(null)
  const followServices = new Follow(algod)

  useEffect(() => {
    isFollowing ? setButtonState('success') : setButtonState(null)
  }, [isFollowing])

  const handleFollowClick = async () => {
    event?.preventDefault()
    setButtonState('loading')

    try {
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

  const handleUnfollowClick = async () => {
    event?.preventDefault()
    setButtonState('loading')

    try {
      const encodedUnsignedTransaction = await followServices.handleUserUnfollow({ subjectUserWalletAddress: walletAddress })

      const signedTransactions = await signTransactions(encodedUnsignedTransaction)
      const waitRoundsToConfirm = 4

      const { id } = await sendTransactions(signedTransactions, waitRoundsToConfirm)
      setButtonState(null)
      console.log(id)
    } catch (error) {
      setButtonState(null)
      console.error(error)
    }
  }

  return (
    <form onSubmit={handleFollowClick}>
      {buttonState == 'success' && <Button buttonText="unfollow" buttonFunction={handleUnfollowClick} icon={<RiUserUnfollowFill />} />}
      {buttonState === 'loading' && (
        <Button buttonText="loading" buttonFunction={handleFollowClick} icon={<FaSpinner className="animate-spin" />} />
      )}
      {buttonState == null && <Button buttonText="Follow" buttonFunction={handleFollowClick} icon={<RiUserFollowFill />} />}
    </form>
  )
}

export default FollowButton
