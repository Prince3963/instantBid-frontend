import React from 'react';
import AuctionList from './Auction/AuctionList';

const Dashboard = () => {
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Search bar */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search auctions..."
          className="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Dashboard Header */}
      {/* <h1 className="text-3xl font-bold mb-6">Dashboard</h1> */}
      <div>
        <AuctionList />
      </div>
    </div>

  );
};

export default Dashboard;