import { useNavigate } from 'react-router-dom';

export default function Navbar() {

  const navigate = useNavigate();

  const navigateToLogin = () => {
    navigate('/login'); 
  };

  const navigateToRegister = () => {
    navigate('/register'); 
  };

  return (
    <nav className="flex justify-between items-center px-8 py-4 shadow bg-white">
      {/* Logo */}
      <h1 className="text-2xl font-extrabold text-blue-600 tracking-wide">
        instantBid
      </h1>

      {/* Navigation Links */}
      <ul className="flex gap-6 text-gray-700 font-medium">
        <li>
          <a
            href="#home"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Home
          </a>
        </li>
        <li>
          <a
            href="#about"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            About
          </a>
        </li>
        <li>
          <a
            href="#services"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Services
          </a>
        </li>
        <li>
          <a
            href="#how"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            How It Works
          </a>
        </li>
        <li>
          <a
            href="#contact"
            className="hover:text-blue-600 transition-colors duration-200"
          >
            Contact
          </a>
        </li>
      </ul>

      {/* Login & Sign Up Buttons */}
      {/* <div className="flex gap-4">
        <button className="px-4 py-2 text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 transition duration-200 cursor-pointer"  onClick={navigateToLogin}>
          Login
        </button>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200 cursor-pointer" onClick={navigateToRegister}>
          Sign Up
        </button>
      </div> */}
    </nav>
  );
}
