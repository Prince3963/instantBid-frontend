import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import './App.css';

import Login from './UserAuth/Login';
import Registration from './UserAuth/Registration';
import Navbar from './Header/Navbar';
import Home from './UserAuth/Home';
import Sidebar from './Component/Sidebar';
import Dashboard from './Component/Dashboard';
import Profile from './Component/Profile';
import AuctionList from './Component/Auction/AuctionList';
import AddAuction from './Component/Auction/AddAuction';
import ViewAuctionDetails from './Component/Auction/ViewAuctionDetails';
import AuctionLive from './Component/Auction/AuctionLive';
import Bid from './Component/Bid/Bid';
import Admin from './Component/Admin/Admin';
import Mybids from './Component/Mybids';
import Auction from './Component/Admin/Auction';
import ViewBids from './Component/Admin/ViewBids';

// Yeh inner component hai jo BrowserRouter ke andar chalega
function AppContent({ isLoggedIn, setIsLoggedIn }) {
  const location = useLocation();

  // In pages par sidebar nahi dikhana
  const hideSidebarPaths = ['/', '/login', '/register'];
  const shouldShowSidebar = !hideSidebarPaths.includes(location.pathname);

  return (
    <div className="h-screen flex flex-col">
      <Navbar />

      {/* Layout under navbar */}
      <div className="flex flex-1">
        {/* Conditionally show Sidebar */}
        {shouldShowSidebar && <Sidebar />}

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto bg-gray-100">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path='/adminDashboard' element={<Admin />} />
            <Route path='/manageAuction' element={<Auction />} />
            <Route path='/viewBids' element={<ViewBids />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/register" element={<Registration setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path='/Auction' element={< AddAuction />} />
            <Route path='/Profile' element={< Profile />} />
            <Route path='/myBids' element={< Mybids /> }/>
            <Route path='/auctionList' element={< AuctionList />} />
            <Route path='/viewDetails' element={<ViewAuctionDetails />} />
            <Route path="/dashboard/:auctionId" element={<AuctionLive />} />
            {/* <Route path= "/bids/:auctionId" element={<Bid />}/> */}
          </Routes>
        </div>
      </div>
    </div>
  );
}

// Yeh main App component hai
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <BrowserRouter>
      <AppContent isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </BrowserRouter>
  );
}

export default App;