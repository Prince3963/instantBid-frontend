import React, { useState } from "react";
import { jwtDecode } from "jwt-decode";  // Correct import without curly braces
import axios from "axios";

const AddAuction = () => {
  const [auction, setAuction] = useState({
    auctionItemName: "",
    auctionStartTime: "",
    auctionEndTime: "",
    startingBid: "",
    endingBid: "",
  });

  const handleChange = (e) => {
    setAuction({ ...auction, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Step 1: Get raw token string from localStorage
    const rawToken = localStorage.getItem("jwtToken");
    console.log("Raw token from localStorage:", rawToken);

    if (!rawToken) {
      alert("User not logged in. No token found.");
      return;
    }

    // Step 2: Parse token if JSON string, else keep as is
    let token;
    try {
      token = JSON.parse(rawToken);

      // If token is object with "token" key, get that string
      if (typeof token === "object" && token.token) {
        token = token.token;
      }
    } catch (err) {
      // Not JSON, token is already a string
      token = rawToken;
    }

    console.log("Final token to decode:", token);

    if (typeof token !== "string" || token.trim() === "") {
      alert("Invalid token found in localStorage!");
      return;
    }

    // Step 3: Decode token safely
    let decoded;
    try {
      decoded = jwtDecode(token);
    } catch (err) {
      alert("Failed to decode token! Please login again.");
      console.error("JWT decode error:", err);
      return;
    }

    // Step 4: Extract UserId (note case sensitivity)
    const userId = parseInt(decoded.UserId || decoded.userId, 10);
    if (isNaN(userId)) {
      alert("UserId not found in token!");
      return;
    }

    console.log("Decoded userId:", userId);

    // Step 5: Prepare form data
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

      // Clear form
      setAuction({
        auctionItemName: "",
        auctionStartTime: "",
        auctionEndTime: "",
        startingBid: "",
        endingBid: "",
      });
    } catch (error) {
      console.error("Error calling AddAuction API:", error);
      alert("Failed to add auction. Please try again.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md mx-auto p-4 space-y-4"
      autoComplete="off"
    >
      <input
        type="text"
        name="auctionItemName"
        placeholder="Auction Item Name"
        value={auction.auctionItemName}
        onChange={handleChange}
        required
        className="w-full border p-2 rounded"
      />

      <label>
        Auction Start Time:
        <input
          type="datetime-local"
          name="auctionStartTime"
          value={auction.auctionStartTime}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <label>
        Auction End Time:
        <input
          type="datetime-local"
          name="auctionEndTime"
          value={auction.auctionEndTime}
          onChange={handleChange}
          required
          className="w-full border p-2 rounded mt-1"
        />
      </label>

      <input
        type="number"
        name="startingBid"
        placeholder="Starting Bid"
        value={auction.startingBid}
        onChange={handleChange}
        required
        min="0"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        name="endingBid"
        placeholder="Ending Bid (optional)"
        value={auction.endingBid}
        onChange={handleChange}
        min="0"
        className="w-full border p-2 rounded"
      />

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
      >
        Add Auction
      </button>
    </form>
  );
};

export default AddAuction;
