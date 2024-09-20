import React from 'react'
import { usePosts } from '../context/Posts/Posts'

export const PostTypeSwitch = () => {
  const { postType, handleChangePostType } = usePosts()

  return (
    <div
      className={'flex md:justify-between items-center gap-2'}
      onClick={() => {
        handleChangePostType(postType === 'post' ? 'vote' : 'post')
      }}
    >
      <span className={`text-sm ${postType === 'post' && 'font-bold'}`}>post</span>
      <button
        onClick={() => {
          handleChangePostType(postType === 'post' ? 'vote' : 'post')
        }}
        className="p-0.5 border-2 border-black switch-theme flex items-center "
      >
        <span className={`w-2 h-2 ${postType === 'post' && 'bg-black'}`} />
        <span className={`w-2 h-2 ${postType === 'vote' && 'bg-black'}`} />
      </button>
      <span className={`text-sm ${postType === 'vote' && 'font-bold'}`}>vote</span>
    </div>
  )
}
