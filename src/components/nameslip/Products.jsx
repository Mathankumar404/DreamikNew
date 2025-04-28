import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRef } from "react";
import ProductOffer from "../Productoffer/Productoffer";
// import "./products.css";
const Products = () => {
  const { productcode } = useParams();
  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState(null);
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const thumbnailContainerRef = useRef(null);
  const thumbnailRefs = useRef([]);
  const [texts, setTexts] = useState(false);
  const [offers, setoffers] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const url = "/nameslip_data.json";
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error("Network response was not ok " + response.statusText);
        }
        const data = await response.json();
        localStorage.setItem("data", JSON.stringify(data));
        return data;
      } catch (error) {
        console.error("Fetch error:", error);

        return null;
      }
    };

    const loadProductDetails = async () => {
      const data = await fetchData();
      if (!data) return;
      const NSHLT = productcode.startsWith("NSHLT");
      const extractedId = NSHLT
        ? 118 + parseInt(productcode.slice(-3))
        : productcode.slice(-3);

      const productData = data[extractedId] || data[parseInt(extractedId, 10)];

      if (productData) {
        setProduct(productData);
        // Set main image initially
        document.title = productData.name;
        localStorage.setItem("keyid", extractedId);
      } else {
        console.warn("Product not found:", extractedId);
      }
    };

    const fetchOffers = async () => {
      try {
        const response = await fetch("/offer.json");
        const data = await response.json();
        setoffers(data.nameslips)

      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };

    fetchOffers();
    loadProductDetails();
  }, [productcode]);

  const handleImageChange = (imgSrc, index) => {
    setMainImage(imgSrc);
    setCurrentIndex(index);
    if (thumbnailRefs.current[index]) {
      thumbnailRefs.current[index].scrollIntoView({
        behavior: "smooth",
        inline: "center",
        block: "nearest",
      });
    }
  };

  const handlePersonalizeAndAddToCart = (id, template, productcode) => {
    localStorage.removeItem("editedproduct");

    if (template === "template11" || template === "template12") {
      const selectedlabel = mainImage
        ? mainImage
        : "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT03.png";
      localStorage.setItem("selectedlabel", selectedlabel);
    } else {
      const selectedlabel = mainImage ? mainImage : "/image/waterlabel.png";
      localStorage.setItem("selectedlabel", selectedlabel);
    }

    localStorage.setItem("keyid", id);

    // Correct navigation without `:`
    if (`NS${template}`) {
      navigate(`/NS${template}/${productcode}`);
    } else {
      console.warn("Invalid template:", template);
    }
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const nextImage = () => {
    const newIndex =
      currentIndex === product.gallery.length - 1 ? 0 : currentIndex + 1;
    setCurrentIndex(newIndex);
    setMainImage(product.gallery[newIndex]);
    setTexts(true);
  };

  const prevImage = () => {
    const newIndex =
      currentIndex === 0 ? product.gallery.length - 1 : currentIndex - 1;
    setCurrentIndex(newIndex);
    setMainImage(product.gallery[newIndex]);
  };


  const start = new Date();
  const end = new Date(offers?.end_time || null);
  const diffInMs = end - start;
  const diffInSeconds = diffInMs / 1000;
  return (
    <section id="prodetails" className="section-p1">
      <div className="single-pro-image">
        <div id="MainImg">
          <img
            src={product.source}
            alt={product.name}
            width="100%"
            id="main-label"
          />
          <img
            src={
              mainImage
                ? mainImage
                : product.template === "template11" ||
                  product.template === "template12"
                  ? "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT03.png"
                  : [
                    "template2",
                    "template4",
                    "template5",
                    "template6",
                    "template1",
                    "template7",
                    "template10",
                  ].includes(product.template)
                    ? ""
                    : "/image/waterlabel.png"
            }
            alt="mask"
            width="100%"
            id="mask-label"
            className={
              mainImage === "/image/waterlabel/4.png" ||
                mainImage ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.png" ||
                mainImage === "/image/waterlabel/4.webp" ||
                mainImage ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "mask-label-special"
                : "mask-label"
            }
          />
        </div>
        {/* Thumbnails Section */}
        {product.gallery && product.gallery.length > 0 && (
          <h2
            id="selectframe"
            style={{
              marginTop: "4%",
              marginRight: "0px",
              lineHeight: "35px",
            }}
          >
            Select name frame
            <br />{" "}
            <i
              className="fas fa-arrow-down bounce"
              style={{ fontSize: "30px", color: "red" }}
            ></i>
          </h2>
        )}
        <div style={{ display: "flex" }}>
          {product.gallery && product.gallery.length > 0 && (
            <div
              id="carouselbox"

            >
              <button className="arrow1 left-arrow" onClick={prevImage}>
                &#9665;
              </button>
              <div className="thumbnail-container" ref={thumbnailContainerRef}>
                {product.gallery.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className={`thumbnail ${index === currentIndex ? "active" : ""
                      }`}
                    ref={(el) => (thumbnailRefs.current[index] = el)}
                    style={{
                      display:
                        index >= currentIndex && index < currentIndex + 3
                          ? "block"
                          : "none",
                    }}
                    onClick={() => handleImageChange(img, index)}
                  />
                ))}
              </div>
              <button className="arrow1 right-arrow" onClick={nextImage}>
                &#9655;
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="single-pro-details" id="details">
        <h6>Home / Product</h6>
        <h4>{product.name}</h4>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }} className="highlightsdiv">
          <h2>✨ Our Product Highlights ✨</h2>
          <ul style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "flex-start", marginLeft: "20%" }}>
            <li>
              <strong>✅ Quick:</strong> Get your product delivered the
              same day!<span className="astrics">*</span> 🚀

            </li>
            <li>
              <strong>✅ Affordable:</strong> The most economical choice
              in the market! 💰
            </li>
            <li>
              <strong>✅ Safe:</strong> Printed with child-friendly
              Inkjet colors. 👶🎨
            </li>
          </ul>
        </div>
        <ProductOffer
          originalPrice={offers?.original_price_matte || 100}
          discountPercentage={offers?.offer_percentage_matte || null}
          offerEndTime={diffInSeconds}
          productprice={offers?.original_price_matte || 100}
          offername={offers?.offer_name || null}
          productname={"Nameslips"}
        />
        <div style={{ display: "flex", flexDirection: "column" }}>
          <strong>  Matte: Get 36 nos of 10x4.5 cm size on 80 GSM paper matte sticker paper</strong><br />

          <strong>
            Glossy: Get 36nos of 10x4.5 cm size on 120 GSM paper glossy sticker paper
          </strong>
        </div>
        <h4>Product Details</h4>

        <span>{product.name}</span>
        <br />
        <span>{product.props?.join(", ")}</span>
        <br />

        <button
          className="P-btn"
          id="targetbtn"
          onClick={() =>
            handlePersonalizeAndAddToCart(
              product.id,
              product.template,
              product.productcode
            )
          }
          style={{ margin: "20px", width: "50%" }}
        >
          Personalize and Add To Cart
        </button>
        {texts && (
          <p>
            click here{" "}
            <i
              className="fas fa-arrow-up bounce"
              style={{ fontSize: "20px", color: "red" }}
            ></i>
            <br />
            (After selecting your frame)
          </p>
        )}
      </div>
      {/* <div style={{borderTop:"2px solid black",width:"100%",marginBottom:"5px"}}></div> */}

      <h4 style={{ marginTop: "20px" }}>Output of labels</h4>
      <div>
        <hr style={{
          height: "4px", backgroundColor: "black", overflowX: "hidden", justifyContent: "center", alignItems: "center"
        }} />

        < div className="outputlables" >
          <div className="scroller">
            {Array.from({ length: 12 }, (_, index) => (
              <img
                key={index + 1}
                src={`/image/Nsdemo/Nsdemo${(index % 3) + 1}.jpeg`}
                alt={`Image ${(index % 3) + 1}`}
                width="250px"
                height="250px"
                className="cutoutsample"
              />
            ))}
          </div>
        </div>
        <hr
          style={{ height: "4px", backgroundColor: "black", marginTop: "20px" }}
        />
      </div>
    </section >
  );
};

export default Products;