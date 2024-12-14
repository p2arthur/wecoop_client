import React from 'react'
import { FaAngleDown } from 'react-icons/fa6'
import { useOutletContext } from 'react-router-dom'
import { UsableAssetInterface } from '../context/UsableAsset/UsableAssetContext'
import { usableAssetsList } from '../data/usableAssetsList'
import { PostInputOutletContext } from './PostInput'

type CoinDropdownProps = {
  usableAsset: UsableAssetInterface
  handleAssetSelect: (asset: any) => void
  selectedAsset: UsableAssetInterface
  selectorOpen: boolean
  setSelectorOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const CoinDropdown = ({ usableAsset, selectedAsset, setSelectorOpen, handleAssetSelect, selectorOpen }: CoinDropdownProps) => {
  const { userData } = useOutletContext() as PostInputOutletContext

  return (
    <div className="flex gap-1">
      <div className="relative">
        <div
          className="px-2 border-2 border-black dark:border-white border-b-4 cursor-pointer flex items-center gap-8"
          onClick={() => setSelectorOpen(!selectorOpen)}
        >
          <div className="flex gap-2 items-center">
            <div className="rounded-full overflow-hidden border-b-4 border-black my-0.5 dark:border-white ">
              <img
                className="w-8"
                src={usableAsset.image}
                alt={usableAsset.name}
                onError={(e) => (e.currentTarget.src = usableAsset.image)}
              />
            </div>
            <span className="font-bold text-xl">{usableAsset.name}</span>
          </div>
          <FaAngleDown />
        </div>
        {selectorOpen && (
          <ul
            className="absolute bg-white dark:bg-gray-900 border-2 border-black  border-b-4 mt-2 w-64 dark:border-gray-500 md:-left-0 z-50
          max-h-64 overflow-y-auto select-none -translate-x-1/2"
          >
            {usableAssetsList.map((asset) => (
              <li
                key={asset.assetId}
                className="flex items-center justify-between px-2 py-2 cursor-pointer dark:hover:bg-gray-800 hover:bg-gray-200 hover:scale-105"
                onClick={() => handleAssetSelect(asset)}
              >
                <div className="flex gap-1 items-center">
                  <div className="rounded-full overflow-hidden border-b-4 border-black dark:border-white hover:scale-110">
                    <img className="h-8 w-8" src={asset.image} alt={asset.name} onError={(e) => (e.currentTarget.src = asset.image)} />
                  </div>
                  <span className="text-lg">{asset.name}</span>
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
