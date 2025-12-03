import React, { useState } from 'react';
import AuctionList from './Auction/AuctionList';
import { FaSearch } from "react-icons/fa";

const Dashboard = () => {
  const [searchTerms, setSearchTerms] = useState("");

  return (
    <div className="p-6 bg-gray-50 min-h-screen">

      {/* Search bar */}
      <div className="mb-6 relative w-full">
        
        {/* Search Icon */}
        <FaSearch className="absolute left-3 top-3 text-gray-500 text-lg" />

        <input
          type="text"
          placeholder="Search auctions..."
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setSearchTerms(e.target.value);
            }
          }}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div>
        <AuctionList searchTerms={searchTerms} />
      </div>

    </div>
  );
};

export default Dashboard;
