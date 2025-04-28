import { useState, useEffect } from "react";

const Myorder = () => {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    // Retrieve the order details from localStorage
    const storedOrderDetails = JSON.parse(localStorage.getItem("OrderConfirmationData"));

    // Check if the stored order details exist
    if (storedOrderDetails) {
      setOrderId(storedOrderDetails.orderId);
    }
  }, []);

  const handleCopy = () => {
    if (orderId) {
      navigator.clipboard.writeText(orderId).then(() => {
        alert("Order ID copied to clipboard!");
      });
    }
  };

  return (
    <div className="order-id">
      <h2>Order ID</h2>
      <p>{orderId}</p>
      <button onClick={handleCopy}>Copy</button>
    </div>
  );
};

export default Myorder;
