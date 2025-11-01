import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router-dom";

const AuctionLive = () => {
    const { auctionId } = useParams();
    const [connection, setConnection] = useState(null);
    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const connectionRef = useRef(null);

    useEffect(() => {
        const startConnection = async () => {
            try {
                const token = localStorage.getItem("jwtToken");
                if (!token) {
                    console.error("❌ JWT not found in localStorage");
                    setStatus("No JWT token ❌");
                    return;
                }

                // ✅ Correct SignalR setup
                // import * as signalR from '@microsoft/signalr';

                const newConnection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7119/auctionHub", {
                        accessTokenFactory: () => localStorage.getItem("token") // ya jahan JWT store hai
                    })
                    .withAutomaticReconnect()
                    .build();


                connectionRef.current = newConnection;

                // Listen for new bids
                newConnection.on("BidPlaced", (user, amount) => {
                    console.log("📩 BidPlaced received:", user, amount);
                    setBids((prevBids) => [...prevBids, { user, amount }]);
                });

                // Start connection
                await newConnection.start();
                console.log("✅ Connected to Auction Hub");
                setStatus("Connected ✅");

                // Join auction group
                await newConnection.invoke("JoinAuction", parseInt(auctionId));
                console.log("✅ Joined Auction:", auctionId);

                setConnection(newConnection);
            } catch (error) {
                console.error("❌ SignalR connection failed:", error);
                setStatus("Connection failed ❌");
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
            const userId = localStorage.getItem("userId");
            if (!connectionRef.current) {
                console.error("❌ Connection not established yet");
                return;
            }

            console.log("📤 Placing bid:", bidAmount, "for auction:", auctionId);
            await connectionRef.current.invoke(
                "PlaceBid",
                parseInt(auctionId),
                parseFloat(bidAmount),
                userId
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
                    className="bg-blue-700 cursor-pointer"
                    disabled={!connection}
                >
                    Place Bid
                </button>
            </div>

            <h3>📜 Bid History</h3>
            <ul>
                {bids.map((bid, index) => (
                    <li key={index}>
                        {bid.user}: ₹{bid.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default AuctionLive;
