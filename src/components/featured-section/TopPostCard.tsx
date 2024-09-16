import { Fragment } from 'react'
import { Post } from '../../services/api/types'

interface TopPostCardInterface {
  post: Post
}

export default function TopPostCard(post: TopPostCardInterface) {
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
      href={`/post?id=${post.post.transaction_id}`}
      className="w-full p-2 border-2 border-black dark:border-none whitespace-normal bg-white dark:bg-gray-900"
    >
      {handleTextPost(post.post.text)}...
    </a>
  )
}
