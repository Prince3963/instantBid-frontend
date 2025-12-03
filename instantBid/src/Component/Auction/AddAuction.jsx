import React, { useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";

const AddAuction = () => {
  const [auction, setAuction] = useState({
    itemName: "",
    itemDescription: "",
    itemImage: null,
    auctionItemName: "",
    auctionStartTime: "",
    auctionEndTime: "",
    startingBid: "",
    endingBid: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === "itemImage") {
      setAuction({ ...auction, itemImage: files[0] });
    } else {
      setAuction({ ...auction, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

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

    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch {
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

    const formData = new FormData();
    formData.append("ItemName", auction.itemName);
    formData.append("ItemDescription", auction.itemDescription);
    if (auction.itemImage) formData.append("ItemImage", auction.itemImage);
    formData.append("AuctionItemName", auction.auctionItemName);
    formData.append("AuctionStartTime", auction.auctionStartTime);
    formData.append("AuctionEndTime", auction.auctionEndTime);
    formData.append("StartingBid", auction.startingBid);
    formData.append("CurrentBid", auction.endingBid);
    formData.append("UserId", userId);

    try {
      await axios.post("https://localhost:7119/AddAuction", formData);
      setSuccess(true);

      setAuction({
        itemName: "",
        itemDescription: "",
        itemImage: null,
        auctionItemName: "",
        auctionStartTime: "",
        auctionEndTime: "",
        startingBid: "",
        endingBid: "",
      });

      // Auto hide popup after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      console.error(err);
      setError("Failed to add auction. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg mt-6 rounded-xl relative">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Create Auction</h2>

      <form className="space-y-4" onSubmit={handleSubmit} autoComplete="off">
        {/* Item Fields */}
        <div>
          <label className="text-sm font-medium text-gray-600">Item Name</label>
          <input
            type="text"
            name="itemName"
            value={auction.itemName}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Item Description</label>
          <textarea
            name="itemDescription"
            value={auction.itemDescription}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-gray-600">Item Image</label>
          <br />
          <input
            type="file"
            accept="image/*"
            name="itemImage"
            onChange={handleChange}
            className="w-fit mt-2 p-2 hover:font-bold hover:bg-blue-500 border-s-white rounded hover:text-white cursor-pointer"
          />
          {auction.itemImage && (
            <img
              src={URL.createObjectURL(auction.itemImage)}
              alt="Preview"
              className="mt-3 h-40 w-40 object-cover rounded-xl border"
            />
          )}
        </div>

        {/* Auction Fields */}
        <div>
          <label className="text-sm font-medium text-gray-600">Auction Item Name</label>
          <input
            type="text"
            name="auctionItemName"
            placeholder="Enter auction item name"
            value={auction.auctionItemName}
            onChange={handleChange}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Auction Start Time</label>
            <input
              type="datetime-local"
              name="auctionStartTime"
              value={auction.auctionStartTime}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Auction End Time</label>
            <input
              type="datetime-local"
              name="auctionEndTime"
              value={auction.auctionEndTime}
              onChange={handleChange}
              required
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-600">Starting Bid</label>
            <input
              type="number"
              name="startingBid"
              placeholder="Enter starting bid"
              value={auction.startingBid}
              onChange={handleChange}
              required
              min="0"
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Ending Bid (optional)</label>
            <input
              type="number"
              name="endingBid"
              placeholder="Enter ending bid"
              value={auction.endingBid}
              onChange={handleChange}
              min="0"
              className="w-full p-3 mt-2 border border-gray-300 rounded-xl"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-blue-600 text-white py-3 rounded-xl text-lg font-semibold transition-all duration-200 ${
            loading ? "bg-gray-400 cursor-not-allowed" : "hover:bg-blue-700"
          }`}
        >
          {loading ? "Saving..." : "Add Auction"}
        </button>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}
      </form>

      {/* Small UI-friendly Success Popup */}
      {success && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-lg shadow-lg animate-slide-in">
          Auction Added Successfully!
        </div>
      )}
    </div>
  );
};

export default AddAuction;
