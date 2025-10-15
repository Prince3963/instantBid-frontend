import React from 'react';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search auctions..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dashboard Header */}
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {/* Main Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Live + Upcoming */}
        <div className="lg:col-span-2 space-y-6">
          {/* Live Auctions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Live Auctions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {['Landscape Painting', 'Antique Vase', 'Bluetooth Speaker'].map((item, idx) => (
                <div key={idx} className="bg-white p-4 rounded-md shadow hover:shadow-md transition">
                  <h3 className="font-semibold">{item}</h3>
                  <p className="text-sm text-gray-500">Current bid</p>
                  <p className="text-blue-600 font-bold text-lg">
                    ₹{[250, 150, 80][idx]}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {['12m 34s', '25m 12s', '30m 50s'][idx]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Auctions */}
          <div>
            <h2 className="text-xl font-semibold mb-4">Upcoming Auctions</h2>
            <div className="bg-white p-4 rounded-md shadow hover:shadow-md transition">
              <h3 className="font-semibold">4K TV</h3>
              <p className="text-sm text-gray-500">Starting bid</p>
              <p className="text-blue-600 font-bold text-lg">₹300</p>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Recent Bids + Wallet */}
        <div className="space-y-6">
          {/* Recent Bids */}
          <div className="bg-white p-4 rounded-md shadow">
            <h2 className="text-xl font-semibold mb-4">My Recent Bids</h2>
            <ul className="space-y-2">
              <li className="flex justify-between border-b pb-2">
                <span>Vintage Watch</span>
                <span className="font-semibold">₹200</span>
              </li>
              <li className="flex justify-between border-b pb-2">
                <span>Landscape Painting</span>
                <span className="font-semibold">₹250</span>
              </li>
              <li className="flex justify-between">
                <span>Antique Vase</span>
                <span className="font-semibold">₹150</span>
              </li>
            </ul>
          </div>

          {/* Wallet Summary */}
          <div className="bg-white p-4 rounded-md shadow text-center">
            <h2 className="text-xl font-semibold mb-2">Wallet Summary</h2>
            <p className="text-2xl font-bold text-green-600">₹1,200</p>
            <p className="text-sm text-gray-500">Current Balance</p>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;