import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ViewAuctionDetails() {
  const [item, setItem] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetails = async () => {
    try {
      const response = await axios.get("https://localhost:7119/getItem");
      console.log("API RESPONSE:", response.data);
      setItem(response.data.data); // 👈 make sure to access the correct level
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
      setError("Failed to fetch Details..");
    }
  };

  useEffect(() => {
    fetchDetails();
  }, []);

  if (loading) {
    return <div>Loading Details...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>View Auction Details</h2>
      {item && item.length > 0 ? (
        item.map((items, index) => (
          <div key={index} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
            <h3>{items.itemName}</h3>
            <p>{items.itemDescription}</p>
            {items.itemImageURL && (
              <img
                src={items.itemImageURL}
                alt={items.itemName}
                width="200"
                height="200"
              />
            )}
            <p>Status: {items.status ? "Active" : "Inactive"}</p>
            <p>Created At: {new Date(items.createdAt).toLocaleString()}</p>
          </div>
        ))
      ) : (
        <p>No items Found...</p>
      )}
    </div>
  );
}

export default ViewAuctionDetails;
