import { useState } from 'react'
import { ModalCreateCommunity } from '../components/ModalCreateCommunity'

type CommunityProps = {
  name: string
  description: string
  image: string
}

const communityMocks = [
  {
    name: 'Community 1',
    description: 'This is the first community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 2',
    description: 'This is the second community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 3',
    description: 'This is the third community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 4',
    description: 'This is the fourth community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 5',
    description: 'This is the fifth community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 6',
    description: 'This is the sixth community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 7',
    description: 'This is the seventh community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 8',
    description: 'This is the eighth community',
    image: 'https://via.placeholder.com/150',
  },
  {
    name: 'Community 9',
    description: 'This is the ninth community',
    image: 'https://via.placeholder.com/150',
  },
]
const Community = ({ name, description, image }: CommunityProps) => {
  return (
    <div className="flex align-center gap-2 w-full  bg-white dark:bg-gray-900 p-4 border-2 border-black dark:border-none">
      <img src={image} alt="" className="h-36 w-36" />
      <div>
        <h2 className="text-2xl">{name}</h2>
        <p className="text-sm">{description}</p>
      </div>
    </div>
  )
}

const ButtonCreateCommunity = ({ onClick }: { onClick(): void }) => {
  return (
    <div className={'fixed left-1/2 bottom-0 transform -translate-x-1/2 mb-8'}>
      <button
        onClick={onClick}
        className="animate-bounce bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-8 rounded text-2xl dark:border-2 dark:border-white hover:dark:text-white"
      >
        Create Community
      </button>
    </div>
  )
}

const InputImage = () => {
  return (
    <div className="flex items-center justify-center w-full">
      <label
        htmlFor="dropzone-file"
        className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg
            className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 16"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
            />
          </svg>
          <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
            <span className="font-semibold">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG or GIF (MAX. 150x150px)</p>
        </div>
        <input id="dropzone-file" type="file" className="hidden" />
      </label>
    </div>
  )
}

export const CommunityPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleOpen = () => {
    setIsModalOpen(!isModalOpen)
  }

  return (
    <div className="grid relative pt-24 dark:bg-gray-950 bg-gray-100 overflow-hidden max-h-screen w-full overflow-y-scroll justify-center ">
      <h1 className={'text-4xl underline text-center '}>Communities</h1>
      <div className={'grid grid-cols-3 gap-6 my-6'}>
        {communityMocks.map((community) => (
          <Community name={community.name} description={community.description} image={community.image} />
        ))}
      </div>
      <ButtonCreateCommunity onClick={() => setIsModalOpen(!isModalOpen)} />
      <ModalCreateCommunity handleOpen={handleOpen} isOpen={isModalOpen} />
    </div>
  )
}
