import html2canvas from 'html2canvas'
import { createRoot } from 'react-dom/client'
import { PollCardTweet } from '../components/PollCardTweet'
import { PollRequest } from '../services/api/types'

export const captureVoteCard = async (poll: PollRequest) => {
  console.log('Creating image for poll ID:', poll.pollId)

  try {
    // Create a temporary container element
    const tempContainer = document.createElement('div')
    tempContainer.style.position = 'fixed'
    tempContainer.style.width = '1100px'
    tempContainer.style.height = '300px'
    tempContainer.style.top = '-10000px' // Position it off-screen
    tempContainer.style.left = '-10000px'
    document.body.appendChild(tempContainer)

    console.log('temp container', tempContainer)

    // Create a promise that resolves when the component has rendered
    let renderComplete: () => void = () => {}
    const renderCompletePromise = new Promise<void>((resolve) => {
      renderComplete = resolve
    })

    // Use React 18's createRoot to render the component
    const root = createRoot(tempContainer)
    root.render(<PollCardTweet poll={poll} onRenderComplete={renderComplete} />)

    // Wait for the component to render
    await renderCompletePromise

    // Capture the component using html2canvas
    const canvas = await html2canvas(tempContainer, {
      useCORS: true,
    })

    console.log('Canvas captured:', canvas)

    const imageData = canvas.toDataURL('image/png')

    console.log('Image data created:', imageData)

    // Send the image data to the server
    await fetch(`${import.meta.env.VITE_WECOOP_API}/polls/uploadVoteCardImage/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ image: imageData, pollId: poll.pollId }),
    })

    // Clean up
    root.unmount()
    document.body.removeChild(tempContainer)
  } catch (error) {
    console.error('Error uploading image:', error)
  }
}
