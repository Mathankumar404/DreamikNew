import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import JSZip from "jszip";
import './Payment.css';
import * as XLSX from 'xlsx';
import Googleform from "../order/Googleform";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Payment = () => {
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [priceDetails, setPriceDetails] = useState({});
  const [deliveryMode, setDeliveryMode] = useState("");
  const [paymentMode, setPaymentMode] = useState("");
  const [testPayCode, setTestPayCode] = useState("");
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const [formContainer, setFormContainer] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [fname, setFname] = useState("");
  const [zipFile, setZipFile] = useState(null);
  const [iserror, seterror] = useState(false);
  const [orderid, setorderid] = useState('');
  const [orderid2, setOrderId2] = useState('')
  const [couponCode, setCouponCode] = useState('');
  // const [bulkZip, setBulkZip] = useState(null);
  // const [bulkdata, setBulkData] = useState([]);

  const generateRandomString = (length = 5) => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  const generateOrderID = () => {
    if (formContainer?.name) {
      const prefix = formContainer.coupon ? "R" : "C";
      const generatedFname = `${prefix}${formContainer.name}`;
      setFname(generatedFname);
      const now = new Date();
      return `${generatedFname}${now.toISOString().replace(/[-:.TZ]/g, "")}-${generateRandomString()}-v1`;
    }
    return "";
  };

  const loadRazorpaySDK = () => {
    if (sdkLoaded) return;
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => setSdkLoaded(true);
    script.onerror = () => alert("Error loading payment gateway. Please try again later.");
    document.body.appendChild(script);
  };

  useEffect(() => {
    loadRazorpaySDK();
    const storedOrderData = JSON.parse(localStorage.getItem("OrderData")) || [];
    const storedPriceDetails = JSON.parse(localStorage.getItem("PriceData")) || {};
    const storedPaymentDetails = JSON.parse(localStorage.getItem("PaymentDetails")) || {};
    const storedFormContainer = JSON.parse(localStorage.getItem("FormContainer")) || {};
    // const storedBulkZipFiles = localStorage.getItem("zipFileData")|| [];

    setOrderData(storedOrderData);
    setPriceDetails(storedPriceDetails);
    setPaymentMode(storedPaymentDetails?.paymentMode || "");
    setDeliveryMode(storedPaymentDetails?.deliveryMode || "");
    setFormContainer(storedFormContainer);
    // setBulkData(storedBulkZipFiles);
    setCouponCode(storedFormContainer.coupon)
    createZipFile(storedOrderData);
    // Bulkzip(storedBulkZipFiles);
  }, []);

  const createZipFile = async (orderData) => {
    const zip = new JSZip();
    for (const [index, item] of orderData.entries()) {
      if (item?.image) {
        const base64Data = item.image.replace(/^data:image\/\w+;base64,/, "");
        const binaryData = atob(base64Data);
        const arrayBuffer = new Uint8Array(binaryData.length);
        for (let i = 0; i < binaryData.length; i++) {
          arrayBuffer[i] = binaryData.charCodeAt(i);
        }
        zip.file(`order_image_${index + 1}.png`, arrayBuffer);
      }
    }
    const content = await zip.generateAsync({ type: "blob" });
    setZipFile(content);
  };

  // const Bulkzip = async (bulkdata) => {
  //     const zip = new JSZip();
  //     bulkdata.forEach((zipFile, index) => {
  //       if (zipFile) {
  //         const base64Data = zipFile.replace(/^data:application\/zip;base64,/, "");
  //         const binaryData = atob(base64Data);
  //         const byteArray = new Uint8Array(binaryData.length);
  //         for (let i = 0; i < binaryData.length; i++) {
  //           byteArray[i] = binaryData.charCodeAt(i);
  //         }
  //         zip.file(`bulkimage_${index + 1}.png`, byteArray);
  //       }
  //     });
  //     const zipBlob = await zip.generateAsync({ type: "blob"});
  //     setBulkZip(zipBlob);
  // };

  const handlePayment = async () => {
    if (!sdkLoaded) {
      alert("Payment gateway not loaded. Please try again later.");
      return;
    }
    setIsLoading(true);
    let finalAmount = paymentMode === "partial-payment" ? Math.round(priceDetails?.totalPrice / 2) : priceDetails?.totalPrice || 0;
    if (testPayCode.startsWith("$TESTPAY$") && testPayCode.length === 19) {
      finalAmount = finalAmount > 100 ? finalAmount / 100 : finalAmount / 10;
    }
    if (testPayCode.startsWith("$DISCOUNT$") && testPayCode.length === 20) {
      finalAmount = finalAmount > 100 ? finalAmount / 10 : finalAmount;
    }

    const currentDomain = window.location.hostname;

    const saveOrderDetails = async (paymentData) => {
      const orderId = generateOrderID();
      const reseller = localStorage.getItem("resid")?.slice(0, 2) || "cs";
      setorderid(orderId)
      var resellerid = reseller;
      let OrderId2; // Define it outside so it's accessible later
      try {
        const res = await fetch(
          "https://0xij5t5kzk.execute-api.ap-south-1.amazonaws.com/prod/generate-id",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              invoiceid: orderId,
              requesterid: resellerid,
              requestmobil: formContainer.phone,
              option: "none",
            }),
          }
        );

        if (res.ok) {
          const data = await res.json(); // Await the JSON parsing
          OrderId2 = data.orderid; // Extract order ID
          setOrderId2(OrderId2);
        } else {
          console.log("Request failed:", res.status, res.statusText);
        }
      } catch (e) {
        console.error("Error:", e);
      }
      const orderDetails = {
        orderId,
        OrderId2,
        orderData,
        paymentDetails: paymentData,
        formContainer,
        priceDetails,
      };

      localStorage.setItem("OrderConfirmationData", JSON.stringify(orderDetails));
      try {
        const excelfile = JSON.parse(localStorage.getItem("excelfile")) || [];
        const uploadForm = new FormData();
        const paymentBlob = new Blob([JSON.stringify(paymentData)], { type: "application/json" });
        const infoBlob = new Blob([JSON.stringify(formContainer)], { type: "application/json" });
        if (excelfile.length > 0 && excelfile[0].items && excelfile[0].items.length > 0) {
          const items = excelfile[0].items;  // Accessing the correct data
          const worksheet = XLSX.utils.json_to_sheet(items); // Convert JSON to worksheet
          const workbook = XLSX.utils.book_new();            // Create a new workbook
          XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1"); // Add worksheet to workbook

          // Generate Excel file as Blob
          const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
          const excelBlob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });

          excelBlob ? uploadForm.append("excelfile", excelBlob, "excelfile.xlsx") : console.log(null);
        } else {
          console.log();
        }
        uploadForm.append("payment", paymentBlob, "payment.json");
        uploadForm.append("info", infoBlob, "info.json");
        zipFile ? uploadForm.append("zipfiles", zipFile, "order_images.zip") : console.log(null);
        // excelBlob?uploadForm.append("excelfile",excelBlob,"excelfile.json"):console.log(excelfile);
        //bulkorder
        const storedZipFiles = [localStorage.getItem("zipFileData")] || [];
        storedZipFiles.forEach((zipFile, index) => {
          if (zipFile) {
            const base64Data = zipFile.replace(/^data:application\/zip;base64,/, "");
            const binaryData = atob(base64Data);
            const byteArray = new Uint8Array(binaryData.length);
            for (let i = 0; i < binaryData.length; i++) {
              byteArray[i] = binaryData.charCodeAt(i);
            }
            const zipBlob = new Blob([byteArray], { type: "application/zip" });
            uploadForm.append("bulkzip", zipBlob, `order_${orderId}_zip${index + 1}.zip`);
          }
        });
        // bulkZip?uploadForm.append("bulkzip", bulkZip, "bulkorder.zip"):console.log(null);
        uploadForm.append("orderId", orderId);

        const response = await fetch("https://dreamik-intern.onrender.com/upload", {
          method: "POST",
          body: uploadForm,
        });

        if (response.ok) {

          toast.success(
            <div style={{ fontSize: "14px", lineHeight: "1.5" }}>
              <strong>🎉 Payment Successful!</strong><br />
              Your order has been saved.<br /><br />
              <strong>🎁 Free Gift:</strong> Enjoy a <strong>6x4 inch photo print</strong> of any one photo absolutely free!<br /><br />
              <strong>📩 Send your selected photo and Order ID to us via:</strong><br />
              <a
                href="https://wa.me/919498088659?text=Hi, I would like to claim my free photo print with Order ID: "
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#25D366", textDecoration: "underline" }}
              >
                WhatsApp
              </a> or
              <a
                href="mailto:dreamikai@gmail.com?subject=Free Photo Print Gift&body=Hi, I would like to claim my free photo print. My Order ID is: "
                target="_blank"
                rel="noopener noreferrer"
                style={{ marginLeft: "5px", color: "#0072C6", textDecoration: "underline" }}
              >
                Email
              </a>.
            </div>,
            {
              autoClose: 10000, // optional: toast will close after 10 seconds
              closeOnClick: true,
              draggable: true,
            }
          );

          navigate("/orderconfirmation");

        } else {
          alert("Failed to save order. Please try again.");
          seterror(true)
        }
      } catch (error) {
        console.error("Error during payment:", error);
        alert("Error occurred. Please try again later.");
        seterror(true)

      } finally {
        setIsLoading(false);
      }
    };

    if (currentDomain === "www.dreamik.com" || currentDomain === "dreamik.com") {
      const options = {
        key: "rzp_live_z50HzQG4hu7aR9",
        amount: finalAmount * 100,
        currency: "INR",
        name: "DreamikAI",
        description: "Payment for your order",
        image: "/image/logo.png",
        handler: async (response) => {
          const paymentData = {
            PaymentID: response.razorpay_payment_id,
            PaymentAmount: finalAmount,
            PaymentVender: "RazorPay",
            PaymentPoint: "PaymentPage",
            PaymentDiscountCode: testPayCode,
            PaymentMode: paymentMode,
            DeliveryMode: deliveryMode,
          };

          await saveOrderDetails(paymentData);
        },
        modal: {
          ondismiss: function () {
            console.log("Payment popup closed by user");
            setIsLoading(false); // Set loading to false if the user closes the popup
          },
        },
        prefill: {
          name: formContainer?.name || "",
          email: formContainer?.email || "",
          contact: formContainer?.phone || "",
        },
        theme: { color: "#3399cc" },
        payment_capture: 1,
      };

      const razorpayInstance = new window.Razorpay(options);
      razorpayInstance.open();
    } else {
      const paymentData = {
        PaymentID: "TEST123456789",
        PaymentAmount: finalAmount,
        PaymentVender: "RazorPay",
        PaymentPoint: "PaymentPage",
        PaymentDiscountCode: testPayCode,
        PaymentMode: paymentMode,
        DeliveryMode: deliveryMode,
      };

      await saveOrderDetails(paymentData);
    }
  };

  return (
    <div>
      <Googleform iserror={iserror} seterror={seterror} invoiceid={orderid} />
      <h1>Dreamik AI Payment Gateway</h1>
      {isLoading ? (
        <div className="loading-message">
          <p>Please wait, confirming your order...</p>
          <p>This is Your invoiceId: <strong>{orderid}</strong></p>
          {/* <p>This is Your orderId: <strong>{orderid2}</strong></p> */}
        </div>
      ) : (
        <>
          <div id="optdiv">
            <h2>Payment Gateways</h2>
            <select name="paymentgateway" id="paymentgateway">
              <option value="razorpay">Razor Pay</option>
            </select>
            <input
              type="text"
              id="testpay"
              placeholder="Test Payment Coupon"
              value={testPayCode}
              onChange={(e) => setTestPayCode(e.target.value)}
            />
          </div>

          <button id="pay-button" onClick={handlePayment} style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", padding: "20px 20px", fontSize: "16px" }}>
            <i className="fa-solid fa-wallet"></i> {/* Generic payment icon */}
            Pay Now
          </button>


          <div id="details-container">
            <div id="order-details">
              <h2>Order Details</h2>
              <ul>
                {orderData.map((prod, index) => (
                  <li key={index}>
                    {prod.Name}-{prod.productcode} - Rs. {prod.price} x {prod.quantity}
                  </li>
                ))}
              </ul>
            </div>
            <div id="prices">
              <h2>Price Details</h2>
              <p>Product Price: Rs. {priceDetails.prodPrice || 0}</p>
              <p>Delivery Charge: Rs. {priceDetails.delPrice || 0}</p>
              <p>CoD Charge: Rs. {priceDetails.cod || 0}</p>
              <p>Total Payment: Rs. {priceDetails.totalPrice || 0}</p>
            </div>
            <div id="delivery-options">
              <h2>Delivery Mode</h2>
              <p>{deliveryMode}</p>
            </div>
            <div id="payment-options">
              <h2>Payment Mode</h2>
              <p>{paymentMode}</p>
            </div>
          </div>

        </>
      )}
    </div>
  );
};

export default Payment;
