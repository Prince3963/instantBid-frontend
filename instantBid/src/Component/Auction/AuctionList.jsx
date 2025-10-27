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

    // Helper function to format date
    const formatDateTime = (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // If loading
    if (loading)
        return (
            <div className="flex justify-center items-center h-[60vh] text-lg font-semibold text-gray-600">
                Loading auctions...
            </div>
        );

    // If there's an error fetching data
    if (error)
        return (
            <div className="text-center text-red-500 font-semibold mt-8">
                {error}
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            {auctions.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">No auctions found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl cursor-pointer transition-all duration-300"
                        >

                            {auction.itemImageURL && (
                                <img
                                    src={auction.itemImageURL}
                                    alt={auction.itemName || "Auction Item"}
                                    className="w-full h-48 object-cover rounded-xl mb-4"
                                />
                            )}

                            <h2 className="text-xl font-semibold text-gray-800 mb-2">
                                {auction.auctionItemName}
                            </h2>

                            <div className="text-gray-600 text-sm space-y-1">
                                <p>
                                    <span className="font-medium text-gray-700">Starting Bid:</span>{" "}
                                    ₹{auction.startingBid}
                                </p>

                                {/* Item-related info */}
                                {auction.itemName && (
                                    <p>
                                        <span className="font-medium text-gray-700">Item Name:</span>{" "}
                                        {auction.itemName}
                                    </p>
                                )}

                                {auction.itemDescription && (
                                    <p>
                                        <span className="font-medium text-gray-700">Item Description:</span>{" "}
                                        {auction.itemDescription}
                                    </p>
                                )}

                                {/* Formatting Auction Times */}
                                <p>
                                    <span className="font-medium text-gray-700">Starting Time:</span>{" "}
                                    {formatDateTime(auction.auctionStartTime)}
                                </p>
                                <p>
                                    <span className="font-medium text-gray-700">Ending Time:</span>{" "}
                                    {formatDateTime(auction.auctionEndTime)}
                                </p>
                            </div>

                            {/* Buttons */}
                            <div className="mt-4 flex justify-between items-center">
                                {/* <button className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg transition">
                                    View Details
                                </button> */}
                                <button
                                    onClick={() => navigate(`/auction/${auction.auctionID}`)} // 🔹 Use correct key from backend
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
