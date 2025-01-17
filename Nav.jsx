import React, { useState } from 'react';
import ResellerLogin from './ResellerLogin';
import logo from '../assets/logo.png';
import menuIcon from '../assets/menu.png';
import cartLogo from '../assets/cartlogo1.png';
import "../style.css";
import { useNavigate } from 'react-router-dom';
function Navbar({ cartCount }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showResellerLogin, setShowResellerLogin] = useState(false);
   const navigate=useNavigate();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const handleCartClick = () => {
    // Use navigateTo to switch to the "Order" view or cart-related component
    navigate('/order');  // 'Order' can be a custom component or state that represents your cart
  };
  const handleResellerClick = () => {
    if (location.pathname === '/') {
      // Show the Reseller Login modal only on the root route
      setShowResellerLogin(true);
    } else {
      // Navigate to "Other Products" on non-root routes
      navigate('/');
    }
  };
  return (
    <nav id="header">
      <a href="#" className="logo-section">
        <img src={logo} alt="logo" className="logo" />
        <h2>DreamikAI</h2>
      </a>

      <div id="menu" onClick={toggleMenu}>
        <img src={menuIcon} alt="menu" id="menubar" />
      </div>

      <div id="nav" className={menuOpen ? "nav-active" : ""}>
        <ul id="navbar">
          <li>
            <a href="#" onClick={() => navigate('/')} className="active">
              Go To Shop
            </a>
          </li>
          <li>
            <h3
              className="active"
              id="reseller"
              onClick={handleResellerClick}
            >
               {location.pathname === '/' ? 'Reseller Login' : 'Other Products'}
            </h3>
            {showResellerLogin && location.pathname === '/' && (
              <ResellerLogin onClose={() => setShowResellerLogin(false)} />
            )}
          </li>
          <li>
            <input type="text" placeholder="Search..." id="search" />
          </li>
          <li>
            <a href="#" onClick={handleCartClick} className="cart-link"> 
              <img src={cartLogo} alt="cart logo" id="cartlogo" />
              <h3 id="cartnm">{cartCount}</h3>
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;
