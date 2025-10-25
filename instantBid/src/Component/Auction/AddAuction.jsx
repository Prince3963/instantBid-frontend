import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const AddAuction = () => {
  const [auction, setAuction] = useState({
    auctionItemName: "",
    auctionStartTime: "",
    auctionEndTime: "",
    startingBid: "",
    endingBid: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setAuction({ ...auction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Step 1: Get raw token
    const rawToken = localStorage.getItem("jwtToken");
    if (!rawToken) {
      setError("User not logged in. No token found.");
      setLoading(false);
      return;
    }

    let token;
    try {
      token = JSON.parse(rawToken);
      if (typeof token === "object" && token.token) token = token.token;
    } catch {
      token = rawToken;
    }

    if (!token || typeof token !== "string") {
      setError("Invalid token found in localStorage!");
      setLoading(false);
      return;
    }

    // Step 2: Decode
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      setError("Failed to decode token! Please login again.");
      setLoading(false);
      return;
    }

    const userId = parseInt(decoded.UserId || decoded.userId, 10);
    if (isNaN(userId)) {
      setError("UserId not found in token!");
      setLoading(false);
      return;
    }

    // Step 3: Prepare form data
    const formData = new FormData();
    formData.append("AuctionItemName", auction.auctionItemName);
    formData.append("AuctionStartTime", auction.auctionStartTime);
    formData.append("AuctionEndTime", auction.auctionEndTime);
    formData.append("StartingBid", auction.startingBid);
    formData.append("EndingBid", auction.endingBid);
    formData.append("UserId", userId);

    try {
      const response = await axios.post(
        "https://localhost:7119/AddAuction",
        formData
      );

      alert("Auction added successfully!");
      console.log("API response:", response.data);

      setAuction({
        auctionItemName: "",
        auctionStartTime: "",
        auctionEndTime: "",
        startingBid: "",
        endingBid: "",
      });
    } catch (error) {
      console.error("Error calling AddAuction API:", error);
      setError("Failed to add auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-6 rounded-xl">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Create Auction</h2>
        
      </div>

      {/* Form */}
      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        <div>
          <label className="text-sm font-medium text-gray-600">
            Auction Item Name
          </label>
          <input
            type="text"
            name="auctionItemName"
            placeholder="Enter auction item name"
            value={auction.auctionItemName}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Auction Start Time
          </label>
          <input
            type="datetime-local"
            name="auctionStartTime"
            value={auction.auctionStartTime}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Auction End Time
          </label>
          <input
            type="datetime-local"
            name="auctionEndTime"
            value={auction.auctionEndTime}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Starting Bid
          </label>
          <input
            type="number"
            name="startingBid"
            placeholder="Enter starting bid"
            value={auction.startingBid}
            onChange={handleChange}
            required
            min="0"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">
            Ending Bid (optional)
          </label>
          <input
            type="number"
            name="endingBid"
            placeholder="Enter ending bid"
            value={auction.endingBid}
            onChange={handleChange}
            min="0"
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-600"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`bg-blue-600 cursor-pointer text-white px-6 py-2 rounded-xl text-lg font-semibold transition-all duration-200 ${
            loading ? "bg-gray-400" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Add Auction"}
        </button>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>
    </div>
  );
};

export default AddAuction;
