import {FaShareNodes} from "react-icons/fa6";
import {toast} from "react-toastify";

interface ShareButtonProps {
  id: string
}

export const ShareButton = ({id}: ShareButtonProps) => {

  const handleSharePost = () => {
    navigator.clipboard.writeText(`${window.location.origin}/post?id=${id}`).catch(() => {
      toast('Failed to copy post link to clipboard', {
        position: 'bottom-right',
        className: "black-background",
        bodyClassName: "grow-font-size",
        progressClassName: "fancy-progress-bar",
      })
    })

    toast('Post link copied to clipboard', {
      position: 'bottom-right',
      theme: 'dark'
    })
  }

  return (
    <button
      className={'cursor-pointer rounded-lg gap-1 p-1 hover:bg-gray-900 dark:hover:bg-gray-100 group transition-all flex items-center justify-center'}
      onClick={handleSharePost}>
      <FaShareNodes
        className={'text-xl group-hover:text-gray-100 dark:group-hover:text-gray-900 hover:text-blue-500'}/>
    </button>
  )
}
