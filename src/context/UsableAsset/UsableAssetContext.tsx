import { createContext, useContext, useMemo, useState } from 'react'

export interface UsableAssetInterface {
  name: string
  assetId: number
  image: string
}

type IUsableAssetContext = {
  usableAsset: UsableAssetInterface
  setUsableAsset: (usableAsset: UsableAssetInterface) => void
}

interface IUsableAssetProviderProps {
  children: JSX.Element | JSX.Element[]
}

const UsableAssetContext = createContext<IUsableAssetContext>({
  usableAsset: { name: 'coop', assetId: 1234, image: '' },
  setUsableAsset: (usableAsset: UsableAssetInterface) => {},
})

const UsableAssetProvider = ({ children }: IUsableAssetProviderProps) => {
  const [usableAsset, setUsableAsset] = useState<UsableAssetInterface>({ name: 'coop', assetId: 796425061, image: '/coins/coop_icon.png' })

  const defineUsableAsset = (usableAsset: UsableAssetInterface) => {
    setUsableAsset(usableAsset)
  }

  const usableAssetProviderValues = useMemo(
    () => ({
      usableAsset: usableAsset,
      setUsableAsset: defineUsableAsset,
    }),
    [usableAsset],
  )

  return <UsableAssetContext.Provider value={usableAssetProviderValues}>{children}</UsableAssetContext.Provider>
}

const useUsableAsset = () => useContext(UsableAssetContext)

export { UsableAssetProvider, useUsableAsset }
