import { useEffect, useRef, useState } from 'react'
import { FaArrowUp, FaEye, FaEyeSlash } from 'react-icons/fa'
import { Daum } from '../services/api/types'
import LoaderSpinner from './LoaderSpinner'
import VoteCard from './PollCard'
import PostCard from './PostCard'
import PostInput from './PostInput'

interface FeedPropsInterface {
  postList: Daum[] | null | undefined
  isLoading: boolean
  handleNewReply?: (newReply: Daum, transactionCreatorId: string) => void
  type?: string
}

const FeedComponent = ({ postList, handleNewReply, isLoading, type = 'post' }: FeedPropsInterface) => {
  const [currentPage, setCurrentPage] = useState(1)
  const [showGoToTop, setShowGoToTop] = useState(false)
  const [viewImages, setViewImages] = useState(true)
  const feedContainerRef = useRef<HTMLDivElement | null>(null)
  const postsPerPage = 10

  const handleScroll = () => {
    const container = feedContainerRef.current
    if (container) {
      if (container.scrollTop > 300) {
        setShowGoToTop(true)
      } else {
        setShowGoToTop(false)
      }

      if (!isLoading && container.scrollTop + container.clientHeight + 150 >= container.scrollHeight) {
        setCurrentPage((prevPage) => prevPage + 1)
      }
    }
  }

  const handleSetViewImage = () => {
    setViewImages(!viewImages)
  }

  const scrollToTop = () => {
    feedContainerRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const paginatedPosts: Daum[] | undefined = postList?.slice(0, currentPage * postsPerPage)

  useEffect(() => {
    const container = feedContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [isLoading, postList])

  useEffect(() => {
    if (paginatedPosts && postList && paginatedPosts.length >= postList.length) {
      const container = feedContainerRef.current
      if (container) {
        container.removeEventListener('scroll', handleScroll)
      }
    }
  }, [paginatedPosts, postList])

  if (isLoading) return <LoaderSpinner text={'Loading feed...'} />

  return (
    <div
      ref={feedContainerRef}
      className={`relative ${type === 'post'
        ? 'flex flex-col gap-4 w-full overflow-y-scroll h-full overflow-x-hidden'
        : 'grid grid-cols-3 items-center  overflow-y-scroll gap-4 w-full h-full no-scrollbar overflow-x-hidden pb-24'
        } relative`}
    >
      {showGoToTop && (
        <button
          onClick={scrollToTop}
          className="fixed flex items-center bottom-5 animate-bounce z-50 w-16 h-16 bg-black dark:bg-white dark:text-black left-2/3 font-bold text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          <FaArrowUp />
          <h3>Top</h3>
        </button>
      )}
      <PostInput />
      <div className="w-full bg-white dark:bg-gray-900 p-4">
        <div className="flex gap-2 text-lg items-center">
          {viewImages ? <FaEye onClick={handleSetViewImage} /> : <FaEyeSlash onClick={handleSetViewImage} />}
          <label htmlFor="view-images-switch" className="flex w-full items-center gap-2">
            <p>View images</p>
          </label>
        </div>
      </div>

      {paginatedPosts &&
        paginatedPosts.length > 0 &&
        paginatedPosts.map((post, index) =>
          post.type === 'post' || post.type === 'filepost' ? (
            <PostCard handleSetViewImages={handleSetViewImage} key={index} imagesVisible={viewImages} handleNewReply={handleNewReply} post={post} />
          ) : (
            <VoteCard
              type={type === 'poll' ? 'poll' : 'feed'}
              key={index}
              poll={{
                yesVotes: post.yesVotes || 0,
                voters: post.voters || [],
                expiry_timestamp: post.expiry_timestamp || 0,
                pollId: post.pollId || 0,
                status: 'accepted',
                depositedAmount: post.depositedAmount || 0,
                totalVotes: post.totalVotes || 0,
                ...post,
              }}
            />
          ),
        )}

      {!isLoading && (!postList || postList.length === 0) && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default FeedComponent
