import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const ProductDisplay = ({ orderData, removeProduct, handleEditOrder,handleAddProduct }) => {
  const navigate = useNavigate();
  const [expandedIndex, setExpandedIndex] = useState(null); // Track which product is expanded

  const toggleExpand = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle expanded state
  };

  return (
    <div id="container">
      <div id="product-display">
        {orderData.map((prod, index) => (
          <div
            key={index}
            className="product-container"
            onClick={() => toggleExpand(index)}
            style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fit, minmax(180px, 1fr))",
               gap: "10px",
             
              cursor: "pointer",
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "8px",
              backgroundColor: expandedIndex === index ? "#f9f9f9" : "#fff",
              transition: "background 0.3s ease",
            }}
          >
            {/* Compact View (Visible Always) */}
            <img src={prod.image} alt={prod.Name} className="prod-image" style={{ width: "100px", height: "100px" }} />
            <h2 className="prod-name">
              {prod.productcode}: {prod.Name}
            </h2>
            <h2 className="prod-price">Price: Rs. {parseInt(prod.price, 10)}.00</h2>

            {/* Expanded Details (Visible Only When Clicked) */}
            {expandedIndex === index && (
              <div className="product-details">
                <h2 className="prod-type">
                  Type: {prod.labeltype.replace(/^./, (char) => char.toUpperCase())}
                </h2>
                <h2 className="prod-qtn">Quantity: {prod.quantity}</h2>
                {Array.isArray(prod.labels) && prod.labels[2]?.subjectCount && (
                  <h2 style={{ fontSize: "16px", lineHeight: "7px" }}>
                    SubjectCount: {prod.labels[2].subjectCount}
                  </h2>
                )}
                <h3 className="prod-sheet">
                  Total Sheets: {prod.size === "Medium - (100mm * 44 mm) 12 labels - 36nos" ? "3" : "4"}
                </h3>

                {/* Buttons Only Visible in Expanded Mode */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: "10px" }}>
                  <button className="prod-remove" onClick={(e) => { e.stopPropagation(); removeProduct(prod); }}>
                    Remove
                  </button>
                  <button
                    className="prod-edit"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent collapsing on click
                      handleEditOrder(prod);
                      if (prod.productcode.startsWith("NSHRT")) {
                        navigate(`/NS${prod.template}/${prod.productcode}`);
                      }
                      if (prod.template.startsWith("CN")) {
                        navigate(`/${prod.template}/${prod.productcode}`);
                      }
                      removeProduct(prod);
                    }}
                  >
                    Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
        <button id="addprod" onClick={handleAddProduct}>
              Add Product
            </button>
      </div>
      
    </div>
  );
};

export default ProductDisplay;
