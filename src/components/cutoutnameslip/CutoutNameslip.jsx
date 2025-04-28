import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./cutoutNameslip.css";
import OnePlusOneOffer from "./Oneplusone";
const CutOutNameSlip = ({ searchText, setcoupon }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    const fetchJSONData = () => {
      fetch("../cutoutnameslip_data.json")
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          const filteredProducts = Object.keys(data)
            .filter((key) => data[key].status === 1)
            .map((key) => ({
              ...data[key],
              id: key,
            }));
          setProducts(filteredProducts);
        })
        .catch((error) => console.error("Unable to fetch data:", error));
    };

    fetchJSONData();
    setcoupon("DISCOUNTCONSR50");



  }, []);

  // Normalize strings for search
  const normalizeString = (str) => str?.replace(/\s+/g, "").toLowerCase() || "";
  const [selectedImage, setSelectedImage] = useState(sessionStorage.getItem("personImage") || null);
  const [studentDetails, setStudentDetails] = useState(JSON.parse(sessionStorage.getItem("studentDetails")) || null)
  const fontdetails = JSON.parse(sessionStorage.getItem("detailsFont")) || null;
  // Apply search filter
  const filteredProducts = searchText
    ? products.filter(
      (product) =>
        normalizeString(product.name).includes(normalizeString(searchText)) ||
        (product.props &&
          product.props.some((prop) =>
            normalizeString(prop).includes(normalizeString(searchText))
          ))
    )
    : products;

  const handleProductClick = (id, productcode) => {
    localStorage.setItem("keyid", id);
    console.log(id, productcode);
    navigate(`/ProductDetails/${productcode}`); // Navigate to ProductDetails view
  };
  return (
    <section id="product-1" className="section-p1">
      {/* <img src="/buy1get.jpg" alt="" style={{ width: "300px", height: "300px" }} /> */}

      <h2 style={{ fontWeight: "600", width: "100%" }}>
        <OnePlusOneOffer offerproduct={"CutoutNameslips"} />

        Cut Out Name Slips <br />
        <p>Creative and Fun</p>
      </h2>
      <button
        className="autocoupon"
        onClick={() => {
          setcoupon("DISCOUNTCONSR50");
        }}
      >
        " DISCOUNTCONSR50 "<br />
        (apply this for get Rs.50 offer)
      </button>
      <div className="rmvbg">
        <button
          onClick={() => {
            window.open("https://www.remove.bg/upload", "_blank");
          }}
        >
          Remove Background{" "}
        </button>
        <span>(removebg of your image for getting better result)</span>
      </div>
      <div className="pro-container">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, index) => (
            <div
              className="pro"
              key={product.id}
              onClick={() =>
                handleProductClick(product.id, product.productcode)
              }
            >
              <img src={product.source} alt={product.name} loading="lazy" style={{ position: "relative" }} />
              <div style={{
                position: "absolute",
                top: "10%",
                width: "30%",
                height: "100%",
                left: "1%"
              }}>
                <img

                  src={selectedImage || `/demokidsremovebg/demokidsimage${(index % 12) + 1}.webp`}
                  alt="yours Image"
                  className={`selectedImagecn ${["NSCRT00017", "NSCRT00018", "NSCRT00019", "NSCRT00020", "NSCRT00021"].includes(product.productcode)
                    ? "selectedimagecn1" : ""}`}
                />

                <label
                  htmlFor=""

                  className={`student-name ${["NSCRT00017", "NSCRT00018", "NSCRT00019", "NSCRT00020", "NSCRT00021"].includes(product.productcode)
                    ? "label11" : ""}`}
                  style={{ color: fontdetails?.[0]?.color || "#000080" }}
                >
                  {studentDetails?.name || "Kid's Name"}
                </label>

                <label
                  htmlFor=""
                  className={`school-name ${["NSCRT00017", "NSCRT00018", "NSCRT00019", "NSCRT00020", "NSCRT00021"].includes(product.productcode)
                    ? "label12" : ""}`} style={{ color: fontdetails?.[1]?.color || "#000080" }}
                >
                  {studentDetails?.schoolName || "School Name"}
                </label>

                <label
                  htmlFor=""
                  className={`student-class ${["NSCRT00017", "NSCRT00018", "NSCRT00019", "NSCRT00020", "NSCRT00021"].includes(product.productcode)
                    ? "label13" : ""}`} style={{ color: fontdetails?.[5]?.color || "#000080" }}
                >
                  {studentDetails?.class || "Class"}
                </label>

                <label
                  htmlFor=""
                  className={`student-section ${["NSCRT00017", "NSCRT00018", "NSCRT00019", "NSCRT00020", "NSCRT00021"].includes(product.productcode)
                    ? "label14" : ""}`} style={{ color: fontdetails?.[4]?.color || "#000080" }}
                >
                  {studentDetails?.section || "Sec"}
                </label>

              </div>


              <div className="description">
                <span>DreamiKAI Label</span>
                <h5>{product.name}</h5>
                <div className="star">
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                  <i className="fas fa-star"></i>
                </div>
                <h4>Rs.{product.price}</h4>
                {/* <ProductOffer
          originalPrice={507}
          discountPercentage={33}
          offerEndTime={6473}
        /> */}
              </div>
              <a href="#" className="cart">
                <i className="fas fa-shopping-cart"></i>
              </a>

            </div>
          ))
        ) : (
          <p></p>
        )}

      </div>
      <div>
        <hr style={{ height: "4px", backgroundColor: "black" }} />
        <h4 style={{ marginTop: "10px" }}>Output of labels</h4>
        <div className="outputlables">
          <div className="scroller">
            {Array.from({ length: 18 }, (_, index) => (
              <img
                key={index + 1}
                src={`/Cutoutnameslipdemo/cutoutns${(index % 8) + 1}.webp`}
                alt={`Image ${(index % 8) + 1}`}
                width="250px"
                height="250px"
                className="cutoutsample"
                loading="lazy"
              />
            ))}
          </div>

        </div>

        <hr style={{ height: "4px", backgroundColor: "black" }} />
      </div>
    </section>
  );
};

export default CutOutNameSlip;