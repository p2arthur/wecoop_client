import { FaX } from 'react-icons/fa6'

type FileUploadedProps = {
  url: string
  handleRemoveFile: () => void
}
export const FileUploaded = ({ url, handleRemoveFile }: FileUploadedProps) => {
  return (
    <div className={'relative flex self-center'}>
      <img className={'w-[500px] h-auto rounded-2xl '} src={url} alt={'Image uploaded from user'} />
      <button className={'absolute top-2 right-2 hover:bg-red-400  p-2 rounded-full'} onClick={handleRemoveFile}>
        <FaX />
      </button>
    </div>
  )
}
