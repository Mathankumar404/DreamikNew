import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import './OrderConfirmation.css';
import { CartContext } from '../CartContext';
import { useContext } from "react";
import jsPDF from "jspdf";
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js';
import autoTable from "jspdf-autotable";
import { toWords } from 'number-to-words'; // If using the library


const OrderConfirmation = () => {
  const navigate = useNavigate();
  const instant = sessionStorage.getItem("Instant");
  const pdfRef = useRef();
  const [orderData, setOrderData] = useState([]);
  const [paymentDetails, setPaymentDetails] = useState({});
  const [formContainer, setFormContainer] = useState({});
  const [priceDetails, setPriceDetails] = useState({});
  const [orderId, setOrderId] = useState("");
  const [OrderId2, setOrderId2] = useState("");
  const { cartCount, setCartCount } = useContext(CartContext);
  const [isLoading, setLoading] = useState(false);
  const logs = JSON.parse(sessionStorage.getItem("userLogs"));
  //  const [shouldDownload,setShouldDownload]=useState(false);
  const statecode = {
    "JAMMU AND KASHMIR": "01",
    "HIMACHAL PRADESH": "02",
    "PUNJAB": "03",
    "CHANDIGARH": "04",
    "UTTARAKHAND": "05",
    "HARYANA": "06",
    "DELHI": "07",
    "RAJASTHAN": "08",
    "UTTAR PRADESH": "09",
    "BIHAR": "10",
    "SIKKIM": "11",
    "ARUNACHAL PRADESH": "12",
    "NAGALAND": "13",
    "MANIPUR": "14",
    "MIZORAM": "15",
    "TRIPURA": "16",
    "MEGHALAYA": "17",
    "ASSAM": "18",
    "WEST BENGAL": "19",
    "JHARKHAND": "20",
    "ODISHA": "21",
    "CHATTISGARH": "22",
    "MADHYA PRADESH": "23",
    "GUJARAT": "24",
    "DADRA AND NAGAR HAVELI AND DAMAN AND DIU (NEWLY MERGED UT)": "26*",
    "MAHARASHTRA": "27",
    "ANDHRA PRADESH (BEFORE DIVISION)": "28",
    "KARNATAKA": "29",
    "GOA": "30",
    "LAKSHADWEEP": "31",
    "KERALA": "32",
    "TAMIL NADU": "33",
    "PUDUCHERRY": "34",
    "ANDAMAN AND NICOBAR ISLANDS": "35",
    "TELANGANA": "36",
    "ANDHRA PRADESH (NEWLY ADDED)": "37",
    "LADAKH (NEWLY ADDED)": "38",
    "OTHER TERRITORY": "97",
    "CENTRE JURISDICTION": "99"
  };




  useEffect(() => {
    // Retrieve the order details from localStorage
    const storedOrderDetails = JSON.parse(localStorage.getItem("OrderConfirmationData"));

    // Check if the stored order details exist
    if (storedOrderDetails) {
      try {
        setOrderData(storedOrderDetails.orderData);
        setPaymentDetails(storedOrderDetails.paymentDetails);
        setFormContainer(storedOrderDetails.formContainer);
        setPriceDetails(storedOrderDetails.priceDetails);
        setOrderId(storedOrderDetails.orderId);
        setOrderId2(storedOrderDetails.OrderId2);
      } catch (e) {
        console.log(e)
      }
      finally {
        generatePDF();
        localStorage.removeItem("OrderData");
        localStorage.removeItem("PaymentDetails");
        localStorage.removeItem("FormContainer");
        localStorage.removeItem("PriceData");
        localStorage.removeItem("zipFileData");
        setCartCount(0)
      }
    } else {
      // If no order details are found, navigate back to payment page
      navigate("/payment");
    }
  }, [navigate]);



  const handleSendWhatsapp = () => {
    const phoneNumber = prompt("Enter your WhatsApp number (with country code eg:919876543210):");
    if (!phoneNumber) return; // If user cancels or leaves it empty, exit function

    const message = encodeURIComponent(`Thankyou for ordering. This is your details: inoviceid= ${orderId},OrderId=${OrderId2}, total price=${priceDetails.totalPrice}`);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;

    window.open(whatsappUrl, "_blank");
  };


  const handleBackToHome = () => {
    // Optional: Clear localStorage after confirmation to avoid stale data
    localStorage.removeItem("OrderData");
    localStorage.removeItem("PaymentDetails");
    localStorage.removeItem("FormContainer");
    localStorage.removeItem("PriceData");
    localStorage.removeItem("zipFileData");
    navigate("/");
    window.location.reload();
  };

  // Function to load image as Base64
  const loadImageAsBase64 = (path) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        const base64Image = canvas.toDataURL('image/png');
        resolve(base64Image);
      };
      img.onerror = (err) => reject('Image failed to load');
      img.src = path;  // Ensure the image path is correct
    });
  }

  const generatePDF = async (shouldDownload = false) => {

    const doc = new jsPDF();

    // Set margins for better space usage
    const marginLeft = 15;
    const marginTop = 15;
    const marginRight = 15; // Right margin
    const pageWidth = doc.internal.pageSize.width;
    const availableWidth = pageWidth - marginLeft - marginRight;

    // Load logo image as Base64 string
    const logoPath = '/image/logo.png';  // Ensure correct path relative to public folder
    const logoBase64 = await loadImageAsBase64(logoPath);

    // Add the logo as Base64 image
    const logoWidth = 25; // Adjust logo width
    const logoHeight = 25; // Adjust logo height
    doc.addImage(logoBase64, 'PNG', marginLeft, marginTop, logoWidth, logoHeight);

    // Invoice Heading positioned in the center
    doc.setFontSize(16);
    doc.setFont("helvetica", "bold");
    doc.text("INVOICE", pageWidth / 2, marginTop + 20, { align: "center" });

    // Dreamik AI details (on the left side, below logo)
    doc.setFontSize(18);
    doc.text("Dreamik AI", marginLeft, marginTop + 40);  // Moved up from 50
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("Dream it, get it from us... Personalized Merchandise", marginLeft, marginTop + 45);
    doc.text("Phone No. +91-044-28505188", marginLeft, marginTop + 50);
    doc.text("Email: dreamikai@gmail.com", marginLeft, marginTop + 55);
    doc.text("Whatsapp: +919498088659", marginLeft, marginTop + 60);
    doc.text("Instagram: @dreamik.ai", marginLeft, marginTop + 65);
    doc.text("Website: www.dreamik.com", marginLeft, marginTop + 70);

    // Right-side content positioning adjusted
    const rightMargin = pageWidth / 2 + 10;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text("MURVEN INFOTECH DESIGN SOLUTIONS LLP", rightMargin, marginTop + 40); // Moved up from 50
    doc.setFontSize(11);
    doc.setFont("helvetica", "normal");
    doc.text("715-A, 7th Floor, Spencer Plaza, Suite No.548", rightMargin, marginTop + 45);
    doc.text("Mount Road, Anna Salai, Chennai - 600 002", rightMargin, marginTop + 50);
    doc.text("Tamil Nadu, India", rightMargin, marginTop + 55);
    doc.text("Company ID: AAV-1675", rightMargin, marginTop + 60);

    // Split PAN and GST to the next line
    doc.text("PAN: ABPFM6846A", rightMargin, marginTop + 65);
    doc.text("GST: 33ABPFM6846A1Z8", rightMargin, marginTop + 70);

    // Contact details
    doc.text("www.murven.in", rightMargin, marginTop + 75);

    // Adjust line separator position
    doc.setLineWidth(0.5);
    doc.line(marginLeft, marginTop + 80, pageWidth - marginRight, marginTop + 80);

    // Order ID and Date
    doc.text(`Order ID: ${OrderId2}`, marginLeft, marginTop + 90);
    doc.text(`Invoice ID: ${orderId}`, marginLeft, marginTop + 95);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, pageWidth - marginRight, marginTop + 90, { align: "right" });

    // Adjust billing details
    doc.setFont("helvetica", "bold");
    doc.text("Customer Details:", marginLeft, marginTop + 110);
    doc.setFont("helvetica", "normal");
    doc.text(`${formContainer.name}`, marginLeft, marginTop + 115);
    doc.text(`${formContainer.address1}, ${formContainer.district}`, marginLeft, marginTop + 120);
    doc.text(`${formContainer.state} - ${formContainer.pincode}`, marginLeft, marginTop + 125);
    doc.text(`Mobile: ${formContainer.phone}`, marginLeft, marginTop + 130);
    doc.text(`Email: ${formContainer.email}`, marginLeft, marginTop + 135);

    // Supplier
    doc.text(`Place of Supply: ${formContainer?.state}(${statecode[formContainer?.state?.toUpperCase()?.trim()] || "N/A"})`, rightMargin, marginTop + 135);




    // Product details table with proper alignment and margin
    autoTable(doc, {
      startY: marginTop + 145,
      head: [
        ["No", "Description", "Price", "Quantity", "Discount", "Net Amount", "Tax Rate", "Tax Type", "Tax Amount", "Total Amount"]
      ],
      body: orderData.map((item, index) => [
        index + 1,
        item.Name,
        `Rs. ${Math.round(item.price - (item.price * 0.18))}`,
        item.quantity,
        `Rs. ${item.discount || 0}`,
        `Rs. ${item.netAmount || Math.round(item.price - (item.price * 0.18))}`,
        `${item.taxRate || 18}%`,
        formContainer.state === "Tamil Nadu" ? 'SGST + CGST' : 'IGST',
        formContainer.state === "Tamil Nadu" ? `Rs. ${Math.round(item.price * item.quantity * 0.18) / 2 + '+' + Math.round(item.price * item.quantity * 0.18) / 2}` : Math.round(item.price * item.quantity * 0.18),
        `Rs. ${item.totalAmount || item.price * item.quantity}`
      ]),
      theme: "grid",
      styles: { fontSize: 8 },
      columnStyles: {
        0: { cellWidth: 10 }, // "No" column
        1: { cellWidth: 35 }, // "Description" column
        2: { cellWidth: 20 }, // "Price" column
        3: { cellWidth: 15 }, // "Quantity" column
        4: { cellWidth: 20 }, // "Discount" column
        5: { cellWidth: 20 }, // "Net Amount" column
        6: { cellWidth: 20 }, // "Tax Rate" column
        7: { cellWidth: 15 }, // "Tax Type" column
        8: { cellWidth: 20 }, // "Tax Amount" column
        9: { cellWidth: 15 }, // "Total Amount" column
      },
      margin: { left: marginLeft, right: marginRight } // Ensure the table fits within the margins
    });

    // Calculate the total amount in words
    const totalAmount = priceDetails?.totalPrice || 0;
    const amountInWords = toWords(totalAmount);

    // Footer section
    let finalY = doc.lastAutoTable.finalY + 10;
    doc.setFontSize(10);
    doc.text(`Subtotal + delivery charge(50): Rs. ${totalAmount}`, pageWidth / 2 + 20, finalY);
    doc.text(`Roundoff (-): Rs. ${priceDetails.roundOff || 0}`, pageWidth / 2 + 20, finalY + 5);
    doc.text(`Total Amount Payable: Rs. ${totalAmount}`, pageWidth / 2 + 20, finalY + 10);
    doc.text(`Amount in Words: ${amountInWords}`, marginLeft, finalY + 15);
    doc.text(`Payment ID: ${paymentDetails.PaymentID || "NA"}`, marginLeft, finalY + 20);
    doc.text("Terms & conditions apply*", marginLeft, finalY + 35);
    doc.text("(check our website for our full T&C)", marginLeft, finalY + 40);



    doc.text("For MURVEN INFOTECH DESIGN SOLUTIONS LLP", pageWidth / 2 + 10, finalY + 30);
    doc.text("Authorized Signatory", pageWidth - marginRight, finalY + 40, { align: "right" });


    const pdfBlob = doc.output("blob");

    if (shouldDownload) {
      // Download the PDF if user wants to
      doc.save(`Invoice_${orderId}.pdf`);
    } else {
      // Send the PDF to the backend
      const formData = new FormData();
      formData.append("invoice", pdfBlob, `Invoice_${orderId}.pdf`);
      formData.append("orderId", orderId);

      if (orderId) {
        try {
          const response = await fetch("https://dreamik-intern.onrender.com/upload", {
            method: "POST",
            body: formData,
          });

          const result = await response.json();

        } catch (error) {
          console.error("Error uploading file:", error);
        }
      }

    }
  };

  useEffect(() => {
    generatePDF();

  }, [orderId]);


  const handleDownloadpdf = () => {
    // setShouldDownload(true);
    generatePDF(true);
  }

  // const generatePDF = () => {
  //   const input = pdfRef.current;

  //   html2canvas(input, { scale: 1.5 }).then((canvas) => {
  //     const imgData = canvas.toDataURL("image/jpeg", 0.8); // Moderate compression for ~5MB
  //     const pdf = new jsPDF("p", "mm", "a4");

  //     const pdfWidth = 210; // A4 width in mm
  //     const pdfHeight = 297; // A4 height in mm
  //     let imgWidth = pdfWidth;
  //     let imgHeight = (canvas.height * imgWidth) / canvas.width;

  //     // Ensure the image fits within the page
  //     if (imgHeight > pdfHeight) {
  //       imgHeight = pdfHeight - 20; // Add margin
  //     }

  //     pdf.addImage(imgData, "JPEG", 0, 10, imgWidth, imgHeight);
  //     pdf.save(`Order_Bill_${orderId}.pdf`);
  //   });
  // };

  const handleInstanpdf = async () => {
    setLoading(true);

    try {
      for (let i = 0; i < orderData.length; i++) {
        const imageBase64 = orderData[i].image.replace(/^data:image\/\w+;base64,/, ""); // Remove metadata
        const paddedBase64 = imageBase64.padEnd(imageBase64.length + (4 - (imageBase64.length % 4)) % 4, "=");

        const response = await fetch("https://9hhnpvznlh.execute-api.ap-south-1.amazonaws.com/prod/generate-pdf", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            image: paddedBase64,
            product: orderData[i].Name,
            sticker_RxC: "6x2",
            sticker_vendor: "Nova",
            sticker_type: "A4-Matte",
            requester_id: formContainer.phone,
            order_id: OrderId2,
            customer_id: "54321",
            invoiceid: orderId,
            requestmobil: formContainer.phone,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP Error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        if (!data.pdf_url) {
          throw new Error("PDF URL is missing in response.");
        }

        console.log(`PDF ${i + 1} URL:`, data.pdf_url);

        // Trigger Download
        const link = document.createElement("a");
        link.href = data.pdf_url;
        link.target = "_blank";
        link.download = `Invoice_${i + 1}.pdf`; // Unique filename for each
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error generating PDFs:", error.message);
      setLoading(false);
    }
  };

  const sendLogs = async (logs) => {
    try {
      const response = await fetch("https://dreamik-intern.onrender.com/api/log", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(logs),
      });

      if (!response.ok) throw new Error(`Server error: ${response.status}`);

      console.log("✅ Logs sent successfully:", await response.json());

      // ✅ Clear sessionStorage after successful upload
      sessionStorage.removeItem("userLogs");
    } catch (err) {
      console.error("❌ Log upload failed:", err);
    }


    try {
      const formContainer = JSON.parse(localStorage.getItem("OrderConfirmationData"))?.formContainer;

      const successfullorders = {
        Orderid: JSON.parse(localStorage.getItem("OrderConfirmationData"))?.OrderId2 || null,
        invoiceid: JSON.parse(localStorage.getItem("OrderConfirmationData"))?.orderId || null,
        timestamp: new Date(),
        paymentMode: formContainer.paymentmode,
        deliveryMode: formContainer.deliverymode,
        amountpaid: formContainer.paymentmode === "partial-payment" ? formContainer?.totalprice / 2 : formContainer?.totalprice,
        RemainingPayableAmount: formContainer.paymentmode === "partial-payment" ? formContainer?.totalprice / 2 :
          formContainer.paymentmode === "cashon-payment" ? formContainer?.totalprice : 0,
        name: formContainer.name,
        address: formContainer.address1,
        pincode: formContainer.pincode,
        email: formContainer.email,
        phone: formContainer.phone,
        district: formContainer.district,
        state: formContainer.state,
        customertype: formContainer.customertype,
        resellerid: formContainer.resellerid
      };

      const orderResponse = await fetch("https://dreamik-intern.onrender.com/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(successfullorders),
      });

      if (orderResponse.ok) {
        console.log("Order successfully saved.");
      } else {
        console.error("Failed to save order.");
      }
    } catch (error) {
      console.error("Error occurred while saving order:", error);
    }

  };
  useEffect(() => {
    if (logs) sendLogs(logs);
  }, []); // ✅ Empty dependency array ensures it runs only once


  return (
    <div className="order-confirmation">
      {instant === "instant" && (<button onClick={handleInstanpdf}>
        {isLoading ? "loading..." : "Get a instant PDF(6x2)"}
      </button>)}
      <h1>Order Confirmation <i className="fas fa-check-circle" style={{ color: 'green', marginLeft: '10px' }}></i></h1>
      <p id="thank">Thank you for your purchase! Your order has been successfully placed.</p>

      <div ref={pdfRef} className="order-confirmation">
        {/* Header Section */}
        <div>
          <h2>Invoice</h2>
          <p><strong>Seller:</strong><i>MURVEN INFOTECH DESIGN SOLUTIONS LLP, </i><br />
            715-A, 7th Floor, Spencer Plaza, Suite No.548,
            Mount Road, Anna Salai, Chennai - 600 002, Tamil Nadu, India
            Phone No. +91-044-28505188
            email: info@murven.in (and) dreamikai@gmail.com
            Whatsapp: +919498088659
            Instagram: @dreamik.ai</p>
          <p><strong>GST Number:</strong> 33ABPFM6846A1Z8</p>
          <p><strong>PAN:</strong>ABPFM6846A</p>
          <p><strong>Company ID:</strong> AAV-1675</p>


        </div>

        <div className="order-id">
          {/* Invoice & Buyer Details */}
          <div className="invoice-details">
            <p><strong>Invoice Id:</strong> {orderId}</p>
            <p><strong>Order Id:</strong> {OrderId2}</p>
            <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
          </div>
        </div>

        <div className="order-summary">
          <h2>Order Summary</h2>
          <ul>
            {orderData.map((product, index) => (
              <li key={index} style={{ marginBottom: "10px" }}>
                <b>{product.productcode} :- {product.Name}</b> <br />
                <span>Rs. {product.price} x {product.quantity} (qnty)</span> <br />
                <span>Type: {product.labeltype}</span> <br />
                <span>Size: {product.size}</span>
              </li>
            ))}

          </ul>
          <p><strong>Total Amount:</strong> Rs. {priceDetails.totalPrice || 0}</p>
        </div>

        <div className="payment-details">
          <h2>Payment Details</h2>
          <p><strong>Payment ID:</strong> {paymentDetails.PaymentID || "N/A"}</p>
          <p><strong>Payment Mode:</strong> {paymentDetails.PaymentMode || "N/A"}</p>
        </div>

        <div className="delivery-details">
          <h2>Delivery Details</h2>
          <p><strong>Delivery Mode:</strong> {paymentDetails.DeliveryMode || "N/A"}</p>
          <p><strong>Name:</strong> {formContainer.name || "N/A"}</p>
          <p><strong>Email:</strong> {formContainer.email || "N/A"}</p>
          <p><strong>Phone:</strong> {formContainer.phone || "N/A"}</p>
          <p><strong>Address:</strong> {formContainer.address1 || "N/A"}</p>
        </div>

        {/* <div className="order-id">
        
        <div className="invoice-details">
                    <p><strong>Order Id:</strong> {orderId}</p>
                    <p><strong>Date:</strong> {new Date().toLocaleDateString()}</p>
                </div>
      </div> */}
        {/* Download Button */}

      </div>
      <button onClick={handleDownloadpdf} style={{ marginTop: "20px", padding: "10px", background: "orange", color: "#fff", border: "none", cursor: "pointer" }}>
        📥 Download Invoice (PDF)
      </button>

      <button className="sendwa" onClick={handleSendWhatsapp} title="send this details to your whatsapp">
        <i className='fa-brands fa-whatsapp'></i> Send WhatsApp
      </button>
      <div style={{ fontSize: "14px", lineHeight: "1.5" }}>

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
      </div>
      <button className="back-to-home" style={{ 'width': '30%' }} onClick={handleBackToHome}>
        Back to Home
      </button>
    </div>
  );
};

export default OrderConfirmation;