import Button from './Button'

const PostInput = () => {
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    console.log('handlesubmit')
  }
  return (
    <form onSubmit={handleSubmit} action="">
      <div className="p-2 border-2">
        <input type="text" placeholder="Enter your message" className="w-full text-left break-all whitespace-normal h-32 p-2" />
        <Button buttonText="Send your message" />
      </div>
    </form>
  )
}

export default PostInput
