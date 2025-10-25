import React, { useEffect, useState } from "react";
import axios from "axios";

const AuctionList = () => {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const res = await axios.get("https://localhost:7119/getAuctions"); // 🔹 Change port if backend runs on different one
        setAuctions(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setError("Failed to fetch auctions");
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-gray-600">
        Loading auctions...
      </div>
    );

  if (error)
    return (
      <div className="text-center text-red-500 font-semibold mt-8">
        {error}
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
        Auction List
      </h1>

      {auctions.length === 0 ? (
        <p className="text-center text-gray-500 text-lg">No auctions found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {auctions.map((auction, index) => (
            <div
              key={index}
              className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl transition-all duration-300"
            >
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                {auction.auctionName}
              </h2>

              <div className="text-gray-600 text-sm space-y-1">
                <p>
                  <span className="font-medium text-gray-700">Starting Bid:</span>{" "}
                  ₹{auction.startingBid}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Ending Bid:</span>{" "}
                  ₹{auction.endingBid}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      auction.status === "Active"
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600"
                    }`}
                  >
                    {auction.status}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">Created At:</span>{" "}
                  {new Date(auction.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Starting Time:</span>{" "}
                  {new Date(auction.startingTime).toLocaleString()}
                </p>
                <p>
                  <span className="font-medium text-gray-700">Ending Time:</span>{" "}
                  {new Date(auction.endingTime).toLocaleString()}
                </p>
              </div>

              <div className="mt-4 flex justify-between items-center">
                <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                  View Details
                </button>
                <button className="bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-lg transition">
                  Place Bid
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AuctionList;
