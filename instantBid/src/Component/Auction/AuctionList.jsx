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
                const res = await axios.get("https://localhost:7119/getAuctions");

                console.log("Full API Response:", res);
                console.log("Response Data:", res.data);

                // Extract clean list from .NET style response
                const apiData = res.data?.data;
                let auctionList = [];

                if (Array.isArray(apiData)) {
                    auctionList = apiData;
                }
                else if (Array.isArray(apiData?.$values)) {
                    auctionList = apiData.$values;
                }
                else {
                    console.warn("Unexpected data structure:", apiData);
                }

                console.log("Final Auctions List:", auctionList);
                setAuctions(auctionList);
            } catch (err) {
                console.error("Error fetching auctions:", err);
                setError("Failed to fetch auctions");
            } finally {
                setLoading(false);
            }
        };

        fetchAuctions();
    }, []);


    const formatDateTime = (value) => {
        if (!value) return "N/A";
        const date = new Date(value);
        if (isNaN(date.getTime())) return "Invalid Date";
        return date.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

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
            {!Array.isArray(auctions) || auctions.length === 0 ? (
                <p className="text-center text-gray-500 text-lg">
                    No auctions found.
                </p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {auctions.map((auction, index) => (
                        <div
                            key={index}
                            className="bg-white shadow-lg rounded-2xl p-6 hover:shadow-2xl  transition-all duration-300"
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

                            <div className="mt-4 flex justify-between items-center">
                                <button
                                    onClick={() =>
                                        navigate(`/dashboard/${auction.auctionId}`)
                                    }
                                    className="bg-blue-600 hover:bg-blue-700 cursor-pointer text-white text-sm px-4 py-2 rounded-lg transition"
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
