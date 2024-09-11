import { useEffect, useState } from 'react'
import { FaRegThumbsUp } from 'react-icons/fa6'
import { getUserInfo } from '../../services/api/Users'
import { User } from '../../services/api/types'
import { ellipseAddress } from '../../utils/ellipseAddress'
import { generateIdIcon } from '../ConnectWallet'

interface TopCreatorCardInterface {
  topCreator: { creatorAddress: string; likesCount: number }
}

export default function TopCreatorCard({ topCreator }: TopCreatorCardInterface) {
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
    const user = await getUserInfo(topCreator.creatorAddress)

    setCurrentCreator(user)
  }
  useEffect(() => {
    appendCreatorData()
  }, [])

  return (
    <a href={`/profile/${currentCreator.address}`} className="bg-white border-2 border-black p-2 flex gap-2 hover:scale-101">
      <div className="w-10 h-10 rounded-full overflow-hidden">
        <img
          className="bg-gray-100 w-full h-full"
          src={currentCreator.nfd.avatar || generateIdIcon(currentCreator.address)}
          onError={(e) => (e.currentTarget.src = '/images/WeCoop_logo_mascot.svg')}
        />
      </div>
      <div className="flex flex-col">
        <h3 className="font-bold">{currentCreator.nfd.name || ellipseAddress(currentCreator.address) || 'loading ...'}</h3>
        <div className="flex gap-2">
          <p>{topCreator.likesCount}</p>
          <FaRegThumbsUp />
        </div>
      </div>
    </a>
  )
}
