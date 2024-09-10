import { User as UserInterface } from '../../services/api/types'
import { useWallet } from '@txnlab/use-wallet'
import { useEffect, useState } from 'react'
import { User } from '../../services/User'
import { minidenticon } from 'minidenticons'

interface ProfileMenuProps {
  user: UserInterface
}

export const ProfileMenu = () => {
  const { activeAccount } = useWallet()
  const [isLoadingUserData, setIsLoadingUserData] = useState<boolean>(false)

  const [userData, setUserData] = useState<UserInterface>({
    address: '',
    avatar: 'string',
    nfd: {
      name: '',
      avatar: '',
    },
    balance: 0,
    followTargets: [],
  })

  useEffect(() => {
    setIsLoadingUserData(true)

    async function appendUserData() {
      const userServices = new User({
        address: activeAccount?.address ?? '',
        avatar: '',
        nfd: { name: '', avatar: '' },
        balance: 0,
        followTargets: [],
      })
      const userData = await userServices.setUser(activeAccount?.address || '')
      setUserData(userData)
    }

    if (activeAccount) {
      appendUserData()
      setIsLoadingUserData(false)
    }
    setIsLoadingUserData(false)
  }, [activeAccount])

  const generateIdIcon = (creatorAddress: string) => {
    return `data:image/svg+xml;utf8,${encodeURIComponent(minidenticon(creatorAddress))}`
  }

  return (
    <div className={'w-2/6 p-4'}>
      <div className={'grid gap-5 justify-center'}>
        <div className="w-full text-center flex flex-col gap-2">
          <div>
            Made by{' '}
            <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://twitter.com/iam_p2">
              @iam_p2
            </a>{' '}
            and{' '}
            <a className="underline text-blue-700 hover:text-blue-500" target="_blank" href="https://github.com/FelipeQueiroz">
              Felipe
            </a>
          </div>
          <a href="/about">
            <p className="text-blue-700 underline">About the app</p>
          </a>
          <p className="text-xs text-gray-500">$COOP is not responsible for any post created on the platform</p>
          <div className="flex gap-2 items-center justify-center">
            <p>powered by</p>
            <a target="_blank" href="https://www.algorand.foundation/">
              <img className="h-12 dark:hidden" src="/images/algorand_logo.png" alt="algorand-logo" />
              <img className="h-6 hidden dark:flex" src="/images/algorand_logo_white.png" alt="algorand-logo" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
