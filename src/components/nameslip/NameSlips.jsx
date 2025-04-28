import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import SearchCategories from "../SearchCategories/SearchCategories";
import { Helmet, HelmetProvider } from "react-helmet-async";
import "./NameSlips.css";
import ProductOffer from "../Productoffer/Productoffer";
import OnePlusOneOffer from "../cutoutnameslip/Oneplusone";
const Nameslip = ({ searchText, setSearchText, setcoupon }) => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [galleryIndex, setGalleryIndex] = useState({}); // ✅ Added missing state for cycling images
  const navigate = useNavigate();
  const imgRefs = useRef([]);
  const [selectedImage, setSelectedImage] = useState(
    sessionStorage.getItem("personImage") || null
  );
  const [studentDetails, setStudentDetails] = useState(
    JSON.parse(sessionStorage.getItem("studentDetails")) || null
  );
  const fontdetails = JSON.parse(sessionStorage.getItem("detailsFont")) || null;
  useEffect(() => {
    const fetchJSONData = async () => {
      try {
        const response = await fetch("../nameslip_data.json");
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
        const data = await response.json();
        const filteredProducts = Object.keys(data)
          .filter((key) => data[key].status === 1)
          .map((key) => ({ ...data[key], id: key }));
        setProducts(filteredProducts);
        setFilteredProducts(filteredProducts);
      } catch (error) {
        console.error("Unable to fetch data:", error);
      }
    };

    fetchJSONData();
    setcoupon("DISCOUNTNSR20");
  }, []);

  const normalizeString = (str) => str.replace(/\s+/g, "").toLowerCase();

  useEffect(() => {
    if (searchText) {
      const filtered = products.filter(
        (product) =>
          normalizeString(product.name).includes(normalizeString(searchText)) ||
          (product.props &&
            product.props.some((prop) =>
              normalizeString(prop).includes(normalizeString(searchText))
            ))
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  }, [searchText, products]);

  const handleProductClick = (id, productcode) => {
    localStorage.setItem("keyid", id);
    navigate(`/Products/${productcode}`);
  };

  // ✅ Lazy Loading Images (Only load when they appear in viewport)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target;
            img.src = img.dataset.src; // ✅ Load the actual image
            observer.unobserve(img);
          }
        });
      },
      { threshold: 0.2 } // ✅ Loads when 20% of image enters viewport
    );

    imgRefs.current.forEach((img) => {
      if (img) observer.observe(img);
    });

    return () => observer.disconnect();
  }, [filteredProducts]);

  // ✅ Automatically cycle images every 3s when hovered
  useEffect(() => {
    if (
      hoveredIndex !== null &&
      filteredProducts[hoveredIndex]?.gallery?.length > 1
    ) {
      const interval = setInterval(() => {
        setGalleryIndex((prev) => ({
          ...prev,
          [hoveredIndex]:
            (prev[hoveredIndex] + 1) %
            filteredProducts[hoveredIndex].gallery.length, // ✅ Loop through images
        }));
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [hoveredIndex, filteredProducts]);

  return (
    <HelmetProvider>
      <section id="product-1" className="section-p1">
        <OnePlusOneOffer offerproduct={"Nameslips"} />

        <br />
        <Helmet>
          <title>
            Custom Name Slips - Personalized Labels for School & Office
          </title>
          <meta
            name="description"
            content="Buy custom name slips & personalized labels for school, office & kids. High-quality printed name stickers with fast delivery. Order now!"
          />
          <meta
            name="keywords"
            content="Name slips, custom name labels, personalized stickers, school name tags, buy name slips online, waterproof name labels, DreamikAI name slips"
          />
          <link rel="canonical" href="https://dreamik.com/NameSlips" />
        </Helmet>

        <button
          className="autocoupon"
          onClick={() => {
            setcoupon("DISCOUNTNSR50");
          }}
        >
          DISCOUNTNSR50 <br />
          (apply this for get Rs.20 offer)
        </button>

        <h3>Search Categories</h3>
        <SearchCategories
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <h2 className="funny-heading">

          Name Slips <br />
          <p className="funny-text">Creative and Fun</p>

        </h2>

        <div className="pro-container">
          {filteredProducts.length === 0 ? (
            <p></p>
          ) : (
            filteredProducts.map((product, index) => (
              <div
                className="pro"
                key={index}
                onClick={() =>
                  handleProductClick(product.id, product.productcode)
                }
                onMouseOver={() => {
                  setHoveredIndex(index);
                  setGalleryIndex((prev) => ({ ...prev, [index]: 0 }));
                }}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <img
                  ref={(el) => (imgRefs.current[index] = el)}
                  data-src={product.source}
                  alt={product.name}
                  loading="lazy"
                  style={{ position: "relative" }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: "10%",
                    width: "26.5%",
                    height: "100%",
                    left: "1%",
                  }}
                >
                  {["template4", "template8", "template12"].includes(product.template) && (
                    <>
                      <img
                        src={
                          selectedImage ||
                          `/demokidspictures/demokidsimage${(index % 12) + 1
                          }.webp`
                        }
                        alt="yours Image"
                        className={`selectedimage4 ${["template8"].includes(product.template)
                          ? "selectedimage8"
                          : ["template12"].includes(product.template)
                            ? "selectedimage12" : ""
                          }`}
                        style={{
                          borderRadius:
                            ["template8"].includes(product.template) && "50%",
                        }}
                      />

                      <label
                        htmlFor=""
                        className={`studentname4 ${["template8"].includes(product.template)
                          ? "studentname8"
                          : ["template12"].includes(product.template)
                            ? "studentname12" : ""
                          }`}
                        style={{
                          color: fontdetails?.[0]?.color ||
                            "#000080"
                        }}
                      >
                        {studentDetails?.name || "Kid's Name"}
                      </label>

                      <label
                        htmlFor=""
                        className={`schoolname4 ${["template8"].includes(product.template)
                          ? "schoolname8"
                          : ["template12"].includes(product.template)
                            ? "schoolname12" : ""
                          }`}
                        style={{ color: fontdetails?.[1]?.color || "#000080" }}
                      >
                        {studentDetails?.schoolName || "School Name"}
                      </label>

                      <label
                        htmlFor=""
                        className={`classname4 ${["template8"].includes(product.template)
                          ? "classname8"
                          : ["template12"].includes(product.template)
                            ? "classname12" : ""
                          }`}
                        style={{ color: fontdetails?.[5]?.color || "#000080" }}
                      >
                        {studentDetails?.class || "Class"}
                      </label>

                      <label
                        htmlFor=""
                        className={`sectionname4 ${["template8"].includes(product.template)
                          ? "sectionname8"
                          : ["template12"].includes(product.template)
                            ? "sectionname12" : ""
                          }`}
                        style={{ color: fontdetails?.[4]?.color || "#000080" }}
                      >
                        {studentDetails?.section || "Sec"}
                      </label>
                    </>
                  )}
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
                  {["template8"].includes(product.template) && (
                    <div className="label-box" style={{ position: "absolute" }}>
                      <img
                        src={"/image/waterlabel1.png"}
                        alt="Gallery Preview"
                      />
                    </div>
                  )}
                  {["template12"].includes(product.template) && (
                    <div style={{ position: "absolute", top: "7%", left: "4%", width: "90%" }}>
                      <img
                        src={"/image/waterlabel/FELT.png"}
                        alt="Gallery Preview"
                      />
                    </div>
                  )}
                  {/* ✅ Show small gallery when hovering & cycle images */}
                  {hoveredIndex === index &&
                    product.gallery &&
                    !["template8", "template12"].includes(product.template) &&
                    product.gallery.length > 0 && (
                      <div
                        className="label-box"
                        style={{ position: "absolute" }}
                      >
                        <img
                          src={product.gallery[galleryIndex[index] || 0]}
                          alt="Gallery Preview"
                        />
                      </div>
                    )}

                  <h3 id="pricetag" style={{ fontSize: "15px", color: "blue" }}>Matte : &#8377; {product.price} /  Glossy : &#8377; {product.price + 60}</h3>

                </div>

                <a
                  href="#"
                  className="cart"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/NSPersonalize/${product.id}`);
                  }}
                >
                  <i className="fa-solid fa-cart-shopping"></i>
                </a>
              </div>
            ))
          )}
        </div>
      </section>
    </HelmetProvider>
  );
};

export default Nameslip;