import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useEffect, useState } from 'react'
import { FaAngleDown, FaArrowRight } from 'react-icons/fa6'
import { useOutletContext, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { usePosts } from '../context/Posts/Posts'
import { useUsableAsset } from '../context/UsableAsset/UsableAssetContext'
import { usableAssetsList } from '../data/usableAssetsList'
import { NotePrefix } from '../enums/notePrefix'
import { Transaction } from '../services/Transaction'
import { User as UserInterface } from '../services/api/types'
import { getUserCountry } from '../utils/userUtils'
import Button from './Button'

export interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

const PostInput = () => {
  const { assetId } = useParams<{ assetId: string }>()
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const { handleAddNewPost, handleDeletePost } = usePosts()
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState(usableAssetsList[0])
  const [selectorOpen, setSelectorOpen] = useState(false)

  const { usableAsset, setUsableAsset } = useUsableAsset()

  useEffect(() => {
    const foundAsset = usableAssetsList.find((asset) => asset.assetId == Number(assetId))

    if (!foundAsset) return

    setUsableAsset(foundAsset)
  }, [usableAsset])

  const handleAssetSelect = (asset: any) => {
    setSelectorOpen(!selectorOpen)
    setUsableAsset(asset)
  }

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = event.target.value
    setInputText(text)
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    const country = await getUserCountry()
    handleAddNewPost({
      text: inputText,
      creator_address: userData.address,
      status: 'loading',
      timestamp: new Date().getDate(),
      country: country,
      replies: [],
      likes: [],
      transaction_id: 'loading_id',
    })
    const encodedInputText = encodeURIComponent(inputText)
    const note = `${NotePrefix.WeCoopPost}${country}:${encodedInputText}`

    try {
      const transaction = await new Transaction(algod).createTransaction(
        userData.address,
        import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
        100000,
        note,
      )

      const signedTransactions = await signTransactions([algosdk.encodeUnsignedTransaction(transaction)])
      const { id } = await sendTransactions(signedTransactions, 4)
      handleDeletePost('loading_id')
      handleAddNewPost({
        creator_address: userData.address,
        text: inputText,
        status: 'accepted',
        transaction_id: id,
        country,
        timestamp: new Date().getDate(),
        replies: [],
        likes: [],
      })
    } catch (error) {
      console.error(error)
      setTimeout(() => {
        handleDeletePost('loading_id')
        handleAddNewPost({
          text: inputText,
          creator_address: userData.address,
          status: 'rejected',
          timestamp: new Date().getDate(),
          transaction_id: uuidv4(),
          replies: [],
          country,
          likes: [],
        })
      }, 1000)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="p-2 border-2 border-gray-900 flex flex-col gap-3 items-end border-b-4 dark:border-gray-500 bg-gray-100 dark:bg-gray-900">
        <div className="w-full relative">
          <textarea
            maxLength={300}
            onChange={handleChange}
            placeholder="Write your post"
            className="w-full border-2  align-top text-start break-all whitespace-normal h-32 p-2 resize-none z-20 focus:scale-101 focus:border-b-4 dark:border-gray-600 border-gray-900 focus:outline-gray-500"
          />
          <div className="absolute right-5 bottom-2">{`${inputText.length}/300`}</div>
        </div>
        <div>
          <div className="flex items-center text-red-600 gap-1">
            <FaArrowRight />
            <p className="w-full">Note: All posts and interactions are permanently recorded on the Algorand blockchain.</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {/* Custom Dropdown */}
            <div className="relative">
              <div
                className="px-2 py-1 border-2 border-black border-b-4 cursor-pointer flex items-center gap-8"
                onClick={() => handleAssetSelect(selectedAsset)}
              >
                <div className="flex gap-2">
                  <img
                    className="h-5 w-5"
                    src={`https://asa-list.tinyman.org/assets/${usableAsset.assetId}/icon.png`}
                    alt={usableAsset.name}
                  />
                  <span className="font-bold">{usableAsset.name}</span>
                </div>
                <FaAngleDown />
              </div>
              {selectorOpen && (
                <ul className="absolute bg-white border-2 border-black border-b-4 mt-2 w-full z-10 max-h-64 overflow-y-auto select-none">
                  {usableAssetsList.map((asset) => (
                    <li
                      key={asset.assetId}
                      className="flex items-center justify-between px-2 py-2 cursor-pointer hover:bg-gray-200"
                      onClick={() => handleAssetSelect(asset)}
                    >
                      <div className="flex gap-1 items-center">
                        <img className="h-6 w-6" src={`https://asa-list.tinyman.org/assets/${asset.assetId}/icon.png`} alt={asset.name} />
                        <span className="text-sm">{asset.name}</span>
                      </div>
                      <span className="text-sm">{userData.balance || 0}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
          {activeAccount?.address && inputText !== '' && inputText.length <= 300 && userData.balance! > 0.1 ? (
            <Button buttonText="Send your message" />
          ) : (
            <Button inactive={true} buttonText="Send your message" />
          )}
        </div>
      </div>
    </form>
  )
}

export default PostInput
