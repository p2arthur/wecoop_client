import { useEffect, useState } from 'react'
import { getUserInfo } from '../../services/api/Users'
import { User } from '../../services/api/types'
import { ellipseAddress } from '../../utils/ellipseAddress'
import { generateIdIcon } from '../ConnectWallet'
import { FaExchangeAlt } from 'react-icons/fa'
import CountUp from 'react-countup'

interface TopCreatorCardInterface {
  topCreator: { creator_address: string; interactions: number }
}

export default function TopCreatorCard({ topCreator }: TopCreatorCardInterface) {
  const [isLoadingUser, setIsLoadingUser] = useState<boolean>(true)
  const [currentCreator, setCurrentCreator] = useState<User>({
    address: '',
    avatar: 'string',
    nfd: {
      name: 'string',
      avatar: 'string',
    },
    balance: { '': 0 },
    followTargets: [],
  })

  const appendCreatorData = async () => {
    setIsLoadingUser(true)
    const user = await getUserInfo(topCreator.creator_address)

    setCurrentCreator(user)
    setIsLoadingUser(false)
  }
  useEffect(() => {
    appendCreatorData()
  }, [])

  if (isLoadingUser)
    return (
      <div className="bg-white dark:bg-gray-900 border-2 border-black p-2 flex gap-2">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img className="bg-gray-100 w-full h-full" src="/images/WeCoop_logo_mascot.svg" />
        </div>
        <div className="flex flex-col">
          <h3 className="font-bold">loading ...</h3>
          <div className="flex items-center gap-2">
            <FaExchangeAlt />
          </div>
        </div>
      </div>
    )

  return (
    <a
      href={`/profile/${currentCreator.address}`}
      className="bg-white dark:bg-gray-900 border-2 border-black p-2 flex gap-2 hover:scale-101"
    >
      <div className="min-w-fit min-h-fit w-10 h-10 rounded-full overflow-hidden">
        <img
          className="bg-gray-100 w-full h-full"
          src={currentCreator.nfd.avatar || generateIdIcon(currentCreator.address)}
          onError={(e) => (e.currentTarget.src = '/images/WeCoop_logo_mascot.svg')}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold">{currentCreator.nfd.name || ellipseAddress(currentCreator.address) || 'loading ...'}</h3>
        <div className="flex items-center gap-2">
          <CountUp end={topCreator.interactions} />
          <FaExchangeAlt />
        </div>
      </div>
    </a>
  )
}
