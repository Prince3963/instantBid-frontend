import React from 'react'

function About() {
  return (
    <section id="about" className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-4">Why Choose instantBid?</h2>
        <p className="text-gray-600 mb-10">
          We make online auctions transparent, fast, and accessible to everyone.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">⚡ Easy to Use</h3>
            <p className="text-gray-600">Simple bidding process, no hassle.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">🔒 Secure Payments</h3>
            <p className="text-gray-600">Safe transactions you can trust.</p>
          </div>
          <div className="p-6 bg-white rounded-xl shadow hover:shadow-lg">
            <h3 className="text-xl font-semibold mb-2">⏱ Real-Time Updates</h3>
            <p className="text-gray-600">Stay updated with live auctions.</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About