import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router-dom";

const AuctionLive = () => {
    const { auctionId } = useParams();
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const connectionRef = useRef(null);

    // Fetch initial existing bids
    const fetchOldBids = async () => {
        try {
            const res = await fetch(
                `https://localhost:7119/getBidByAuction?id=${auctionId}`
            );
            const raw = await res.json();

            const initialBids = raw?.data?.$values ?? [];

            // Sort descending by bidTime (latest first)
            const sortedBids = initialBids.sort(
                (a, b) => new Date(b.bidTime) - new Date(a.bidTime)
            );

            setBids(sortedBids);
        } catch (err) {
            console.error("Error fetching old bids:", err);
        }
    };


    useEffect(() => {
        fetchOldBids();

        const startConnection = async () => {
            try {
                const token = localStorage.getItem("jwtToken");

                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7119/auctionHub", {
                        accessTokenFactory: () => token
                    })
                    .withAutomaticReconnect()
                    .build();

                connectionRef.current = newConnection;

                newConnection.on("BidPlaced", (data) => {
                    console.log("Live Bid:", data);
                    setBids((prev) => [data, ...prev]);
                });

                await newConnection.start();
                setStatus("Connected");

                await newConnection.invoke("JoinAuction", parseInt(auctionId));
            } catch (error) {
                console.error("SignalR error:", error);
            }
        };

        startConnection();

        return () => {
            connectionRef.current?.stop();
        };
    }, [auctionId]);

    const handleBid = async () => {
        try {
            await connectionRef.current?.invoke(
                "PlaceBid",
                parseInt(auctionId),
                parseFloat(bidAmount)
            );
            setBidAmount("");
        } catch (err) {
            console.error("Error placing bid:", err);
        }
    };

    return (
        <div style={{ padding: "20px" }}>
            <h2>🏆 Live Auction #{auctionId}</h2>
            <p>Status: {status}</p>

            <div>
                <input
                    type="number"
                    placeholder="Enter your bid"
                    value={bidAmount}
                    onChange={(e) => setBidAmount(e.target.value)}
                />
                <button onClick={handleBid}>Place Bid</button>
            </div>

            {/* LIVE + OLD BIDS BELOW */}
            <div className="mt-5">
                <h3 className="text-lg font-semibold mb-3">📜 All Bids</h3>

                {bids.length === 0 ? (
                    <p>No bids yet...</p>
                ) : (
                    <div className="space-y-3">
                        {bids.map((bid, index) => (
                            <div
                                key={index}
                                className="bg-white shadow-sm border rounded-lg p-3"
                            >
                                <p className="text-gray-800 text-lg font-semibold">
                                    ₹ {bid.bidAmount ?? bid.amount}
                                </p>
                                <p className="text-gray-500 text-sm">
                                    👤 User: {bid.name ?? bid.user}
                                </p>
                                <p className="text-gray-400 text-xs">
                                    🕒 {bid.bidTime ?? bid.BidTime} 
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AuctionLive;
