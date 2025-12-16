import React, { useEffect, useState } from "react";

function Admin() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getUsers = async () => {
    setLoading(true);
    try {
      const res = await fetch("https://localhost:7119/api/Users/getAllUsers");
      const data = await res.json();

      if (data.status) {
        setUsers(data.data.$values);
      } else {
        setError(data.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      setError("Network error while fetching users");
    }
    setLoading(false);
  };

  const updateUserStatus = async (userId, currentStatus) => {
    if (!window.confirm("Are you sure you want to change user status?")) return;

    try {
      const res = await fetch(
        `https://localhost:7119/api/Users/updateUserStatus?userId=${userId}&isActive=${!currentStatus}`,
        { method: "PUT" }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data?.message || "Something went wrong");
        return;
      }

      if (data.status) {
        setUsers(prev =>
          prev.map(user =>
            user.userId === userId ? { ...user, isActive: !currentStatus } : user
          )
        );
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error(err);
      alert("Network error while updating status");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  if (loading) return <div className="text-center mt-10 text-lg font-semibold">Loading...</div>;

  return (
    <div className="min-h-screen bg-gray-5  0 p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Admin Panel</h1>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <div className="flex flex-col gap-4 max-w-full mx-auto">
        {users.map(user => (
          <div
            key={user.userId}
            className="bg-white rounded-lg shadow-md p-4 flex items-center justify-between
                       transition-transform transform hover:scale-105 hover:shadow-xl"
          >
            {/* Left: Profile Image */}
            <img
              src={user.profileImage || "https://via.placeholder.com/80"}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover mr-4 flex-shrink-0"
            />

            {/* Middle: User Info */}
            <div className="flex-1">
              <h2 className="font-semibold text-lg">{user.name}</h2>
              <p className="text-gray-500">{user.email}</p>
              <p className="mt-1">
                Status:{" "}
                <span className={` font-semibold ${user.isActive ? "text-green-600" : "text-red-600"}`}>
                  {user.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </div>

            {/* Right: Action Button */}
            <button
              onClick={() => updateUserStatus(user.userId, user.isActive)}
              className={`ml-4 px-4 py-2 rounded text-white font-medium transition-colors cursor-pointer
                          ${user.isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {user.isActive ? "Deactivate" : "Activate"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Admin;
