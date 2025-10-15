import React from 'react'

function Auction() {
  return (
    <div className='flex bg-white w-full p-4'>
      <h2></h2>
      {/* Row with title and + button */}
      <div className='flex justify-between items-center w-full'>
        <h2 className='font-bold text-lg'>Auction here</h2>

        <input
          type="button"
          className='bg-blue-700 px-5 py-4 mr-2 rounded-xl text-white text-xl'
          value="+"
        />
      </div>
    </div>
  )
}

export default Auction
