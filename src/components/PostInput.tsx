import { useWallet } from '@txnlab/use-wallet'
import algosdk from 'algosdk'
import AlgodClient from 'algosdk/dist/types/client/v2/algod/algod'
import { useEffect, useState } from 'react'
import { FaArrowsRotate, FaCircleInfo } from 'react-icons/fa6'
import { useNavigate, useOutletContext, useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import { usePosts } from '../context/Posts/Posts'
import { useUsableAsset } from '../context/UsableAsset/UsableAssetContext'
import { usableAssetsList } from '../data/usableAssetsList'
import { NotePrefix } from '../enums/notePrefix'
import { Transaction } from '../services/Transaction'
import { User as UserInterface } from '../services/api/types'
import { getFeePriceByAsset, InteractionMultipliers } from '../utils/interaction_pricing/getFeePriceByAsset'
import { splitFeeByInteractionType } from '../utils/interaction_pricing/splitFeeByInteractionType'
import { getUserCountry } from '../utils/userUtils'
import Button from './Button'
import { CoinDropdown } from './CoinDropdown'

export interface PostInputOutletContext {
  algod: AlgodClient
  userData: UserInterface
}

const PostInput = () => {
  const { usableAssetId } = useParams<{ usableAssetId: string }>()
  const { signTransactions, sendTransactions, activeAccount } = useWallet()
  const { handleAddNewPost, handleDeletePost, handleRefreshPosts } = usePosts()
  const [openTooltip, setOpenTooltip] = useState(false)
  const { algod, userData } = useOutletContext() as PostInputOutletContext
  const [inputText, setInputText] = useState<string>('')
  const [selectedAsset, setSelectedAsset] = useState(usableAssetsList[0])
  const [selectorOpen, setSelectorOpen] = useState(false)
  const navigate = useNavigate()

  const { usableAsset, setUsableAsset } = useUsableAsset()

  useEffect(() => {
    const foundAsset = usableAssetsList.find((asset) => asset.assetId == Number(usableAssetId))

    if (!foundAsset) return

    setUsableAsset(foundAsset)
  }, [usableAsset])

  const handleAssetSelect = (asset: any) => {
    // navigate(`/global/${asset.assetId}`)
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

    // Calculate the fee price based on the asset
    const feePrice = await getFeePriceByAsset(usableAsset.assetId, InteractionMultipliers.Post)

    // Split the fee by interaction type
    const splitFee = splitFeeByInteractionType({ totalFee: feePrice, type: 'post' })

    // Example calculation to ensure platformFee is used as an integer
    const finalFeeForTransaction = Math.floor(splitFee.platformFee * 1000 * 1000) // ensure this is an integer

    console.log('fee final', finalFeeForTransaction)
    const encodedInputText = encodeURIComponent(inputText)
    const note = `${NotePrefix.WeCoopPost}${country}:${encodedInputText}`

    try {
      const transaction = await new Transaction(algod).createTransaction(
        userData.address,
        import.meta.env.VITE_WECOOP_MAIN_ADDRESS as string,
        finalFeeForTransaction,
        note,
        usableAsset.assetId,
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
        isPersonalized: {},
        assetId: usableAsset.assetId,
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
          isPersonalized: {},
          assetId: usableAsset.assetId,
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
        </div>ar
        
        <div className="grid gap-4  w-full justify-end">
          <div className={'flex gap-4 '}>
            <CoinDropdown
              usableAsset={usableAsset}
              handleAssetSelect={handleAssetSelect}
              selectedAsset={selectedAsset}
              selectorOpen={selectorOpen}
            />
            <Button buttonFunction={handleRefreshPosts} type={'button'} buttonText="Refresh" icon={<FaArrowsRotate />} />
          </div>
          <div className={'flex justify-end items-center gap-4'}>
            <div className={'relative'}>
              <Button icon={<FaCircleInfo />} buttonFunction={() => setOpenTooltip(!openTooltip)} />
              {openTooltip && (
                <div
                  className={
                    'absolute translate-x-1/2 top-8 w-48 right-0 border-2 border-gray-900\n' +
                    'p-1  bg-white font-bold\n' +
                    'hover:bg-gray-200 active:bg-gray-300 flex items-center dark:border-gray-100 dark:text-gray-100 gap-2 border-b-4 active:border-b-transparent active:translate-y-px dark:border-b-4 dark:hover:bg-gray-800 dark:hover:text-gray-100 text-sm md:text-md'
                  }
                >
                  <p className={'text-red-600 text-center'}>
                    Note: All posts and interactions are permanently recorded on the Algorand blockchain.
                  </p>
                </div>
              )}
            </div>
            {activeAccount?.address && inputText !== '' && inputText.length <= 300 && userData.balance[selectedAsset.assetId] > 0.1 ? (
              <Button buttonText="Send your message" full justify={'center'} />
            ) : (
              <Button inactive={true} buttonText="Send your message" full justify={'center'} />
            )}
          </div>
        </div>
      </div>
    </form>
  )
}

export default PostInput
