import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // ✅ new state
  const [responseMessage, setResponseMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setResponseMessage("");

    const formData = new FormData();
    formData.append("Email", email);
    formData.append("Password", password);

    try {
      const response = await axios.post("https://localhost:7119/Login", formData);

      const token = response.data.data;
      const message = response.data.message;

      if (token) {
        localStorage.setItem("jwtToken", token);
        setResponseMessage("Login Successful: " + message);
        navigate("/dashboard");
      } else {
        setError("Login failed: No token received.");
      }
    } catch (err) {
      console.error("Login error:", err);
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError("Login Failed. Please try again.");
      }
    }
  };

  const navigateToRegister = () => {
    navigate("/register");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300 pt-20">
      <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Welcome Back!
        </h2>
        <p className="text-center text-gray-500 mb-8">
          Login to your <span className="font-semibold text-blue-600">instantBid</span> account
        </p>

        <form onSubmit={handleLogin} className="space-y-5">
          {/* Email */}
          <div>
            <label className="block font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"} // ✅ toggle type
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 mt-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />

            {/* Show Password Checkbox */}
            <div className="mt-2">
              <label className="flex items-center text-gray-600 text-sm cursor-pointer">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={showPassword}
                  onChange={() => setShowPassword(!showPassword)}
                />
                Show Password
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-3 rounded-lg font-semibold transition-all"
          >
            Login
          </button>
        </form>

        {responseMessage && (
          <p className="text-green-600 text-center mt-4 font-semibold">{responseMessage}</p>
        )}
        {error && (
          <p className="text-red-600 text-center mt-4 font-semibold">{error}</p>
        )}

        <div className="text-center text-sm mt-6">
          Don't have an account?{" "}
          <span
            className="text-blue-600 font-medium cursor-pointer hover:underline"
            onClick={navigateToRegister}
          >
            Register
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
