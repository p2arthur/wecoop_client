import { useEffect, useRef, useState } from 'react'
import { Daum, Post } from '../services/api/types'
import LoaderSpinner from './LoaderSpinner'
import VoteCard from './PollCard'
import PostCard from './PostCard'

interface FeedPropsInterface {
  postList: Daum[] | null | undefined
  isLoading: boolean
  handleNewReply?: (newReply: Post, transactionCreatorId: string) => void
}

const FeedComponent = ({ postList, handleNewReply, isLoading }: FeedPropsInterface) => {
  const [currentPage, setCurrentPage] = useState(1)
  const feedContainerRef = useRef<HTMLDivElement | null>(null)
  const postsPerPage = 10

  const handleScroll = () => {
    const container = feedContainerRef.current
    if (container && !isLoading && container.scrollTop + container.clientHeight + 150 >= container.scrollHeight) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  const paginatedPosts: Daum[] | undefined = postList?.slice(0, currentPage * postsPerPage)

  console.log(paginatedPosts, 'paginatedPosts')

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
    <div ref={feedContainerRef} className="flex flex-col gap-4 w-full overflow-y-scroll h-full no-scrollbar overflow-x-hidden">
      {paginatedPosts &&
        paginatedPosts.length > 0 &&
        paginatedPosts.map((post, index) =>
          post.type === 'post' ? (
            <PostCard key={index} handleNewReply={handleNewReply} post={post} />
          ) : (
            <VoteCard key={index} poll={post} />
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
