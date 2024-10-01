import { useEffect, useRef, useState } from 'react'
import { Post, PostRequest } from '../services/api/types'
import LoaderSpinner from './LoaderSpinner'
import PostCard from './PostCard'
import VoteCard from './VoteCard'

interface FeedPropsInterface {
  postList: Post[] | null | undefined
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

  const paginatedPosts: Post[] | undefined = postList?.slice(0, currentPage * postsPerPage)

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
  // {paginatedPosts && paginatedPosts.length > 0 && <VoteCard vote={paginatedPosts[0]} />}

  return (
    <div ref={feedContainerRef} className="flex flex-col gap-4 w-full overflow-y-scroll h-full  no-scrollbar">
      {paginatedPosts &&
        paginatedPosts.length > 0 &&
        paginatedPosts.map((post, index) =>
          post.type == 'post' ? (
            <PostCard key={index} handleNewReply={handleNewReply} post={post} />
          ) : (
            <VoteCard key={index} vote={post as PostRequest} />
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
