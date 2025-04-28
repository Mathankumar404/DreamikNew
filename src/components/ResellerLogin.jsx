import React, { useState } from "react";
import "../ResellerLogin.css";
import { useEffect } from "react";
function ResellerLogin({ onClose, setUsername,setUserid, setResellerLogin, setResellerProducts }) {
  const [usernameInput, setUsernameInput] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(false); 
  // New loading state
  useEffect(() => {
    const storedReseller = localStorage.getItem("loggedReseller");
    if (storedReseller) {
      setReseller(JSON.parse(storedReseller));
    }
  }, []);
   

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loading
    setMessage("🔄 Logging in... Please wait!");

    try {
      const response = await fetch("https://dreamik-intern.onrender.com/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username: usernameInput, password }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Welcome, ${data.user.name}!`);
        setIsLoggedIn(true);
        setUsername(data.user.name);
        setUserid(data.user.id);
        setResellerProducts(data.user.products);
        setResellerLogin(true);
        setTimeout(onClose, 1000);
        localStorage.setItem("ResellerLogin",true)
        localStorage.setItem('username',data.user.name)
        localStorage.setItem('resid',data.user.id);
        localStorage.setItem('ResellerProducts',data.user.products);
        localStorage.setItem('Rescoup',data.user.coupon);
        localStorage.setItem('address1',data.user.address1);
        localStorage.setItem('state',data.user.state);
        localStorage.setItem('offercount',data.user.offercount);
        localStorage.setItem('resellerform',JSON.stringify(data.user));
        window.location.reload();


      } else {
        setMessage("❌ Invalid Username or Password!");
      }
    } catch (error) {
      console.error("Error:", error);
      setMessage("⚠️ Server error. Try again later.");
    } finally {
      setIsLoading(false); // Stop loading
    }
  };

  return (
    <div className="popup-overlay">
      <div className="popup-window">
        <button className="close-button" onClick={onClose}>
          &times;
        </button>
        <h2 id="heading">Reseller Login</h2>
        <h2 id="message">{message}</h2>

        {!isLoggedIn ? (
          <form onSubmit={handleSubmit} id="loginform">
            <input
              type="text"
              placeholder="Username"
              value={usernameInput}
              onChange={(e) => setUsernameInput(e.target.value)}
              id="resellername"
              disabled={isLoading} // Disable input while logging in
            />
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              id="resellerpassword"
              disabled={isLoading}
            />
            <button type="submit" id="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Submit"}
            </button>
          </form>
        ) : (
          <div className="welcome-message">
            <h3>You are now logged in! 🎉</h3>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResellerLogin;