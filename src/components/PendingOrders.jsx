import { useState, useContext } from "react";
import "../PendingOrders.css";
import { CartContext } from './CartContext';

const PendingOrders = () => {
  const [orderId, setOrderId] = useState("");
  const [files, setFiles] = useState([]);
  const [productDetails, setProductDetails] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useContext(CartContext);

  const fetchFiles = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `https://dreamik-intern.onrender.com/retrieve/${orderId}`
      );
      const data = await response.json();
      console.log("Response Data:", data);

      if (response.ok) {
        // Ensure 'files' is an array before setting the state
        setFiles(Array.isArray(data.files) ? data.files : []);

        // Extract product details from the .txt file (productDetails)
        const infoFile = data.files?.find((file) => file.name.endsWith(".txt"));
        if (infoFile) {
          // Ensure content exists and log for debugging
          console.log("Product Details:", infoFile.content);
          setProductDetails(infoFile.content.productDetails || []);
        }
      } else {
        setError(data.error || "Failed to fetch files.");
      }
    } catch (err) {
      setError("An error occurred while fetching files.");
    } finally {
      setLoading(false);
    }
  };

  const addCart = (product, imageData) => {
    const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
    const productInCart = {
      image: imageData,
      quantity: product.quantity || 1,
      price: product.price,
      Name: product.Name,
      labeltype: product.labeltype,
      size: product.size,
    };
    existingCart.push(productInCart);
    localStorage.setItem("OrderData", JSON.stringify(existingCart));
    addToCart();
    alert(`${product.Name} has been added to your cart.`);
  };

  return (
    <div id="pendingorder">
      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
      />
      <button onClick={fetchFiles}>Retrieve Files</button>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}

      {files.length > 0 && (
        <div>
          <h3>Files for Order: {orderId}</h3>
          <div id="pending-files">
            {files.map((file, index) => {
              if (file.type === "image") {
                // Match the current image with the corresponding product details
                const product = productDetails[index]; // Use index to match productDetails

                return (
                  <div key={file.name} className="product-div">
                    <img
                      src={`data:image/png;base64,${file.content}`}
                      alt={file.name}
                    />
                    {product ? (
                      <div>
                        <h4>Product Details:</h4>
                        <p>Name: {product.Name}</p>
                        <p>Price: ₹{product.price}</p>
                        <p>Size: {product.size}</p>
                        <p>Quantity: {product.quantity}</p>
                        <p>Label Type: {product.labeltype}</p>
                        {/* <p>Name Font: {product["name fontsize"]} {product["name fontColor"]}</p>
                        <p>School Name Font: {product["schoolname fontsize"]} {product["schoolname fontColor"]}</p> */}
                        {/* Add more product details as needed */}
                      </div>
                    ) : (
                      <p>Product details not available for this image.</p>
                    )}
                    <button
                      onClick={() =>
                        addCart(
                          product,
                          `data:image/png;base64,${file.content}`
                        )
                      }
                      disabled={!product} // Disable button if product is missing
                    >
                      Add to Cart
                    </button>
                  </div>
                );
              }
              return null; // Skip non-image files
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default PendingOrders;
