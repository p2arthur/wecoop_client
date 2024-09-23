import { FaMessage } from 'react-icons/fa6'
import { MdThumbUp } from 'react-icons/md'
import { usableAssetsList } from '../../data/usableAssetsList'
import { handleTextPost } from '../PostCard'

interface TopPostCardInterface {
  post: { id: string; text: string; likesCount: number; repliesCount: number; assetId: number | null }
}

export default function TopPostCard({ post }: TopPostCardInterface) {
  const currentPostObj = { ...post, assetImg: usableAssetsList.find((asset) => asset.assetId === post.assetId)?.image }
  return (
    <a
      href={`/post?id=${post.id}`}
      className="w-full flex flex-col p-2 border-2 border-black dark:border-none whitespace-normal bg-white dark:bg-gray-900"
    >
      <p className={'tracking-wide break-words w-full'}>{handleTextPost(post.text)}</p>
      <div className="flex w-full h-7 justify-between items-center py-1">
        <div className="flex gap-2">
          <span className="flex gap-1 items-baseline">
            <p>{post.likesCount}</p> <MdThumbUp />
          </span>
          <span className="flex gap-1 items-baseline">
            <p>{post.repliesCount}</p>
            <FaMessage />
          </span>
        </div>
        <img className="h-full" src={currentPostObj.assetImg} alt="" />
      </div>
    </a>
  )
}
