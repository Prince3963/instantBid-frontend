import React, { useEffect, useState, useRef } from "react";
import * as signalR from "@microsoft/signalr";
import { useParams } from "react-router-dom";

const AuctionLive = () => {
    const { auctionId } = useParams();

    const [bidAmount, setBidAmount] = useState("");
    const [bids, setBids] = useState([]);
    const [status, setStatus] = useState("Connecting...");
    const [winner, setWinner] = useState(null);
    const [announcement, setAnnouncement] = useState("");
    const [hideAuction, setHideAuction] = useState(false);

    const [auctionImage, setAuctionImage] = useState(null);
    const [auctionName, setAuctionName] = useState("");

    const connectionRef = useRef(null);

    // 🔹 Fetch old bids
    const fetchOldBids = async () => {
        try {
            const res = await fetch(
                `https://localhost:7119/getBidByAuction?id=${auctionId}`
            );
            const raw = await res.json();

            const initialBids = raw?.data?.$values ?? [];
            const sorted = initialBids.sort(
                (a, b) => new Date(b.bidTime) - new Date(a.bidTime)
            );

            setBids(sorted);
        } catch (err) {
            console.error("Error fetching bids", err);
        }
    };

    // 🔹 Fetch auction details (image + name)
    const fetchAuctionDetails = async () => {
        try {
            const res = await fetch(
                `https://localhost:7119/winnerAnnouced?auctionId=${auctionId}`,
                { method: "POST" }
            );
            const raw = await res.json();

            if (raw?.status && raw?.data) {
                setAuctionImage(raw.data?.items?.itemImage);
                setAuctionName(raw.data?.auctionItemName);
            }
        } catch (err) {
            console.error("Auction details fetch failed", err);
        }
    };

    // 🔹 Check winner
    const checkWinner = async () => {
        try {
            const res = await fetch(
                `https://localhost:7119/winnerAnnouced?auctionId=${auctionId}`,
                { method: "POST" }
            );
            const raw = await res.json();

            if (
                raw?.status === true &&
                raw?.data?.isCompleted === true &&
                !winner
            ) {
                startAnnouncement(raw.data);
            }
        } catch (err) {
            console.error("Winner check failed", err);
        }
    };

    // 🔊 Auction style 1…2…3… SOLD
    const startAnnouncement = (winnerData) => {
        const steps = [
            "Going once...",
            "Going twice...",
            "SOLD! 🎉 Congratulations",
        ];

        let i = 0;

        const interval = setInterval(() => {
            setAnnouncement(steps[i]);
            i++;

            if (i === steps.length) {
                clearInterval(interval);
                setWinner(winnerData);

                // 🧹 SOLD ke 3 sec baad UI remove
                setTimeout(() => {
                    setHideAuction(true);
                }, 5000);
            }
        }, 1500);
    };

    // 🔹 SignalR + polling
    useEffect(() => {
        fetchOldBids();
        fetchAuctionDetails();

        const startConnection = async () => {
            try {
                const token = localStorage.getItem("jwtToken");

                const connection = new signalR.HubConnectionBuilder()
                    .withUrl("https://localhost:7119/auctionHub", {
                        accessTokenFactory: () => token,
                    })
                    .withAutomaticReconnect()
                    .build();

                connectionRef.current = connection;

                connection.on("BidPlaced", (data) => {
                    setBids((prev) => [data, ...prev]);
                });

                await connection.start();
                setStatus("Connected");

                await connection.invoke("JoinAuction", parseInt(auctionId));
            } catch (err) {
                console.error("SignalR error", err);
            }
        };

        startConnection();

        const timer = setInterval(() => {
            checkWinner();
        }, 3000);

        return () => {
            clearInterval(timer);
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
            console.error("Error placing bid", err);
        }
    };

    // 🧹 After SOLD → remove auction UI
    if (hideAuction) {
        return (
            <div className="p-10 text-center">
                <h2 className="text-3xl font-bold text-green-700">
                    ✅ Auction Completed
                </h2>
                <p className="text-gray-500 mt-2">
                    This item has been sold successfully.
                </p>
            </div>
        );
    }

    return (
        <div style={{ padding: "20px" }}>
            {/* 🖼 Auction Header */}
            <div className="mb-6">
                <div className="relative w-full max-w-md">
                    {auctionImage && (
                        <>
                            <img
                                src={auctionImage}
                                alt="Auction Item"
                                className={`w-full h-64 object-cover rounded-2xl shadow-lg
                                ${winner ? "opacity-70 blur-[1px]" : ""}`}
                            />

                            {winner && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-4xl font-extrabold text-red-600 bg-white/80 px-6 py-3 rounded-xl rotate-[-12deg] shadow-lg">
                                        SOLD
                                    </span>
                                </div>
                            )}
                        </>
                    )}
                </div>

                <div className="mt-4">
                    <h2 className="text-3xl font-bold">
                        {auctionName || "Live Auction"}
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Auction ID: #{auctionId}
                    </p>
                </div>
            </div>

            <p>Status: {status}</p>

            {/* 🔊 Announcement */}
            {announcement && (
                <div className="my-6 text-center text-3xl font-bold text-orange-600">
                    {announcement}
                </div>
            )}

            {/* 🔨 Bid input */}
            {!winner && (
                <div className="my-4">
                    <input
                        type="number"
                        placeholder="Enter your bid"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button
                        className="bg-blue-600 w-40 hover:bg-blue-700 text-white py-3 rounded-xl text-lg font-semibold ml-3"
                        onClick={handleBid}
                    >
                        Place Bid
                    </button>
                </div>
            )}

            {/* 📜 Bids */}
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
                                <p className="text-lg font-semibold">
                                    ₹ {bid.bidAmount ?? bid.amount}
                                </p>
                                <p className="text-sm text-gray-500">
                                    👤 {bid.name ?? bid.user}
                                </p>
                                <p className="text-xs text-gray-400">
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
