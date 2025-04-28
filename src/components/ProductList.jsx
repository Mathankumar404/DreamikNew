import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./ProductList.css";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return width;
};

const ProductList = ({ searchText, resellerlogin, ResellerProducts }) => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const [showSplash, setShowSplash] = useState(true);
  const windowWidth = useWindowWidth();

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch("/products.json"); // Ensure the file is in "public" folder
        if (!response.ok) throw new Error("Failed to fetch products");
        let data = await response.json();

        // Ensure data is an array
        if (typeof data === "object" && !Array.isArray(data)) {
          data = Object.values(data); // Convert object to array
        }

        setProducts(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
        setProducts([]); // Fallback to an empty array to avoid .filter errors
      }
    };

    fetchProductData();



  }, []);
  const [offers, setoffers] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch("/offer.json");
        const data = await response.json();
        setoffers(data.onePlusOneOffer)
      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
  }, []);

  const start = new Date();
  const end = new Date(offers?.end_time || null);
  const diffInMs = end - start;
  const diffInSeconds = diffInMs / 1000;


  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  // Filter products based on search text
  const filteredProducts = products.filter((product) =>
    normalizeString(product.name).includes(normalizeString(searchText))
  );

  // Handle product click
  const handleProductClick = (product) => {
    const view = product.name.replace(/\s+/g, "");
    if (view) navigate(`/${view}`);
    console.log(view);
  };

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: windowWidth > 500 ? 7 : 3, // Show 7 slides on large screens, 2 on mobile
    slidesToScroll: 2,
    autoplay: windowWidth > 500 ? true : false,
    autoplaySpeed: 2000,
    nextArrow: windowWidth > 500 ? <NextArrow /> : null, // Hide arrows on mobile
    prevArrow: windowWidth > 500 ? <PrevArrow /> : null,
  };

  return (
    <div>
      {/* {showSplash && <SplashScreen onClose={() => setShowSplash(true)} />}  */}

      <h2>Product List</h2>

      {/* Products Sample Section */}
      <div id="productsample">
        <hr
          style={{ marginBottom: "10px", height: "2px", background: "black" }}
        />
        <Slider {...settings}>
          {products.map((product, index) => {
            const isAllowed = resellerlogin
              ? ResellerProducts.includes(product.name)
              : true;

            return (
              product.status === 1 && (
                <div
                  key={product.id || product.name || index}
                  className="sampleprod"
                  onClick={() =>
                    isAllowed &&
                    !product.outOfStock &&
                    handleProductClick(product)
                  }
                  style={{
                    pointerEvents: isAllowed ? "auto" : "none",
                    opacity: isAllowed && !product.outOfStock ? 1 : 0.5,
                    display:
                      resellerlogin &&
                        (product.name === "Dreamik Glossy Inkjet/Laser printer" ||
                          product.name === "Bulk printing software")
                        ? "block"
                        : !resellerlogin &&
                          (product.name ===
                            "Dreamik Glossy Inkjet/Laser printer" ||
                            product.name === "Bulk printing software")
                          ? "none"
                          : "block",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      flexDirection: "column",
                    }}
                  >
                    <img
                      src={product.logo}
                      alt={product.name}
                      className="sampleimg"
                      loading="lazy"
                      width={"70px"}
                      height={"70px"}
                    />
                    <h5 className="sampletitle">{product.name}</h5>
                  </div>
                </div>
              )
            );
          })}
        </Slider>
      </div>
      <hr
        style={{ marginBottom: "10px", height: "2px", background: "black" }}
      />
      {/* Main Product List Section */}
      <div id="products">
        {filteredProducts.map((product, index) => {
          const isAllowed = resellerlogin
            ? ResellerProducts.includes(product.name)
            : true;

          const shouldDisplay =
            (resellerlogin &&
              (product.name === "Dreamik Glossy Inkjet/Laser printer" ||
                product.name === "Bulk printing software")) ||
            (!resellerlogin &&
              !(
                product.name === "Dreamik Glossy Inkjet/Laser printer" ||
                product.name === "Bulk printing software"
              ));

          return (
            <div
              key={product.id || product.name || index}
              className="product"
              onClick={() =>
                isAllowed && !product.outOfStock && handleProductClick(product)
              }
              style={{
                pointerEvents: isAllowed ? "auto" : "none",
                opacity: isAllowed && !product.outOfStock ? 1 : 0.5,
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                className="productimg"
                loading="lazy"
              />

              {/* Reserve space for text elements */}
              <h3 className="productname">{product.name}</h3>

              <h3
                className="productprice"
                style={{
                  minHeight: "0.2em", // Reserve even if price is 0
                  visibility: product.price !== 0 ? "visible" : "hidden",
                }}
              >
                {product.name !== "Name Slips" ? " ₹" : ""} {product.price} <br /> {product?.pieces}
              </h3>

              <div
                className="out-of-stock-badge"
                style={{
                  minHeight: "1.0em",
                  visibility: product.outOfStock ? "visible" : "hidden",
                }}
              >
                Out of Stock
              </div>

              <div
                className="reseller-only-badge"
                style={{
                  minHeight: "1.5em",
                  visibility: !isAllowed ? "visible" : "hidden",
                }}
              >
                Not for you
              </div>
              {["Cutout Nameslips", "Name Slips"].includes(product.name) && diffInSeconds > 5 && <div className="offer-tag">1+1 Offer</div>}
            </div>
          );
        })}
      </div>
      <div className="demo-order">
        Demo   for   placing   Order
      </div>
    </div>
  );
};

const NextArrow = ({ onClick }) => (
  <div className="arrow next" onClick={onClick}>
    <FaArrowRight />
  </div>
);

const PrevArrow = ({ onClick }) => (
  <div className="arrow prev" onClick={onClick}>
    <FaArrowLeft />
  </div>
);
export default ProductList;
