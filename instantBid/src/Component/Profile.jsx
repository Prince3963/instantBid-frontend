import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // State to toggle edit mode
  const [editableData, setEditableData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken'); // Token check

    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      navigate('/login'); // Redirect to login if token is not found
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://localhost:7119/api/Users/GetUserById', {
          headers: {
            Authorization: `Bearer ${token}` // Sending token in Authorization header
          }
        });

        if (response && response.data) {
          setProfileData(response.data); // Store profile data
          setEditableData(response.data); // Initial editable data
        } else {
          setError('No profile data found');
        }

        setLoading(false); // Set loading to false once data is fetched
      } catch (err) {
        console.error("API Call Error:", err);
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData(); // Call the function to fetch profile data
  }, [navigate]);

  // const handleEditToggle = () => {
  //   setIsEditing(!isEditing); // Toggle edit mode
  // };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // const handleSaveChanges = async () => {
  //   const token = localStorage.getItem('jwtToken');
  //   const userId = profileData?.id;  // Extracting ID from profileData
  //   if (!token || !userId) {
  //     setError('No token or user ID found. Please log in.');
  //     return;
  //   }

  //   // try {
  //   //   // Send PATCH request to update the user profile with ID
  //   //   const response = await axios.patch(`https://localhost:7119/api/Users/updateUserData/${userId}`, editableData, {
  //   //     headers: {
  //   //       Authorization: `Bearer ${token}`,
  //   //     },
  //   //   });

  //   //   if (response.data) {
  //   //     setProfileData(response.data); // Update profile data with saved changes
  //   //     setIsEditing(false); // Exit edit mode
  //   //     setError(null); // Reset error state
  //   //   }
  //   // } catch (err) {
  //   //   setError('Failed to save changes');
  //   // }
  // };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-gray-600">Loading...</div>
      </div>
    ); // Show loading message while fetching
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl font-medium text-red-600">{error}</div>
      </div>
    ); // Show error message if there is an issue
  }

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">Your Profile</h2>
      
      {profileData ? (
        <div className="space-y-4">
          {/* Profile image */}
          <div className="flex justify-center">
            {profileData.profileImage ? (
              <img 
                src={profileData.profileImage} 
                alt="Profile" 
                className="w-32 h-32 rounded-full object-cover shadow-md"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-2xl">
                <span>{profileData.name?.charAt(0)}</span>
              </div>
            )}
          </div>

          {/* Profile details */}
          <div className="text-gray-700">
            <div className="flex justify-between">
              <span className="font-semibold">Name:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={editableData.name}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                />
              ) : (
                <span>{profileData.name}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Email:</span>
              {isEditing ? (
                <input
                  type="email"
                  name="email"
                  value={editableData.email}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                />
              ) : (
                <span>{profileData.email}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Date of Birth:</span>
              {isEditing ? (
                <input
                  type="date"
                  name="dateOfBirth"
                  value={editableData.dateOfBirth}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                />
              ) : (
                <span>{profileData.dateOfBirth}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Address:</span>
              {isEditing ? (
                <input
                  type="text"
                  name="address"
                  value={editableData.address}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                />
              ) : (
                <span>{profileData.address}</span>
              )}
            </div>

            <div className="flex justify-between">
              <span className="font-semibold">Account Balance:</span>
              {isEditing ? (
                <input
                  type="number"
                  name="accountBalance"
                  value={editableData.accountBalance}
                  onChange={handleInputChange}
                  className="border p-2 rounded-md"
                />
              ) : (
                <span className="text-green-600">${profileData.accountBalance}</span>
              )}
            </div>
          </div>

          {/* Edit Button */}
          {/* <div className="flex justify-center mt-4">
            <button
              onClick={handleEditToggle}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-lg focus:outline-none hover:bg-blue-700"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
            {isEditing && (
              <button
                onClick={handleSaveChanges}
                className="ml-4 px-4 py-2 bg-green-600 text-white rounded-lg focus:outline-none hover:bg-green-700"
              >
                Save Changes
              </button>
            )}
          </div> */}
        </div>
      ) : (
        <p className="text-center text-gray-600">No profile data available</p>
      )}
    </div>
  );
};

export default Profile;
