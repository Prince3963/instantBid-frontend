import React, { useState, useEffect } from "react";

function Auction() {
  const [auctions, setAuctions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await fetch("https://localhost:7119/getAuctions");
        const data = await response.json();

        if (data.status) {
          setAuctions(data.data.$values);
        } else {
          setError("No auctions available");
        }
      } catch (error) {
        setError("Failed to fetch auctions");
      } finally {
        setLoading(false);
      }
    };

    fetchAuctions();
  }, []);

  // 🔥 AUCTION STATUS UPDATE
  const updateAuctionStatus = async (auctionId, currentStatus) => {
    if (!window.confirm("Are you sure you want to change auction status?"))
      return;

    try {
      const res = await fetch(
        `https://localhost:7119/updateAuctionStatus?auctionId=${auctionId}&isActive=${!currentStatus}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Something went wrong");
        return;
      }

      if (data.status) {
        setAuctions(prev =>
          prev.map(auction =>
            auction.auctionId === auctionId
              ? { ...auction, status: !currentStatus }
              : auction
          )
        );
      } else {
        alert(data.message || "Failed to update auction status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while updating auction status");
    }
  };

  if (loading)
    return (
      <div className="text-center mt-10 text-lg font-semibold">
        Loading...
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Auction Panel
      </h1>

      {error && (
        <p className="text-red-500 text-center mb-4">{error}</p>
      )}

      <div className="flex flex-col gap-4 max-w-full mx-auto">
        {auctions.map(auction => (
          <div
            key={auction.auctionId}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between
                       transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {/* Left: Image */}
            <img
              src={auction.itemImageURL || "https://via.placeholder.com/80"}
              alt={auction.itemName}
              className="w-20 h-20 rounded-lg object-cover mr-4 flex-shrink-0"
            />

            {/* Middle: Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">
                {auction.itemName}
              </h2>

              <p className="text-gray-600">
                Starting Bid: ₹{auction.startingBid}
              </p>

              <p className="text-gray-600">
                Current Bid: ₹{auction.currentBid}
              </p>

              <p className="mt-1">
                Status:{" "}
                <span
                  className={`font-semibold ${
                    auction.status
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {auction.status ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            {/* Right: Activate / Deactivate Button */}
            <button
              onClick={() =>
                updateAuctionStatus(auction.auctionId, auction.status)
              }
              className={`ml-4 px-4 py-2 rounded text-white font-medium transition-colors cursor-pointer
                ${
                  auction.status
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-green-500 hover:bg-green-600"
                }`}
            >
              {auction.status ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Auction;
