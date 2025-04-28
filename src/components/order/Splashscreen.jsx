// SplashScreen.js
import React, { useState } from "react";
import Draggable from "react-draggable";
import demoVideo from "/videos/demo video dreamik.mp4";
import customizevideo from "/videos/mobilecustomizedemo.mp4";
import "./SplashScreen.css";
import { useRef } from "react";
const SplashScreen = ({
  onClose,
  isVisible,
  setIsVisible,
  isVisiblecustomize,
  setIsVisiblecustomize,
  isvisiblecutout,
  setisvisiblecutout,
}) => {
  // const [isVisible, setIsVisible] = useState(true);
  const [isVisibleht, setIsVisibleht] = useState(true);
  const nodeRef = useRef(null);
  const nodeRef1 = useRef(null);
  const nodeRef2 = useRef(null);

  const handleclose = () => {
    setIsVisibleht(false);
  };

  return (
    <div>
      {/* Clickable Video Thumbnail */}
      {/* {!isVisible && (
        <div className="video-thumbnail" onClick={handleVideoClick}>
          <video className="thumbnail-video">
            <source src={demoVideo} type="video/mp4" />
          </video>
          <div className="overlay-text">Click Demo Video for order</div>
        </div>)
    
} */}
      {/* Draggable Splash Screen with Video */}


      {isVisiblecustomize && (
        <div className="splash-overlay">
          <Draggable nodeRef1={nodeRef1} enableUserSelectHack={false}>
            <div>
              <div ref={nodeRef1} className="splash-content">
                <video autoPlay controls loop muted playsInline style={{ width: "50%", height: "auto" }}
                >
                  <source src={customizevideo} type="video/mp4" />
                </video>

                <button
                  className="skip-button"
                  onClick={() => {
                    setIsVisiblecustomize(false);
                    onClose();
                    sessionStorage.setItem("functionExecuted", false);
                  }}
                  onTouchEnd={() => {
                    setIsVisiblecustomize(false);
                    onClose();
                    sessionStorage.setItem("functionExecuted", false);
                  }}
                >
                  X
                </button>
                <h4>Demo For customize a Label</h4>
              </div>
            </div>
          </Draggable>
        </div>
      )}

      {isVisible && (
        <div className="splash-overlay">
          <Draggable nodeRef={nodeRef} enableUserSelectHack={false}>
            <div ref={nodeRef} className="splash-content">
              <video autoPlay controls loop muted playsInline>
                <source src={demoVideo} type="video/mp4" />
              </video>

              <button
                className="skip-button"
                onClick={() => {
                  setIsVisible(false);
                  onClose();
                  sessionStorage.setItem("functionExecuted", false);
                }}
                onTouchEnd={() => {
                  setIsVisible(false);
                  onClose();
                  sessionStorage.setItem("functionExecuted", false);
                }}
              >
                X
              </button>

              {isVisibleht && (
                <div
                  className={`product-highlights ${!isVisibleht ? "hidden" : ""
                    }`}
                >
                  <div>
                    <button
                      className="close-highlights"
                      onClick={handleclose}
                      onTouchEnd={handleclose}
                    >
                      X
                    </button>
                  </div>
                  <h2>✨ Our Product Highlights ✨</h2>
                  <ul>
                    <li>
                      <strong>✅ Quick:</strong> Get your product delivered the
                      same day!<span className="astrics">*</span> 🚀
                      <p>
                        (supported in case a reseller available near your
                        locality for self pickup)
                      </p>
                    </li>
                    <li>
                      <strong>✅ Affordable:</strong> The most economical choice
                      in the market! 💰
                    </li>
                    <li>
                      <strong>✅ Safe:</strong> Printed with child-friendly
                      Inkjet colors. 👶🎨
                    </li>
                    <li>
                      <strong>✅ Nearby Delivery:</strong> Extensive reseller
                      network ensures fast, local delivery across India. 📦🇮🇳
                    </li>
                    <li>
                      <strong>✅ Eco-Friendly:</strong> Reduced shipping means
                      lower carbon footprint, savings passed to you! 🌍♻️
                    </li>
                  </ul>
                </div>
              )}
            </div>
          </Draggable>
        </div>
      )}

      {/* Product Highlights Section */}
      {isvisiblecutout && (
        <div className="splash-overlay" style={{ zIndex: 999 }}>
          <Draggable nodeRef={nodeRef2} enableUserSelectHack={false}>
            <div ref={nodeRef2} className="splash-content">
              <video
                autoPlay
                controls
                loop
                muted
                playsInline
                style={{ width: "50%", height: "auto" }}
              >
                <source
                  src={"/Cutoutnameslipdemo/cutoutnsdemo1.mp4"}
                  type="video/mp4"
                />
              </video>

              <button
                className="skip-button"
                onClick={() => {
                  setisvisiblecutout(false);
                  onClose();
                }}
                onTouchEnd={() => {
                  setisvisiblecutout(false);
                  onClose();
                }}
              >
                X
              </button>
            </div>
          </Draggable>
        </div>
      )}
    </div>
  );
};

export default SplashScreen;