import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router-dom";

const AuctionLive = () => {
    const { auctionId } = useParams();
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const connectionRef = useRef(null);

    useEffect(() => {
        const startConnection = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    console.error("JWT not found in localStorage");
                    setStatus("No JWT token");
                    return;
                }

                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7119/auctionHub", {
                        accessTokenFactory: () => token,
                        // transport: signalR.HttpTransportType.WebSockets  // Force WebSocket transport
                    })
                    .withAutomaticReconnect()
                    .build();

                connectionRef.current = newConnection;

                // Listen for new bids
                newConnection.on("BidPlaced", (data) => {
                    console.log("📩 BidPlaced received:", data);
                    setBids((prevBids) => [...prevBids, data]);
                });

                await newConnection.start();
                console.log("✅ Connected to Auction Hub");
                setStatus("Connected ✅");

                await newConnection.invoke("JoinAuction", parseInt(auctionId));
                console.log("✅ Joined Auction:", auctionId);

            } catch (error) {
                console.error("❌ SignalR connection failed:", error);
                setStatus("Connection failed ");
            }
        };

        startConnection();

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
            }
        };
    }, [auctionId]);

    const handleBid = async () => {
        try {
            if (!connectionRef.current) {
                console.error("❌ Connection not established yet");
                return;
            }

            await connectionRef.current.invoke(
                "PlaceBid",
                parseInt(auctionId),
                parseFloat(bidAmount)
            );

            setBidAmount("");
        } catch (error) {
            console.error("❌ Error placing bid:", error);
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
                <button
                    onClick={handleBid}
                    disabled={!connectionRef.current}
                >
                    Place Bid
                </button>
            </div>

            <div className="mt-5">
    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
        📜 <span>Bid History</span>
    </h3>

    {bids.length === 0 ? (
        <p className="text-gray-500 text-sm">No bids yet...</p>
    ) : (
        <div className="space-y-3">
            {bids.map((bid, index) => (
                <div
                    key={index}
                    className="bg-white shadow-sm border rounded-lg p-3 flex items-center justify-between"
                >
                    <div>
                        <p className="text-gray-800 text-lg font-semibold">
                            ₹ {bid.amount}
                        </p>
                        <p className="text-gray-500 text-sm">
                            👤 User: {bid.user}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    )}
</div>

        </div>
    );
};

export default AuctionLive;
