import React, { useState } from 'react';
import axios from 'axios';

function Auction() {
  // State for form data (AuctionDTO fields)
  const [auctionItemName, setAuctionItemName] = useState('');
  const [auctionStartTime, setAuctionStartTime] = useState('');
  const [auctionEndTime, setAuctionEndTime] = useState('');
  const [startingBid, setStartingBid] = useState('');
  const [endingBid, setEndingBid] = useState('');
  const [status, setStatus] = useState(true);
  const [userId, setUserId] = useState(); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to handle the API call when button is clicked
  const handlePostRequest = async () => {
    setLoading(true); // Set loading state to true when the request starts

    // Create the AuctionDTO object with form data
    const auctionData = {
      AuctionItemName: auctionItemName,
      AuctionStartTime: auctionStartTime,
      AuctionEndTime: auctionEndTime,
      StartingBid: startingBid,
      EndingBid: endingBid,
      Status: status,
      UserId: userId,
    };

    try {
      // API request to your backend
      const response = await axios.post('https://localhost:7119/AddAuction', auctionData, {
        headers: {
          'Content-Type': 'application/json', // Ensure the content type is correct
        },
      });

      // Handle the response (you can log it or update state)
      console.log(response.data);
      setLoading(false); // Set loading to false after the response
    } catch (err) {
      setLoading(false); // Set loading to false in case of error
      setError(err.message); // Set error message if API call fails
      console.error(err);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-4 rounded-xl">
      {/* Row with title and + button */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create Auction</h2>

        <button
          className={`bg-blue-600 text-white px-6 py-2 rounded-xl text-lg font-semibold transition-all duration-200 ${loading ? 'bg-gray-400' : 'hover:bg-blue-700'}`}
          onClick={handlePostRequest}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Create Auction'}
        </button>
      </div>

      {/* Form fields to take auction data input */}
      <div className="space-y-4">
        <div>
          <label htmlFor="auctionItemName" className="text-sm font-medium text-gray-600">Auction Item Name</label>
          <input
            id="auctionItemName"
            type="text"
            placeholder="Enter auction item name"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            value={auctionItemName}
            onChange={(e) => setAuctionItemName(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="auctionStartTime" className="text-sm font-medium text-gray-600">Auction Start Time</label>
          <input
            id="auctionStartTime"
            type="datetime-local"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            value={auctionStartTime}
            onChange={(e) => setAuctionStartTime(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="auctionEndTime" className="text-sm font-medium text-gray-600">Auction End Time</label>
          <input
            id="auctionEndTime"
            type="datetime-local"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            value={auctionEndTime}
            onChange={(e) => setAuctionEndTime(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="startingBid" className="text-sm font-medium text-gray-600">Starting Bid</label>
          <input
            id="startingBid"
            type="number"
            placeholder="Enter starting bid"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            value={startingBid}
            onChange={(e) => setStartingBid(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="endingBid" className="text-sm font-medium text-gray-600">Ending Bid</label>
          <input
            id="endingBid"
            type="number"
            placeholder="Enter ending bid"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
            value={endingBid}
            onChange={(e) => setEndingBid(e.target.value)}
          />
        </div>

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={status}
            onChange={() => setStatus(!status)}
            className="h-5 w-5 text-blue-600 rounded-full border-gray-300 focus:ring-2 focus:ring-blue-600"
          />
          <span className="ml-2 text-sm text-gray-600">Active Auction</span>
        </div>
      </div>

      {/* Error display */}
      {error && <div className="mt-4 text-red-500 text-sm">{error}</div>}
    </div>
  );
}

export default Auction;
