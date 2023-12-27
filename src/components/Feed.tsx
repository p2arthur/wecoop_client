import { useEffect, useState } from 'react'
import { Post } from '../services/api/types'
import LoaderSpinner from './LoaderSpinner'
import PostCard from './PostCard'

interface FeedPropsInterface {
  postList: Post[] | null
  isLoading: boolean
  handleNewReply?: (newReply: Post, transactionCreatorId: string) => void
}

const FeedComponent = ({ postList, handleNewReply, isLoading }: FeedPropsInterface) => {
  const [currentPage, setCurrentPage] = useState(1)

  const handleScroll = () => {
    if (!isLoading && window.innerHeight + window.scrollY + 150 > document.documentElement.offsetHeight) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }
  const postsPerPage = 10

  const paginatedPosts: Post[] = postList?.slice(0, currentPage * postsPerPage)!
  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', () => {})
    }
  }, [postList])

  useEffect(() => {
    if (paginatedPosts && postList) {
      if (paginatedPosts.length >= postList.length) {
        window.removeEventListener('scroll', () => {})
      }
    }
  }, [paginatedPosts])

  if (isLoading) return <LoaderSpinner text={'Loading feed...'} />

  return (
    <div className="flex flex-col gap-4">
      {paginatedPosts?.length! > 0 &&
        paginatedPosts?.map((post, index) => <PostCard key={index} handleNewReply={handleNewReply} post={post} />)}
      {currentPage * postsPerPage >= postList?.length! && !isLoading && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </div>
  )
}

export default FeedComponent
