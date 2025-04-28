import React, { useEffect } from "react";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const Splashimage = ({ visible, setVisible }) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [visible]);

  const settings = {
    dots: false,
    infinite: true,
    autoplay: false,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true, // ✅ Enables next/prev arrows

  };

  const splashcontent = [
    "/splashscreenImages/splashscreenimage.webp",
    "/splashscreenImages/sampleimage1.webp",
    "/splashscreenImages/sampleimage2.webp",
    "/splashscreenImages/splashvideo1.mp4",
    "/splashscreenImages/splashvideo2.mp4",
  ];

  return (
    <div>
      {visible && (
        <>
          <div className="backdrop-blur"></div>

          <div className="splash-modal">
            <button className="close-button" onClick={() => setVisible(false)}>
              ✖
            </button>

            <div className="slider-container">
              <Slider {...settings}>
                {splashcontent.map((src, index) => {
                  const isVideo = src.endsWith(".mp4");
                  return (
                    <div key={index} className="carousel-item">
                      {isVideo ? (
                        <video
                          src={src}
                          className="splash-image"
                          autoPlay
                          muted
                          loop
                        />
                      ) : (
                        <img
                          src={src}
                          alt={`Splash ${index}`}
                          className="splash-image"
                        />
                      )}
                    </div>
                  );
                })}
              </Slider>
            </div>

            <div className="free-print-offer">
              <strong>🎁 Free Gift:</strong> Get a <strong>6x4 inch photo print</strong> of <em>any one photo</em> absolutely free!<br />
              📩 Just send your selected photo along with your <strong>Order ID</strong> to us via <strong>WhatsApp or Email</strong>.
            </div>
          </div>

          <style>
            {`
              .slider-container {
                width: 100%;
                max-width: 768px;
                margin: 0 auto;
              }

              .carousel-item {
                position: relative;
                width: 100%;
                height: 12rem;
              }

              .backdrop-blur {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                backdrop-filter: blur(8px);
                background-color: rgba(0, 0, 0, 0.2);
                z-index: 999;
              }

              .splash-modal {
                position: fixed;
                top: 10%;
                left: 50%;
                transform: translateX(-50%);
                width: 50%;
                height: 80%;
                background: rgba(255, 255, 255, 0.95);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                flex-direction: column;
                border-radius: 10px;
                box-shadow: 0 0 10px rgba(0,0,0,0.2);
                padding: 10px;
              }

              .close-button {
                position: absolute;
                top: 15px;
                right: 15px;
                background: red;
                color: white;
                border: none;
                padding: 8px 12px;
                font-size: 14px;
                border-radius: 50px;
                cursor: pointer;
                transition: 0.3s;
                z-index:10;
              }

              .splash-image {
                width: 100%;
                max-width: 80%;
                height: auto;
                max-height: 150%;
                object-fit: contain;
                border-radius: 10px;
                margin-left: 50px;
              }

              .free-print-offer {
                background-color: #fff8e1;
                border-left: 5px solid #ff9800;
                padding: 16px 20px;
                margin: 20px 0;
                font-size: 18px;
                font-weight: 500;
                color: #444;
                box-shadow: 0 4px 10px rgba(255, 152, 0, 0.2);
                border-radius: 8px;
                position: relative;
              }

              .free-print-offer::before {
                content: "🎁";
                font-size: 24px;
                position: absolute;
                left: 12px;
                top: 12px;
              }

              /* Positioning */
      .slick-prev, .slick-next {
            top: 50%;
           transform: translateY(-50%);
             z-index: 2;
             width: 50px;
            height: 50px;
}

/* Customize arrows */
.slick-prev::before,
.slick-next::before {
  color: #ff5722; /* 🔶 Change this to your desired color */
  font-size: 50px; /* 🔍 Adjust arrow size */
  opacity: 1;
}

/* Optional: Move them a bit more outward */
.slick-prev {
  left: 0px;
}

.slick-next {
  right: 0px;
}

              @media (max-width: 1024px) {
                .splash-modal {
                  width: 70%;
                  height: 70%;
                }
              }

              @media (max-width: 768px) {
                .splash-modal {
                  width: 90%;
                  height: 60%;
                  top: 25%;
                }

                .close-button {
                  top: 10px;
                  right: 10px;
                  padding: 6px 10px;
                  font-size: 12px;
                }
              }

              @media (max-width: 480px) {
                .splash-modal {
                  width: 95%;
                  height: 60%;
                  top: 25%;
                }

                .close-button {
                  top: 8px;
                  right: 8px;
                  padding: 5px 8px;
                  font-size: 12px;
                }

                .splash-image {
                  max-height: 140%;
margin-left: 36px;            
    }
 .free-print-offer {
               
                font-size: 10px;
                font-weight: 500;
                
              }

              .free-print-offer::before {
                font-size: 12px;
              }
              }
            `}
          </style>
        </>
      )}
    </div>
  );
};

export default Splashimage;
