import React, { useEffect, useState } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams, useNavigate } from "react-router-dom";

const AuctionLive = () => {
  const { auctionId } = useParams();
  const navigate = useNavigate();
  const [connection, setConnection] = useState(null);
  const [currentBid, setCurrentBid] = useState(0);
  const [bidAmount, setBidAmount] = useState("");
  const [bids, setBids] = useState([]);

  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl("https://localhost:7119/auctionHub") // Backend Hub URL
      .configureLogging(signalR.LogLevel.Information)
      .build();

    setConnection(connect);
  }, []);

  useEffect(() => {
    if (connection) {
      connection
        .start()
        .then(() => {
          console.log("Connected to auction hub ✅");
          connection.invoke("JoinAuction", parseInt(auctionId));

          connection.on("BidPlaced", (data) => {
            console.log("BidPlaced received:", data);
            setCurrentBid(data.amount);
            setBids((prev) => [...prev, data]);
          });

          connection.on("BidRejected", (msg) => {
            alert(msg);
          });
        })
        .catch((err) => console.error("Connection failed:", err));
    }
  }, [connection]);

  const handleBid = async () => {
    if (connection && bidAmount) {
      await connection.invoke("PlaceBid", parseInt(auctionId), parseFloat(bidAmount), "Prince"); // replace with logged in username
      setBidAmount("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h1 className="text-2xl font-bold mb-3">Auction Live #{auctionId}</h1>
        <p className="text-lg mb-3">💰 Current Bid: ₹{currentBid}</p>

        <div className="flex gap-2 mb-3">
          <input
            type="number"
            value={bidAmount}
            onChange={(e) => setBidAmount(e.target.value)}
            placeholder="Enter your bid"
            className="border px-2 py-1 rounded-lg flex-1"
          />
          <button
            onClick={handleBid}
            className="bg-blue-600 text-white px-4 py-1 rounded-md hover:bg-blue-700"
          >
            Place Bid
          </button>
        </div>

        <div className="bg-gray-100 p-3 rounded-lg h-40 overflow-y-auto">
          <h3 className="font-semibold mb-2">Bid History</h3>
          {bids.map((b, i) => (
            <p key={i} className="text-sm">
              🧑‍💼 {b.user} placed ₹{b.amount}
            </p>
          ))}
        </div>

        <button
          onClick={() => navigate(-1)}
          className="mt-4 bg-red-500 text-white px-4 py-1 rounded-md hover:bg-red-600"
        >
          Exit
        </button>
      </div>
    </div>
  );
};

export default AuctionLive;
