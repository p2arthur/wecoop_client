import { createContext, useContext, useMemo, useState } from 'react'

type IMobileSidebarContext = {
  isOpen: boolean
  openSidebar: () => void
  closeSidebar: () => void
}

interface IMobileSidebarProviderProps {
  children: JSX.Element | JSX.Element[]
}

const MobileSidebarContext = createContext<IMobileSidebarContext>({
  isOpen: true,
  openSidebar: () => {
    return
  },
  closeSidebar: () => {
    return
  },
})

const MobileSidebarProvider = ({ children }: IMobileSidebarProviderProps) => {
  const [isOpen, setIsOpen] = useState(false)

  const openSidebar = () => {
    setIsOpen(true)
  }

  const closeSidebar = () => {
    setIsOpen(false)
  }

  const sidebarProviderValues = useMemo(
    () => ({
      isOpen,
      openSidebar,
      closeSidebar,
    }),
    [isOpen],
  )

  return <MobileSidebarContext.Provider value={sidebarProviderValues}>{children}</MobileSidebarContext.Provider>
}

const useMobileSidebar = () => useContext(MobileSidebarContext)

export { MobileSidebarProvider, useMobileSidebar }
