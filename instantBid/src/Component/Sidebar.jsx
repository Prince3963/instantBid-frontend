// Sidebar.jsx me

import { FaHome, FaGavel, FaWallet, FaBell, FaUser } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  return (
    <div className="h-full bg-white shadow w-64 p-6 space-y-4">
      <ul className="space-y-2">
        <li>
          <Link to="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100 text-blue-600 font-semibold">
            <FaHome /> <span>Home</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
            <FaGavel /> <span>My Bids</span>
          </Link>
        </li>
        <li>
          <Link to="/Auction" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
            <FaGavel /> <span>Auctions</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
            <FaWallet /> <span>Wallet</span>
          </Link>
        </li>
        <li>
          <Link to="#" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
            <FaBell /> <span>Notifications</span>
          </Link>
        </li>
        <li>
          <Link to="/Profile" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-100">
            <FaUser /> <span>Profile</span>
          </Link>
          
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
