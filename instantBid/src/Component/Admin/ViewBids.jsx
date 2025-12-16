import React, { useEffect, useState } from "react";

function ViewBids() {
  const [bids, setBids] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBids = async () => {
      try {
        const res = await fetch("https://localhost:7119/getAllBids");
        const data = await res.json();

        if (data.status) {
          // Sort bids by bidTime descending (latest first)
          const sortedBids = data.data.$values.sort(
            (a, b) => new Date(b.bidTime) - new Date(a.bidTime)
          );

          setBids(sortedBids);
        } else {
          setError(data.message || "No bids available");
        }
      } catch (err) {
        console.error(err);
        setError("Failed to fetch bids");
      } finally {
        setLoading(false);
      }
    };

    fetchBids();
  }, []);

  if (loading) {
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        All Bids History
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-4 max-w-full mx-auto">
        {bids.map((bid, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between
                       transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {/* Left: Auction Image */}
            <img
              src={bid.itemImage || "https://via.placeholder.com/80"}
              alt={bid.auctionItemName}
              className="w-20 h-20 rounded-lg object-cover mr-4 flex-shrink-0"
            />

            {/* Middle: Bid Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">
                {bid.auctionItemName}
              </h2>

              <p className="text-gray-600">
                Bid By: <span className="font-medium">{bid.name}</span>
              </p>

              <p className="text-gray-600">
                Bid Amount: ₹{bid.bidAmount}
              </p>

              <p className="text-sm text-gray-500">
                Bid Time: {new Date(bid.bidTime).toLocaleString()}
              </p>
            </div>

            {/* Right: Current Bid */}
            <div className="text-right ml-4">
              <p className="text-gray-500 text-sm">Current Bid</p>
              <p className="text-lg font-bold text-green-600">
                ₹{bid.currentBid}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ViewBids;
