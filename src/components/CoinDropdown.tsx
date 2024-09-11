import { FaAngleDown } from 'react-icons/fa6'
import { usableAssetsList } from '../data/usableAssetsList'
import { UsableAssetInterface } from '../context/UsableAsset/UsableAssetContext'
import { useOutletContext } from 'react-router-dom'
import { PostInputOutletContext } from './PostInput'

type CoinDropdownProps = {
  usableAsset: UsableAssetInterface
  handleAssetSelect: (asset: any) => void
  selectedAsset: UsableAssetInterface
  selectorOpen: boolean
}

export const CoinDropdown = ({ usableAsset, selectedAsset, handleAssetSelect, selectorOpen }: CoinDropdownProps) => {
  const { userData } = useOutletContext() as PostInputOutletContext
  return (
    <div className="flex gap-1">
      <div className="relative">
        <div
          className="px-2 border-2 border-black dark:border-white border-b-4 cursor-pointer flex items-center gap-8"
          onClick={() => handleAssetSelect(selectedAsset)}
        >
          <div className="flex gap-2 items-center">
            <div className="rounded-full overflow-hidden border-b-4 border-black dark:border-white ">
              <img
                className="h-6 w-6"
                src={`https://asa-list.tinyman.org/assets/${usableAsset.assetId}/icon.png`}
                alt={usableAsset.name}
                onError={(e) => (e.currentTarget.src = usableAsset.image)}
              />
            </div>
            <span className="font-bold">{usableAsset.name}</span>
          </div>
          <FaAngleDown />
        </div>
        {selectorOpen && (
          <ul className="absolute overflow-x-hidden bg-white dark:bg-gray-900 border-2 border-black  border-b-4 mt-2 w-56 dark:border-gray-500 -translate-x-1/2 left-3/4 md:left-1/2 z-10 max-h-64 overflow-y-auto select-none">
            {usableAssetsList.map((asset) => (
              <li
                key={asset.assetId}
                className="flex items-center justify-between px-2 py-2 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105"
                onClick={() => handleAssetSelect(asset)}
              >
                <div className="flex gap-1 items-center">
                  <div className="rounded-full overflow-hidden border-b-4 border-black dark:border-white hover:scale-110">
                    <img
                      className="h-6 w-6"
                      src={`https://asa-list.tinyman.org/assets/${asset.assetId}/icon.png`}
                      alt={asset.name}
                      onError={(e) => (e.currentTarget.src = asset.image)}
                    />
                  </div>
                  <span className="text-sm">{asset.name}</span>
                </div>
                <span className="text-sm">{userData.balance[asset.assetId] || 0}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
