import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const [profileData, setProfileData] = useState(null); 
  const [editableData, setEditableData] = useState({}); 
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null); 
  const [previewImage, setPreviewImage] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found. Please log in.');
      setLoading(false);
      navigate('/login');
      return;
    }

    const fetchProfileData = async () => {
      try {
        const response = await axios.get('https://localhost:7119/api/Users/GetUserById', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response?.data) {
          setProfileData(response.data);
          setEditableData(response.data);
        } else {
          setError('No profile data found');
        }
        setLoading(false);
      } catch (err) {
        console.error('API Call Error:', err);
        setError('Failed to fetch profile data');
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditableData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreviewImage(URL.createObjectURL(file)); 
    }
  };

  const toggleEdit = () => setIsEditing((prev) => !prev);

  const handleSave = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) {
      setError('No token found.');
      return;
    }

    const formData = new FormData();
    formData.append("name", editableData.name);
    formData.append("email", editableData.email);
    formData.append("address", editableData.address);
    formData.append("accountBalance", editableData.accountBalance);
    formData.append("dateOfBirth", editableData.dateOfBirth);

    if (selectedImage) {
      formData.append("profileImage", selectedImage);
    }

    try {
      const response = await axios.patch(`https://localhost:7119/updateUserData/0`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Update Success:', response.data);
      setProfileData(editableData);
      setIsEditing(false);
      setPreviewImage(null);
      setSelectedImage(null);
    } catch (err) {
      console.error('Update Failed:', err);
      setError('Failed to update profile');
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-gray-500">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-xl font-semibold text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">

        {/* Header */}
        <div className="bg-blue-600 py-12 text-center">

          {/* Profile Image */}
          <div className="relative inline-block">

            {(previewImage || profileData?.profileImageRead) ? (
              <img
                className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-lg transition-all duration-300"
                src={previewImage || profileData.profileImageRead}
                alt="Profile"
              />
            ) : (
              <div className="w-32 h-32 rounded-full bg-gray-300 flex items-center justify-center text-white text-4xl border-4 border-white shadow-md">
                {profileData?.name?.charAt(0)}
              </div>
            )}

            {/* Upload Button */}
            {isEditing && (
              <label 
                htmlFor="fileInput"
                className="absolute bottom-0 right-0 bg-white text-blue-600 border border-blue-600 px-3 py-1 text-xs rounded-full shadow-md cursor-pointer hover:bg-blue-600 hover:text-white transition-all duration-200"
              >
                Change
              </label>
            )}

            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          <h2 className="mt-4 text-2xl font-bold text-white">{profileData?.name}</h2>
          <p className="mt-1 text-blue-100">{profileData?.email}</p>
        </div>

        {/* Info Section */}
        <div className="px-6 py-10 space-y-8">

          {[ 
            { label: 'Name', name: 'name', type: 'text' },
            { label: 'Email', name: 'email', type: 'email' },
            { label: 'Date of Birth', name: 'dateOfBirth', type: 'date' },
            { label: 'Address', name: 'address', type: 'text' },
            { label: 'Account Balance', name: 'accountBalance', type: 'number' },
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-gray-700 font-medium mb-2">{field.label}</label>

              {isEditing ? (
                <input
                  type={field.type}
                  name={field.name}
                  value={editableData[field.name] ?? ''}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              ) : (
                <div
                  className={`px-4 py-3 bg-gray-100 rounded-lg text-gray-800 ${
                    field.name === 'accountBalance' ? 'text-green-600 font-semibold' : ''
                  }`}
                >
                  {field.name === 'accountBalance'
                    ? `$${profileData[field.name]}`
                    : profileData[field.name]}
                </div>
              )}
            </div>
          ))}

          {/* Buttons */}
          <div className="flex justify-center">
            {isEditing ? (
              <button
                onClick={handleSave}
                className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-200"
              >
                Save Changes
              </button>
            ) : (
              <button
                onClick={toggleEdit}
                className="px-8 py-3 bg-blue-600 cursor-pointer text-white font-semibold rounded-lg hover:bg-blue-700 transform hover:scale-105 transition duration-200"
              >
                Edit Profile
              </button>
            )}
          </div>

        </div>
      </div>
    </div>
  );
};

export default Profile;
