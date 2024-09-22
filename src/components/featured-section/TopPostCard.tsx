import { Fragment } from 'react'
import { FaMessage } from 'react-icons/fa6'
import { MdThumbUp } from 'react-icons/md'
import { usableAssetsList } from '../../data/usableAssetsList'
import { Post } from '../../services/api/types'

interface TopPostCardInterface {
  post: Post
}

export default function TopPostCard({ post }: TopPostCardInterface) {
  const currentPostObj = { ...post, assetImg: usableAssetsList.find((asset) => asset.assetId === post.assetId)?.image }

  const handleTextPost = (text: string) => {
    const decodedText = decodeURIComponent(text).slice(0, 110)

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
    <a
      href={`/post?id=${post.transaction_id}`}
      className="w-full flex flex-col p-2 border-2 border-black dark:border-none whitespace-normal bg-white dark:bg-gray-900"
    >
      <div>{handleTextPost(post.text)}...</div>
      <div className="flex w-full h-7 justify-between items-center py-1">
        <div className="flex gap-2">
          <span className="flex gap-1 items-baseline">
            <p>{post.likes.length}</p> <MdThumbUp />
          </span>
          <span className="flex gap-1 items-baseline">
            <p>{post.replies.length}</p>
            <FaMessage />
          </span>
        </div>
        <img className="h-full" src={currentPostObj.assetImg} alt="" />
      </div>
    </a>
  )
}
