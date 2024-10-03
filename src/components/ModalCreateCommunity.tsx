import { useState } from 'react'
import OpenAI from 'openai'
import { FaSpinner } from 'react-icons/fa6'

export const ModalCreateCommunity = ({ isOpen, handleOpen }: { isOpen: boolean; handleOpen(): void }) => {
  const [form, setForm] = useState({
    name: '',
    description: '',
  })
  const [isLoadingGenerateImage, setIsLoadingGenerateImage] = useState(false)
  const [urlImageCommunity, setUrlImageCommunity] = useState('')

  const openai = new OpenAI({
    apiKey: import.meta.env.VITE_OPENAI_API_KEY,
    dangerouslyAllowBrowser: true,
  })
  const generateImage = async () => {
    try {
      setIsLoadingGenerateImage(true)
      const completion = await openai.images.generate({
        model: 'dall-e-3',
        prompt: `Create a pixel art in 8-bit style logo for a community named '${form.name}'. Incorporate elements like circuitry, blockchain symbols, or relevant tech visuals that represent the community's focus. Use neon colors such as purple, blue, and teal to create the logo. The logo should fit a 150x150px format, in 8-bit style, and convey the purpose of the community, which is '${form.description}'. Keep the design simple but distinct to represent a web3-focused group. Dont need any text in the logo.`,
      })

      if (completion.data[0]?.url) {
        setUrlImageCommunity(completion.data[0]?.url)
      }
      setIsLoadingGenerateImage(false)
    } catch (e) {
      console.log(e)
      setIsLoadingGenerateImage(false)
    }
  }

  if (isOpen) {
    return (
      <div className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex justify-center items-center" onClick={handleOpen}>
        <div className=" bg-white dark:bg-gray-900 p-4 rounded-lg" onClick={(e) => e.stopPropagation()}>
          <h1 className="text-2xl text-center mb-5">Create Community</h1>
          <form className={'flex flex-wrap gap-5'}>
            <div className={'w-full'}>
              <input
                type="text"
                autoComplete={'off'}
                placeholder="Type a name for the community"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 border-2 border-black dark:border-none dark:text-black"
              />
              <p className="text-right text-sm text-gray-500 dark:text-gray-400">
                <span>Max. 30 characters</span>
              </p>
            </div>
            <div className={'w-full'}>
              <input
                type="text"
                autoComplete={'off'}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Make a simple description for your community"
                className="w-full p-2 h-16 border-2 border-black dark:border-none dark:text-black "
              />
              <p className="text-right text-sm text-gray-500 dark:text-gray-400">
                <span>Max. 90 characters</span>
              </p>
            </div>
            <div className={'w-full justify-center text-center'}>
              {isLoadingGenerateImage ? (
                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded text-center" disabled>
                  Generating image... <FaSpinner className="w-6 animate-spin" />
                </button>
              ) : urlImageCommunity.length === 0 ? (
                <button onClick={generateImage} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                  Generate Image
                </button>
              ) : (
                <div>
                  <button
                    onClick={() => {
                      setUrlImageCommunity(''), generateImage()
                    }}
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Regenerate Image
                  </button>
                  <h1 className="text-center text-sm text-gray-500 dark:text-gray-400 my-2">Image generated! Check below:</h1>
                </div>
              )}
            </div>
            <div className={'w-full flex justify-center'}>
              {!isLoadingGenerateImage && urlImageCommunity.length > 0 && (
                <img src={urlImageCommunity} alt="" className="w-[250px] h-[250px]" />
              )}
            </div>

            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Create</button>
          </form>
        </div>
      </div>
    )
  }
  return <></>
}
