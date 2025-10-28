import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuctionList = () => {
    const [auctions, setAuctions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAuctions = async () => {
            try {
                // ✅ Keeping your API route exactly the same
                const res = await axios.get("https://localhost:7119/getAuctions");

                console.log("✅ Full API Response:", res);
                console.log("✅ Response Data:", res.data);

                // Ensure we safely set data
                setAuctions(res.data?.data || []);
            } catch (err) {
                console.error("❌ Error fetching auctions:", err);
                setError("Failed to fetch auctions");
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);

    // Helper function to format date/time
    const formatDateTime = (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // Loading state
    if (loading)
        return (
            <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-gray-600">
                Loading auctions...
            </div>
        );

    // Error state
    if (error)
        return (
            <div className="text-center text-red-500 font-semibold mt-8">
                {error}
            </div>
        );

    // Render auction cards
    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            {auctions.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No auctions found.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl cursor-pointer transition-all duration-300"
                        >
                            {/* Image */}
                            {auction.itemImageURL && (
                                <img
                                    src={auction.itemImageURL}
                                    alt={auction.itemName || "Auction Item"}
                                    className="w-full h-48 object-cover rounded-xl mb-4"
                                />
                            )}

                            {/* Title */}
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {auction.auctionItemName}
                            </h2>

                            {/* Info Section */}
                            <div className="text-gray-600 text-sm space-y-1">
                                <p>
                                    <span className="font-medium text-gray-700">
                                        Starting Bid:
                                    </span>{" "}
                                    ₹{auction.startingBid}
                                </p>

                                {auction.itemName && (
                                    <p>
                                        <span className="font-medium text-gray-700">
                                            Item Name:
                                        </span>{" "}
                                        {auction.itemName}
                                    </p>
                                )}

                                {auction.itemDescription && (
                                    <p>
                                        <span className="font-medium text-gray-700">
                                            Item Description:
                                        </span>{" "}
                                        {auction.itemDescription}
                                    </p>
                                )}

                                <p>
                                    <span className="font-medium text-gray-700">
                                        Starting Time:
                                    </span>{" "}
                                    {formatDateTime(auction.auctionStartTime)}
                                </p>

                                <p>
                                    <span className="font-medium text-gray-700">
                                        Ending Time:
                                    </span>{" "}
                                    {formatDateTime(auction.auctionEndTime)}
                                </p>
                            </div>

                            {/* Action Button */}
                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    onClick={() => {
                                        console.log("🟢 Auction object clicked:", auction);
                                        // AuctionId might not exist if DTO missing it, so handle safely
                                        navigate(`/dashboard/${auction.auctionId || index}`);
                                    }}
                                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition"
                                >
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
