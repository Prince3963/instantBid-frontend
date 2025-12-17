import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { FaSearch } from "react-icons/fa";

const MyBids = () => {
  const [bids, setBids] = useState([]);
  const [error, setError] = useState("");
  const [searchTerms, setSearchTerms] = useState("");

  useEffect(() => {
    const fetchMyBids = async () => {
      try {
        const token = localStorage.getItem("jwtToken");
        if (!token) {
          setError("Token not found. Please login again.");
          return;
        }

        const decoded = jwtDecode(token);

        const userId =
          decoded[
            "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"
          ] ||
          decoded.UserId ||
          decoded.userId;

        if (!userId) {
          setError("User ID not found in token");
          return;
        }

        const response = await axios.get(
          `https://localhost:7119/getBidByUser?id=${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (
          response.data &&
          response.data.status === true &&
          Array.isArray(response.data.data?.$values)
        ) {
          setBids(response.data.data.$values);
        } else {
          setBids([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load bids");
      }
    };

    fetchMyBids();
  }, []);

  // 🔍 FRONTEND SEARCH FILTER (NEW)
  const filteredBids = bids
  .filter((bid) =>
    bid.auctionItemName
      ?.toLowerCase()
      .includes(searchTerms.toLowerCase())
  )
  .sort(
    (a, b) => new Date(b.bidTime) - new Date(a.bidTime)
  );


  return (
    <div className="bg-white min-h-screen p-6">

      {/* 🔍 SEARCH BAR (NEW) */}
      <div className="mb-6 relative w-full max-w-[1200px] mx-auto">
        <FaSearch className="absolute left-3 top-3 text-gray-500 text-lg" />

        <input
          type="text"
          placeholder="Search your bids..."
          value={searchTerms}
          onChange={(e) => setSearchTerms(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-md shadow-sm 
                     focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        />
      </div>

      <div
        style={{ maxWidth: "1200px", margin: "auto" }}
        className="cursor-pointer"
      >
        {error && <p style={{ color: "red" }}>{error}</p>}

        {filteredBids.length === 0 && !error && (
          <p>No bids found</p>
        )}

        {filteredBids.map((bid, index) => (
          <div
            key={index}
            className="flex gap-4 items-center border border-gray-200 rounded-lg p-3 mb-4 
                       transition-all duration-300 cursor-pointer
                       hover:shadow-lg hover:-translate-y-1"
          >
            {/* IMAGE */}
            <img
              src={bid.itemImage}
              alt={bid.auctionItemName}
              style={{
                width: "120px",
                height: "120px",
                objectFit: "cover",
                borderRadius: "6px",
              }}
            />

            {/* DETAILS */}
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: "0 0 8px 0" }}>
                {bid.auctionItemName}
              </h4>

              <p style={{ margin: "4px 0" }}>
                <b>Bid Amount:</b>{" "}
                <span style={{ color: "green" }}>
                  ₹{bid.bidAmount}
                </span>
              </p>

              <p style={{ margin: "4px 0", color: "#555" }}>
                <b>Bid Time:</b>{" "}
                {new Date(bid.bidTime).toLocaleString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyBids;