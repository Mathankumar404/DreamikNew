import React, { useState ,useEffect} from "react";
import "./Newsletter.css"; // Ensure this file is correctly linked

function Newsletter() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 480);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 480);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {!isMobile &&
        <section id="newsletter" className="section-p1 section-m1">
          <div className="newstext">
            <h3>Sign Up For Newsletters</h3>
            <p>Get E-mail updates about our latest shop and <span>special offers</span>.</p>
          </div>
          <div className="form">
            <input type="email" placeholder="Enter your email" aria-label="Email address" />
            <button className="signup-btn">Sign Up</button>
          </div>

        </section>
      }
    </>
  );
}

export default Newsletter;
