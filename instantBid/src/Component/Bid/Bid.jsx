import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function Bid() {
  const { auctionId } = useParams(); // Extract auctionId from URL
  const [bidHistory, setBidHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); // Added error state

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchBidHistory = async () => {
      setLoading(true);
      setError(null); // Reset error state before fetching

      try {
        const res = await fetch(
          `https://localhost:7119/getBidByAuction?id=${auctionId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
          }
        );

        const raw = await res.json();
        console.log("DEBUG: getBidByAuction response:", raw);

        if (!raw || !raw.data) {
          throw new Error("No bid data found");
        }

        // Simplified robust array extractor
        const bids = raw?.data?.$values ?? [];

        if (bids.length === 0) {
          setBidHistory([]);
          setError("No bids found for this auction.");
        } else {
          // Normalize bid data (if needed)
          const normalizedBids = bids.map((item, idx) => ({
            bidId: item.bidId ?? item.$id ?? idx,
            auctionId: item.auctionId ?? item.AuctionId ?? null,
            amount: item.bidAmount ?? item.BidAmount ?? item.amount ?? null,
            userId: item.userId ?? item.UserId ?? item.user ?? "Unknown",
            bidTime: item.bidTime ?? item.BidTime ?? item.time ?? null,
          }));

          setBidHistory(normalizedBids);
        }
      } catch (error) {
        console.error("Error fetching bid history:", error);
        setError("Failed to load bid history.");
      } finally {
        setLoading(false);
      }
    };

    if (auctionId) {
      fetchBidHistory();
    } else {
      setLoading(false);
      setError("Invalid auction ID.");
    }
  }, [auctionId, token]);

  if (loading) return <div className="p-6 text-center text-gray-600">Loading bids...</div>;
  if (error) return <div className="p-6 text-center text-red-600">{error}</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Bid History (Auction ID: {auctionId})</h2>

      {bidHistory.length === 0 ? (
        <p className="text-gray-600">No bids yet.</p>
      ) : (
        <div className="space-y-3">
          {bidHistory.map((bid) => (
            <div
              key={bid.bidId}
              className="p-4 bg-white shadow-md rounded-lg border border-gray-200"
            >
              <p className="text-lg font-medium text-gray-800">
                💰 Bid Amount: ₹{bid.amount}
              </p>
              <p className="text-gray-500 text-sm">User: {bid.userId}</p>
              <p className="text-gray-400 text-sm">
                Time: {bid.bidTime ? new Date(bid.bidTime).toLocaleString() : "—"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Bid;