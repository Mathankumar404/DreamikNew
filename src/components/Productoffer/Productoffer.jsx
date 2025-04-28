import React, { useState, useEffect } from "react";

const ProductOffer = ({ originalPrice, discountPercentage, offerEndTime, productprice, offername, productname }) => {
  const discountedPrice = Math.round(
    originalPrice * (1 - discountPercentage / 100)
  );
  const [timeLeft, setTimeLeft] = useState(offerEndTime);
  const [showOffer, setShowOffer] = useState(offerEndTime > 5 ? true : false);
  const [offers, setoffers] = useState(null);
  if (offerEndTime < 5) {

    sessionStorage.removeItem("cutoutoffer");
    sessionStorage.removeItem("Nameslipoffer");

  }
  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(interval);
          setShowOffer(false); // Hide offer and show original price
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(interval);


  }, []);
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/offer.json");
        const data = await response.json();
        setoffers(data)

      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, [])

  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    const hrs = Math.floor((seconds % (3600 * 24)) / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (productname === "cutoutnameslips" && offerEndTime > 1) {
      const discount = offers?.cutoutnameslips || null;
      sessionStorage.setItem("cutoutoffer", JSON.stringify(discount));
    }

    if (productname === "Nameslips" && offerEndTime > 1) {
      const discount = offers?.nameslips || null;

      sessionStorage.setItem("Nameslipoffer", JSON.stringify(discount));
    }



    return `${days}d ${hrs}hr ${mins}m ${Math.floor(secs)}s`;

  };


  return (
    <div style={{ fontFamily: "Arial, sans-serif", padding: "10px" }}>
   
      {showOffer ? (
        <>
          <div
            style={{
              backgroundColor: "#FA6F52",
              color: "white",
              padding: "5px 10px",
              borderRadius: "20px",
              display: "inline-block",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            {offername}  Offer Ends in <br />{formatTime(timeLeft)}
          </div>
          <div
            style={{
              fontSize: "22px",
              marginTop: "8px",
              color: "#FA6F52",
              fontWeight: "bold",
            }}
          >
            {Math.floor(discountPercentage)}% Off
          </div>
          <div style={{ fontSize: "24px", fontWeight: "bold", color: "#333" }}>
            ₹{discountedPrice}{" "}
            <span
              style={{
                textDecoration: "line-through",
                color: "#999",
                fontSize: "18px",
              }}
            >
              ₹{originalPrice}
            </span>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ color: "green", fontWeight: "bolder" }}>{productname === "Nameslips" ?
            `Matte : ₹ ${originalPrice} / Glossy : ₹ ${originalPrice + 60}` :
            `Price: ₹ ${originalPrice}`}</h2>
        </>
      )}

    </div>
  );
};

export default ProductOffer;