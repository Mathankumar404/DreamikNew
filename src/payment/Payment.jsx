import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
// import './Payment.css';
const Payment = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [deliveryMode, setDeliveryMode] = useState("normal-delivery");
  const [paymentMode, setPaymentMode] = useState("online-payment");
  const [prodPrice, setProdPrice] = useState(0);
  const [delPrice, setDelPrice] = useState(50); // Default delivery price
  const [cod, setCod] = useState(0); // Default CoD charge
  const [totalPrice, setTotalPrice] = useState(0);
  const [testPayCode, setTestPayCode] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  useEffect(() => {
    // Load Razorpay SDK dynamically
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => console.error("Failed to load Razorpay SDK");
    document.body.appendChild(script);

    const storedOrderData = JSON.parse(localStorage.getItem("OrderData")) || [];
    setOrderData(storedOrderData);
    calculatePrice(storedOrderData);
  }, []);

  const calculatePrice = (data) => {
    let productTotal = 0;

    data.forEach((prod) => {
      const productPrice = parseInt(prod.price, 10);
      if (!isNaN(productPrice)) {
        productTotal += productPrice; // Calculate total price for products
      }
    });

    const updatedDelPrice = deliveryMode === "express-delivery" ? 100 : 50; // Adjust delivery charge based on mode
    setDelPrice(updatedDelPrice);

    const codCharge = paymentMode === "cashon-payment" ? 40 : 0; // Add CoD charge if applicable
    setCod(codCharge);

    const total = productTotal + updatedDelPrice + codCharge;
    setProdPrice(productTotal);
    setTotalPrice(total);
  };

  useEffect(() => {
    calculatePrice(orderData);
  }, [deliveryMode, paymentMode, orderData]);

  const handleDeliveryChange = (e) => {
    setDeliveryMode(e.target.value);
  };

  const handlePaymentChange = (e) => {
    setPaymentMode(e.target.value);
  };

  const handleTestPayCode = (e) => {
    setTestPayCode(e.target.value);
  };

  const handlePayment = async () => {
    let finalAmount = totalPrice;

    // Adjust payment amount for test coupons
    if (testPayCode.slice(0, 8) === "$TESTPAY" && testPayCode.length === 19) {
      finalAmount = finalAmount > 100 ? finalAmount / 100 : finalAmount / 10;
    }

    const options = {
      key: "rzp_test_7y77238", // Replace with your Razorpay Key ID
      amount: finalAmount * 100, // Convert amount to the smallest unit
      currency: "INR",
      name: "DreamikAI",
      description: "Test Transaction",
      image: "/image/logo.png", // Replace with your logo URL
      handler: async (response) => {
        // Save payment details in local storage
        const paymentDetails = {
          PaymentID: response.razorpay_payment_id,
          PaymentAmount: finalAmount,
          PaymentMode: paymentMode,
          DeliveryMode: deliveryMode,
        };

        await localStorage.setItem("PaymentLogs", JSON.stringify(paymentDetails));

        alert("Payment successful! Payment ID: " + response.razorpay_payment_id);
        navigate("/OrderConfirmation/OrderConfirmation");
      },
      prefill: {
        name: JSON.parse(localStorage.getItem("UserDetails"))?.name || "",
        email: JSON.parse(localStorage.getItem("UserDetails"))?.email || "",
        contact: JSON.parse(localStorage.getItem("UserDetails"))?.phone || "",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const razorpayInstance = new window.Razorpay(options);
    razorpayInstance.open();
  };

  return (
    <div>
      <a href="#" className="logo-section">
        <img src="/image/logo.png" alt="logo" className="logo" />
        <h2>DreamikAI</h2>
      </a>
      <h1>Dreamik AI Payment Gateway</h1>

      <div id="optdiv">
        <h2>Payment Gateways</h2>
        <select name="paymentgateway" id="paymentgateway" disabled>
          <option value="razorpay">Razor Pay</option>
        </select>

        <input
          type="text"
          id="testpay"
          placeholder="Test Payment Coupon"
          value={testPayCode}
          onChange={handleTestPayCode}
        />
      </div>

      <div id="price">
        <h3>Product Price: Rs. {prodPrice}</h3>
        <h3>Delivery Charge: Rs. {delPrice}</h3>
        <h3>CoD Charge: Rs. {cod}</h3>
        <h3>Total Payment: Rs. {totalPrice}</h3>
      </div>

      <div id="delivery-options">
        <h2>Delivery Mode</h2>
        <label>
          <input
            type="radio"
            name="delivery"
            value="normal-delivery"
            checked={deliveryMode === "normal-delivery"}
            onChange={handleDeliveryChange}
          />
          Normal Delivery
        </label>
        <label>
          <input
            type="radio"
            name="delivery"
            value="express-delivery"
            checked={deliveryMode === "express-delivery"}
            onChange={handleDeliveryChange}
          />
          Express Delivery
        </label>
      </div>

      <div id="payment-options">
        <h2>Payment Mode</h2>
        <label>
          <input
            type="radio"
            name="payment"
            value="online-payment"
            checked={paymentMode === "online-payment"}
            onChange={handlePaymentChange}
          />
          Online Payment
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="partial-payment"
            checked={paymentMode === "partial-payment"}
            onChange={handlePaymentChange}
          />
          Partial Cash On Delivery
        </label>
        <label>
          <input
            type="radio"
            name="payment"
            value="cashon-payment"
            checked={paymentMode === "cashon-payment"}
            onChange={handlePaymentChange}
          />
          Full Cash On Delivery
        </label>
      </div>

      <button id="pay-button" onClick={handlePayment}>
        Pay Now
      </button>
    </div>
  );
};

export default Payment;
