import React from 'react'
import { useNavigate } from 'react-router-dom';
import Image from '../Images/bid.jpeg'

function Hero() {
  const navigate = useNavigate();

  const handleStartAuction = () => {
    navigate('/login'); 
  };

  return (
    <section className="flex flex-col md:flex-row items-center justify-between p-10 pt-20">
      <div className="max-w-lg">
        <h2 className="text-4xl font-bold mb-4">Auction made simple</h2>
        <p className="text-gray-600 mb-6">
          Join the world's leading online auction platform.
        </p>
        <button 
          onClick={handleStartAuction}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Start an Auction
        </button>
      </div>

      {/* Right Side Image */}
      <div className="mt-8 md:mt-0">
        <img 
          src={Image} 
          alt="Auction Illustration" 
          className="w-64 h-64 object-cover rounded-xl shadow-lg"
        />
      </div>
    </section>
  );
}

export default Hero;
