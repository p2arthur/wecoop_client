import { FaX } from 'react-icons/fa6'
import React from 'react'

type FileUploadedProps = {
  url: string
  handleRemoveFile: () => void
  loadingText?: string
}
export const FileUploaded = ({ url, handleRemoveFile, loadingText }: FileUploadedProps) => {
  return (
    <div className={'relative self-center'}>
      <img className={'w-[500px] h-auto rounded-2xl '} src={url} alt={'Image uploaded from user'} />
      <button className={'absolute top-2 right-2 hover:bg-red-400  p-2 rounded-full'} onClick={handleRemoveFile}>
        <FaX />
      </button>
      {loadingText && loadingText?.length > 0 && <div className="text-center">{loadingText}</div>}
    </div>
  )
}
