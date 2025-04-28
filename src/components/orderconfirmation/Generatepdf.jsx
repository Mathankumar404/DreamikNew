import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const generatePDF = (orderData, customerDetails, paymentDetails) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(16);
  doc.text("Dreamik AI", 105, 15, { align: "center" });
  doc.setFontSize(12);
  doc.text("Dream it, get it from us...", 105, 22, { align: "center" });
  doc.text("Personalized Merchandise", 105, 28, { align: "center" });
  doc.text("Web: www.dreamik.com", 105, 34, { align: "center" });
  doc.text("Phone No. +91-044-28505188", 105, 40, { align: "center" });
  doc.text("Email: dreamikai@gmail.com", 105, 46, { align: "center" });
  doc.text("Whatsapp: +919498088659", 105, 52, { align: "center" });
  doc.text("Instagram: @dreamik.ai", 105, 58, { align: "center" });

  doc.setLineWidth(0.5);
  doc.line(15, 62, 195, 62);

  // Company Details
  doc.setFontSize(10);
  doc.text("MURVEN INFOTECH DESIGN SOLUTIONS LLP", 15, 70);
  doc.text("715-A, 7th Floor, Spencer Plaza, Suite No.548", 15, 75);
  doc.text("Mount Road, Anna Salai, Chennai - 600 002", 15, 80);
  doc.text("Tamil Nadu, India", 15, 85);
  doc.text("Company ID: AAV-1675", 15, 90);
  doc.text("PAN: ABPFM6846A", 15, 95);
  doc.text("GST: 33ABPFM6846A1Z8", 15, 100);
  doc.text("www.murven.in", 15, 105);

  // Order Details
  doc.text(`Order ID: ${orderData.orderId}`, 140, 70);
  doc.text(`Invoice ID: ${orderData.invoiceId}`, 140, 75);
  doc.text(`Reseller Id: ${orderData.resellerId}`, 140, 80);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 85);

  // Customer Details
  doc.text("Customer Details:", 15, 115);
  doc.text(`${customerDetails.name}`, 15, 120);
  doc.text(`${customerDetails.address}, ${customerDetails.city}`, 15, 125);
  doc.text(`${customerDetails.state} - ${customerDetails.pincode}`, 15, 130);
  doc.text(`Mobile: ${customerDetails.mobile}`, 15, 135);
  doc.text(`Email: ${customerDetails.email}`, 15, 140);

  // Table for order summary
  autoTable(doc, {
    startY: 150,
    head: [["No", "Description", "Price", "Discount", "Quantity", "Net Amount", "Tax Rate", "Tax Type", "Tax Amount", "Total Amount"]],
    body: orderData.items.map((item, index) => [
      index + 1,
      item.name,
      item.price,
      item.discount || 0,
      item.quantity,
      item.netAmount,
      "18%",
      "IGST",
      item.taxAmount,
      item.totalAmount
    ]),
    theme: "grid",
    styles: { fontSize: 10 },
  });

  // Total Amount Section
  let finalY = doc.lastAutoTable.finalY + 10;
  doc.text(`Total: ${orderData.totalAmount}`, 140, finalY);
  doc.text(`Roundoff (-): ${orderData.roundOff}`, 140, finalY + 5);
  doc.text(`Total Amount Payable: ${orderData.payableAmount}`, 140, finalY + 10);
  doc.text(`Amount in Words: ${orderData.amountInWords}`, 15, finalY + 15);
  doc.text(`Payment ID: ${paymentDetails.paymentId} (${paymentDetails.timestamp})`, 15, finalY + 20);

  // Signature
  doc.text("For MURVEN INFOTECH DESIGN SOLUTIONS LLP", 140, finalY + 30);
  doc.text("Sign", 180, finalY + 40);

  doc.save(`Invoice_${orderData.orderId}.pdf`);
};

export default generatePDF;
