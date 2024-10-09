import React from 'react'

interface CounterProps {
  count: number
  onIncrement: () => void
  onDecrement: () => void
  max?: number
  min?: number
}

const Counter: React.FC<CounterProps> = ({ count, onIncrement, onDecrement, max }) => {
  return (
    <div className="flex items-center justify-center ">
      <div className="rounded-lg shadow-lg flex items-center space-x-4">
        <button
          onClick={(e) => {
            e.preventDefault()
            onDecrement()
          }}
          disabled={count === 1 || false}
          className="bg-black cursor-pointer dark:bg-white dark:text-black text-4xl leading-6 text-white px-1 rounded-sm hover:bg-red-600"
        >
          -
        </button>
        <span className="text-md font-bold ">{count} days</span>
        <button
          onClick={(e) => {
            e.preventDefault()
            onIncrement()
          }}
          disabled={(max && count >= max) || false}
          className="bg-black cursor-pointer dark:bg-white dark:text-black text-4xl leading-6 text-white px-1 rounded-sm hover:bg-blue-600"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default Counter
