import { usePosts } from '../context/Posts/Posts'

export const PostTypeSwitch = () => {
  const { postType, handleChangePostType } = usePosts()

  return (
    <div
      className={'flex md:justify-between items-center gap-2'}
      onClick={() => {
        handleChangePostType(postType === 'post' ? 'poll' : 'post')
      }}
    >
      <span className={`text-sm ${postType === 'post' && 'font-bold'}`}>post</span>
      <button
        type="button"
        onClick={() => {
          handleChangePostType(postType === 'post' ? 'poll' : 'post')
        }}
        className="p-0.5 border-2 border-black switch-theme flex items-center "
      >
        <span className={`w-2 h-2 ${postType === 'post' && 'bg-black'}`} />
        <span className={`w-2 h-2 ${postType === 'poll' && 'bg-black'}`} />
      </button>
      <span className={`text-sm ${postType === 'poll' && 'font-bold'}`}>poll</span>
    </div>
  )
}
