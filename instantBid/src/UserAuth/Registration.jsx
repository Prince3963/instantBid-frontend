import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Registration = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    dateOfBirth: "",
    address: "",
    roleId: 2,
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);


  const validateForm = () => {
    let tempErrors = {};
    let isValid = true;

    if (!formData.name.trim()) {
      tempErrors.name = "Name is required";
      isValid = false;
    }

    if (!formData.email.trim()) {
      tempErrors.email = "Email is required";
      isValid = false;
    }

    if (!formData.password || formData.password.length < 6) {
      tempErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    if (!formData.dateOfBirth) {
      tempErrors.dateOfBirth = "Date of Birth is required";
      isValid = false;
    }

    if (!formData.address.trim()) {
      tempErrors.address = "Address is required";
      isValid = false;
    }

    setErrors(tempErrors);
    return isValid;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      setSubmitted(false);
      return;
    }

    try {
      const form = new FormData();
      form.append("Name", formData.name);
      form.append("Email", formData.email);
      form.append("Password", formData.password);
      form.append("DateOfBirth", formData.dateOfBirth);
      form.append("Address", formData.address);
      form.append("RoleId", formData.roleId);

      const res = await axios.post(
        "https://localhost:7119/api/Users/RegisterUser",
        form,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Registration success:", res.data);
      window.location.href = '/login'
      setSubmitted(true);
    } catch (error) {
      console.error("Error while registering:", error);
      alert("Registration failed. Check console.");
      setSubmitted(false);
    }
  };

  const navigateToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-20">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create Your Biding Account
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Start bidding with{" "}
          <span className="font-semibold text-blue-600">instantBid</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700">Full Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter your full name"
              onChange={handleChange}
              value={formData.name}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              onChange={handleChange}
              value={formData.email}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email}</p>}
          </div>
          
          {/* Password */}
          <div className="relative">
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              onChange={handleChange}
              value={formData.password}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400 pr-10"
            />
            <span
              className="absolute right-3 mt-6 transform -translate-y-1/2 text-gray-500 cursor-pointer"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
            {errors.password && <p className="text-red-600 text-sm mt-1">{errors.password}</p>}
          </div>

          {/* DOB */}
          <div>
            <label className="block font-medium text-gray-700">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              onChange={handleChange}
              value={formData.dateOfBirth}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.dateOfBirth && (
              <p className="text-red-600 text-sm mt-1">{errors.dateOfBirth}</p>
            )}
          </div>
          

          {/* Address */}
          <div>
            <label className="block font-medium text-gray-700">Address</label>
            <input
              type="text"
              name="address"
              placeholder="Enter your address"
              onChange={handleChange}
              value={formData.address}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.address && <p className="text-red-600 text-sm mt-1">{errors.address}</p>}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Register
          </button>
        </form>

        {submitted && (
          <p className="text-green-600 text-center mt-4 font-semibold">
            Registration successful! 🎉
          </p>
        )}

        <div className="text-center text-sm mt-6">
          Already have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={navigateToLogin}
          >
            Login
          </span>
        </div>
      </div>
    </div>
  );
};

export default Registration;
