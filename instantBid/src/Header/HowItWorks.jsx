import React from 'react'

function HowItWorks() {
  return (
     <section id="how" className="py-16 px-6">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 mt-10">
          <div className="p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">1. Register</h3>
            <p className="text-gray-600">Create your free instantBid account.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">2. Start Bidding</h3>
            <p className="text-gray-600">Find items and place your bids live.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg">
            <h3 className="text-xl font-semibold mb-2">3. Win & Pay</h3>
            <p className="text-gray-600">Win auctions and complete secure payments.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks