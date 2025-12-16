import { FaHome, FaGavel, FaWallet, FaUser, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const location = useLocation();
  const role = localStorage.getItem('role'); // ✅ get role from localStorage

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    localStorage.removeItem('jwtToken');
    localStorage.removeItem('role');
    window.location.href = '/login';
  };

  return (
    <div className="h-screen bg-white shadow w-64 p-6 flex flex-col justify-between sticky top-0">
      {/* --- Menu Items --- */}
      <ul className="space-y-2">
        {role === 'Admin' && (
          <>
            <li>
              <Link
                to="/adminDashboard"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white font-semibold ${isActive('/adminDashboard') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaHome /> <span>Admin Dashboard</span>
              </Link>
            </li>
            <li>
              <Link
                to="/manage-users"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white ${isActive('/manage-users') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaUsers /> <span>Manage Users</span>
              </Link>
            </li>
            {/* Add more Admin specific links here */}
          </>
        )}

        {role === 'Bidder' && (
          <>
            <li>
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white font-semibold ${isActive('/dashboard') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaHome /> <span>Home</span>
              </Link>
            </li>
            <li>
              <Link
                to="/my-bids"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white ${isActive('/my-bids') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaGavel /> <span>My Bids</span>
              </Link>
            </li>
            <li>
              <Link
                to="/Auction"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white ${isActive('/Auction') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaGavel /> <span>Add Auction</span>
              </Link>
            </li>
            <li>
              <Link
                to="/auctionList"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white ${isActive('/auctionList') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaWallet /> <span>Wallet</span>
              </Link>
            </li>
            <li>
              <Link
                to="/Profile"
                className={`flex items-center space-x-2 p-2 rounded hover:bg-blue-600 hover:text-white ${isActive('/Profile') ? 'bg-blue-600 text-white' : ''}`}
              >
                <FaUser /> <span>Profile</span>
              </Link>
            </li>
          </>
        )}
      </ul>

      {/* --- Logout Button --- */}
      <button
        onClick={handleLogout}
        className="flex items-center cursor-pointer space-x-2 p-2 rounded hover:bg-red-600 hover:text-white w-full font-semibold text-red-500"
      >
        <FaSignOutAlt /> <span>Logout</span>
      </button>
    </div>
  );
};

export default Sidebar;
