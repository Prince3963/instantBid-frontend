import React from 'react'
import { useNavigate } from 'react-router-dom'
// import Images from '../Images/bid.jpeg'

function CTA() {
  const navigate = useNavigate();

  const hanldeNavigate = () => {
    navigate('/login')
  }
  
  return (
   <section className="py-16 px-6 bg-blue-600 text-white text-center">
      <h2 className="text-3xl font-bold mb-4">Ready to Start Bidding?</h2>
      <p className="mb-6">Join now and explore live auctions instantly.</p>
      <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200" onClick={hanldeNavigate}>
        Get Started
      </button>
    </section>
  )
}

export default CTA