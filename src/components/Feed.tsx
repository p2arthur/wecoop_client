import PostCard from './PostCard'
import { Post } from '../services/api/types'
import { useEffect, useState } from 'react'
import LoaderSpinner from './LoaderSpinner'

interface FeedPropsInterface {
  postList: Post[] | null
  isLoading: boolean
  handleNewReply?: (newReply: Post, transactionCreatorId: string) => void
}

const FeedComponent = ({ postList, handleNewReply, isLoading }: FeedPropsInterface) => {
  const [currentPage, setCurrentPage] = useState(1)
  const postsPerPage = 10

  const paginatedPosts = postList?.slice(0, currentPage * postsPerPage)

  const handleScroll = () => {
    if (!isLoading && window.innerHeight + document.documentElement.scrollTop === document.documentElement.offsetHeight) {
      setCurrentPage((prevPage) => prevPage + 1)
    }
  }

  useEffect(() => {
    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [isLoading])

  useEffect(() => {
    if (currentPage * postsPerPage >= postList?.length!) {
      setCurrentPage(1)
    }
  }, [currentPage, postList, postsPerPage])

  if (isLoading) return <LoaderSpinner text={'Loading feed...'} />

  return (
    <>
      {paginatedPosts?.length! > 0 &&
        paginatedPosts?.map((post) => <PostCard key={post.transaction_id} handleNewReply={handleNewReply} post={post} />)}
      {currentPage * postsPerPage >= postList?.length! && !isLoading && (
        <div className={'w-full justify-center flex'}>
          <p className="font-bold text-2xl">You're all caught up!</p>
        </div>
      )}
    </>
  )
}

export default FeedComponent
