import React, { useContext, useState, useRef, useEffect } from "react";
import ResellerLogin from "./ResellerLogin";
import logo from "/logo.webp";
import menuIcon from "../assets/menu.png";
import { useNavigate, useLocation } from "react-router-dom";
import { CartContext } from "./CartContext";
import "./Nav.css";
import "./navmobile.css";
function Navbar({
  searchText,
  setSearchText,
  resellerLogin,
  setResellerLogin,
  setResellerProducts,
}) {

  const [menuOpen, setMenuOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const [showResellerLogin, setShowResellerLogin] = useState(false);
  const [username, setUsername] = useState();
  const [userid, setUserid] = useState();
  const [showProductsDropdown, setShowProductsDropdown] = useState(false);
  const [isSearchActive, setIsSearchActive] = useState(false); // Track search input visibility
  const navigate = useNavigate();
  const location = useLocation(); // Get current route
  const [showAccountDropdown, setShowAccountDropdown] = useState(false);
  const productdropdownRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
    setIsSearchActive(false);
  };
  const toggleAccountDropdown = () => setShowAccountDropdown((prev) => !prev);

  const handleCartClick = () => {
    navigate("/Order"); // Navigate to the order/cart page
  };

  useEffect(() => {
    setSearchText("");
    setMenuOpen(false);
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("ResellerLogin");
    setShowAccountDropdown(false);
    setShowResellerLogin(false);
    setResellerLogin(false);
    setUsername(null);
    localStorage.removeItem("username");
    localStorage.removeItem("resid");
    localStorage.removeItem("ResellerProducts");
    localStorage.removeItem("Rescoup");
    localStorage.removeItem("address1");
    localStorage.removeItem("state");
    localStorage.removeItem("offercount");
    localStorage.removeItem("resellerform");
    window.location.reload();
  };

  const toggleProductsDropdown = () => {
    setShowProductsDropdown((prev) => !prev);
    // setIsSearchActive(false);
  };

  const handleProductClick = (route) => {
    navigate(route);
    setShowProductsDropdown(false); // Close the dropdown after clicking an item
    setIsSearchActive(false);
  };

  // Close dropdown when clicking outside of it
  useEffect(() => {
    const un = localStorage.getItem("username") || null;
    setUsername(un);
    const uid = localStorage.getItem("resid") || null;
    setUserid(uid);

    const handleOutsideClick = (e) => {
      if (
        productdropdownRef.current &&
        !productdropdownRef.current.contains(e.target)
      ) {
        setShowProductsDropdown(false);
        // setShowAccountDropdown(false);
      }
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowAccountDropdown(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  const isProductsPage = location.pathname === "/"; // Check if the current page is "Products"

  const toggleSearch = () => {
    setIsSearchActive(true); // Toggle search input
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value); // Update search text
  };
  const searchfunction = async () => {
    if (searchText.trim() !== "") {
      try {
        const response = await fetch(
          "https://dreamik-intern.onrender.com/search",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ searchTerm: searchText }),
          }
        );

        const result = await response.json();
        // console.log(result.message);
      } catch (error) {
        console.error("Error saving search:", error);
      }
    }
  };

  return (
    <>
      <nav id="header">
        {!isMobile && (
          <>
            <div id="menu" onClick={toggleMenu}>


              <img src={menuIcon} alt="menu" id="menubar" />
            </div>
            <a href="#" className="logo-section">
              <img
                src={logo}
                alt="logo"
                className="logo"
                onClick={() => navigate("/")}
              />
              <h2
                style={{ marginTop: "10px", }}
                onClick={() => {
                  navigate("/");
                }}
                className="logoname"
              >
                Dreamik{" "}
              </h2>{" "}
              <br />
              {/* <span style={{fontSize:'15px', color:"white"}}>Dream it Get it</span>  */}
            </a>


            {/* <div id={menuOpen ? "nav-active" : "nav"}> */}
            <ul id="navbar">
              <li style={{ marginBottom: "10px" }}>
                <a href="#" onClick={() => navigate("/")} className="active">
                  Go To Shop
                </a>
              </li>

              {/* Show Reseller Login in Products Page */}
              {/* Show username if logged in, otherwise show Reseller Login */}
              <li>
                {username ? (
                  <div className="account-dropdown" ref={dropdownRef}>
                    <i
                      className="fa-solid fa-user account-icon"
                      onClick={toggleAccountDropdown}
                      style={{ color: "#ffae00" }}
                    ></i>
                    {showAccountDropdown && (
                      <div className="dropdown-menu">
                        <p style={{ color: "green" }}>Welcome!</p>
                        <p>{username}</p>
                        <p>({userid})</p>
                        <button
                          onClick={() => {
                            if (
                              window.confirm("Are you sure you want to logout?")
                            ) {
                              handleLogout();
                            }
                          }}
                        >
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <h3
                    className="active"
                    id="reseller"
                    onClick={() => setShowResellerLogin(true)}
                  >
                    Reseller Login
                  </h3>
                )}

                {showResellerLogin && (
                  <ResellerLogin
                    onClose={() => setShowResellerLogin(false)}
                    setUsername={setUsername} // Pass setUsername
                    setUserid={setUserid}
                    setResellerLogin={setResellerLogin}
                    setResellerProducts={setResellerProducts}
                  />
                )}
              </li>

              <li className="active" onClick={() => navigate("/pendingorders")}>
                <h3 id="pendingorders" style={{ cursor: "pointer" }}>
                  Pending Orders
                </h3>
              </li>

              {/* Conditionally render "Other Products" */}
              {!isProductsPage && (
                <li
                  className={`dropdown ${showProductsDropdown ? "dropdown-active" : ""
                    }`}
                  ref={productdropdownRef}
                >
                  <h4
                    className="dropdown-header"
                    id="products"
                    onClick={toggleProductsDropdown}
                    style={{ marginBottom: "10px", fontSize: "20px" }}
                  >
                    Other Products
                  </h4>
                  {showProductsDropdown && (
                    <ul className="dropdown-menu">
                      <li
                        onClick={() => handleProductClick("/NameSlips")}
                        className="dropdown-item"
                      >
                        Name Slips
                      </li>
                      <li
                        onClick={() => handleProductClick("/CutoutNameslips")}
                        className="dropdown-item"
                      >
                        CutoutNameslips
                      </li>
                      <li
                        onClick={() => handleProductClick("/Bulkorder")}
                        className="dropdown-item"
                      >
                        Bulk Order
                      </li>
                      <li
                        onClick={() => handleProductClick("/CustomNameSlips")}
                        className="dropdown-item"
                      >
                        CustomNameslips
                      </li>
                      <li
                        onClick={() => setShowResellerLogin(true)}
                        className="dropdown-item"
                      >
                        Reseller Login
                      </li>
                    </ul>
                  )}
                </li>
              )}

              {/* Search Icon */}
              <li>
                <a href="#" onClick={toggleSearch} className="search-icon-link">
                  {isSearchActive ? (
                    <div>
                      <input
                        ref={searchInputRef}
                        type="text"
                        value={searchText}
                        onChange={handleSearchChange}
                        placeholder="Search..."
                        id="search"
                      />
                      <button id="searchbutton" onClick={searchfunction}>
                        <i className="fa-solid fa-magnifying-glass"></i>
                      </button>
                    </div>

                  ) : (
                    <i
                      className="fa-solid fa-magnifying-glass"
                      onClick={() => {
                        setTimeout(() => {
                          if (searchInputRef.current) {
                            searchInputRef.current.focus();
                          }
                        }, 100);
                      }}
                    ></i>
                  )}
                </a>
              </li>

              {/* Cart Icon */}
              <li>
                <a href="#" onClick={handleCartClick} className="cart-icon-link">
                  <i className="fa-solid fa-cart-shopping"></i>
                  <h3 id="cartnm">{cartCount}</h3>
                </a>
              </li>
            </ul>
          </>

        )}
      </nav>

      {isMobile && <>

        <div id="whole">
          <div className="mobileimg">
            <img src="/mediaquery/menubar.png" alt="" onClick={() => setMenuOpen(true)} />
          </div>
          <div className="mobileimg mobileimg1">
            <img src="/mediaquery/logo.png" alt="" onClick={() => navigate("/")} />
            <h4 onClick={() => navigate("/")}>Dreamik</h4>
          </div>
          <div id="second">
            <div className="mobileimg mobileimg2">
              <a href="#" onClick={() => navigate("/")} className="active">
                <img src="/mediaquery/shop.png" alt="" />
              </a>
            </div>
            <div className="mobileimg mobileimg2">
              {username ? (
                <div className="account-dropdown" ref={dropdownRef}>
                  <i
                    className="fa-solid fa-user account-icon"
                    onClick={toggleAccountDropdown}
                    style={{ color: "#ffae00", fontSize: "20px" }}
                  ></i>
                  {showAccountDropdown && (
                    <div className="dropdown-menu">
                      <p style={{ color: "green" }}>Welcome!</p>
                      <p>{username}</p>
                      <p>({userid})</p>
                      <button
                        onClick={() => {
                          if (
                            window.confirm("Are you sure you want to logout?")
                          ) {
                            handleLogout();
                          }
                        }}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <h3
                  className="active"
                  id="reseller"
                  onClick={() => setShowResellerLogin(true)}
                >
                  <img src="/mediaquery/resellerlogo.png" alt="" />

                </h3>
              )}

              {showResellerLogin && (
                <ResellerLogin
                  onClose={() => setShowResellerLogin(false)}
                  setUsername={setUsername} // Pass setUsername
                  setUserid={setUserid}
                  setResellerLogin={setResellerLogin}
                  setResellerProducts={setResellerProducts}
                />
              )}
            </div>
            <div className="mobileimg mobileimg2">
              <img src="/mediaquery/pending.png" alt="" onClick={() => navigate("/pendingorders")} />

            </div>
            <div className="mobileimg mobileimg2">
              <img src="/mediaquery/cart.png" alt="" onClick={handleCartClick} />
              <h3 id="cartnm1">{cartCount}</h3>
            </div>
          </div>

        </div>
        <div className="searchbar1">
          <input type="text" className="searchbar2" placeholder="what are you looking for ?" ref={searchInputRef}
            value={searchText}
            onChange={handleSearchChange} />
          <img src="/mediaquery/searchicon.png" alt="" onClick={searchfunction} />
        </div>

        {menuOpen && (
          <div className="side-menu">
            <button className="dropdown-cls-btn" onClick={() => setMenuOpen(false)}>×</button>
            <ul >
              <li onClick={() => handleProductClick("/NameSlips")} className="dropdown-item">
                Name Slips
              </li>
              <li onClick={() => handleProductClick("/CutoutNameslips")} className="dropdown-item">
                CutoutNameslips
              </li>
              <li onClick={() => handleProductClick("/Bulkorder")} className="dropdown-item">
                Bulk Order
              </li>
              <li onClick={() => handleProductClick("/CustomNameSlips")} className="dropdown-item">
                CustomNameslips
              </li>

            </ul>
          </div>
        )}

      </>}
    </>
  );
}

export default Navbar;