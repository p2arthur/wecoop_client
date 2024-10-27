import { MdNotifications } from 'react-icons/md'
import Button from './Button'
import { useGetNotificationsByWalletAddress, useMarkAsRead } from '../services/api/Notification'
import { Fragment, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FaExclamation } from 'react-icons/fa'

interface NotificationsProps {
  walletAddress: string
}

export const Notifications = ({ walletAddress }: NotificationsProps) => {
  const { data } = useGetNotificationsByWalletAddress(walletAddress)
  const { mutate } = useMarkAsRead()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)

  const notificationsNotReaded = data?.filter((notification) => !notification.read)

  const handleGoToPolls = (id: string) => {
    mutate({ id })
    navigate('polls?activeTab=prizes')
    setIsOpen(false)
  }

  const handleTextPost = (text: string) => {
    const decodedText = decodeURIComponent(text)

    const urlRegex = /(https?:\/\/[^\s]+)/g

    const parts = decodedText.split(urlRegex)

    return parts.map((part, index) => {
      if (urlRegex.test(part)) {
        return (
          <Fragment key={index}>
            <a href={part} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline break-all">
              {part}
            </a>
          </Fragment>
        )
      }
      return part
    })
  }

  return (
    <div className={'relative'}>
      <Button icon={<MdNotifications />} buttonFunction={() => setIsOpen(!isOpen)} />
      <span className={'absolute top-[-10px] right-[-8px] bg-red-500 text-white py-0.5 px-1.5 text-xs rounded-full'}>
        {notificationsNotReaded?.length}
      </span>
      {isOpen ? (
        <div className=" absolute w-[300px] md:w-[400px] overflow-y-scroll h-[500px] border-2 top-10 flex flex-col gap-1 md:left-[-100px] bg-white border-gray-900 dark:border-gray-100 border-b-4">
          {data
            ?.sort((a, b) => (a.read === b.read ? 0 : a.read ? 1 : -1))
            ?.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleGoToPolls(notification.id)}
                className={
                  'p-4  cursor-pointer flex items-center justify-between w-full bg-gray-300' +
                  ' dark:bg-gray-800 hover:bg-gray-300 hover:dark:bg-gray-800 dark:hover:text-gray-100 ' +
                  'border-t-2 border-gray-900 dark:border-gray-100 '
                }
              >
                <p className={'w-[90%]'}>{handleTextPost(notification.text)}</p>
                {!notification.read && <FaExclamation className={'text-xl'} color={'red'} />}
              </div>
            ))}
        </div>
      ) : null}
    </div>
  )
}
