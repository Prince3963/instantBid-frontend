import React from 'react'

function Footer() {
  return (
    <footer className="py-6 bg-gray-900 text-white text-center">
      <p>© {new Date().getFullYear()} instantBid. All rights reserved.</p>
    </footer>
  )
}

export default Footer