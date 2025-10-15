import React from 'react'

function Testimonials() {
  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-6xl mx-auto text-center">
        <h2 className="text-3xl font-bold mb-8">What Our Users Say</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-600">“instantBid made bidding so simple and fun!”</p>
            <h4 className="mt-4 font-semibold">— Rahul</h4>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-600">“Best auction experience, super smooth.”</p>
            <h4 className="mt-4 font-semibold">— Aadi</h4>
          </div>
          <div className="p-6 bg-white rounded-xl shadow">
            <p className="text-gray-600">“I won my first auction in minutes!”</p>
            <h4 className="mt-4 font-semibold">— Aman</h4>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials