import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductOffer from '../Productoffer/Productoffer';
import { useCouponContext } from "../adminpanel/CouponContext";
import axios from 'axios';
const ProductDetails = () => {
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();
  const { coupons, setCoupons } = useCouponContext();
  const [offers, setoffers] = useState(null);
  const fetchCoupons = async () => {

    try {
      const response = await axios.get("https://dreamik-intern.onrender.com/api/coupons");
      setCoupons(Array.isArray(response.data) ? response.data : []);
    } catch (error) {
      console.error("Error fetching coupons:", error);
      setCoupons([]);
    }

  };
  useEffect(() => {
    const fetchData = async () => {
      const url = '/cutoutnameslip_data.json';
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        const data = await response.json();
        localStorage.setItem('data', JSON.stringify(data));
        return data;
      } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
      }
    };

    const loadProductDetails = async () => {
      const data = await fetchData();
      const key = localStorage.getItem('keyid');
      if (key && data[key]) {
        setProduct(data[key]);
        document.title = data[key].name;
      }
    };
    const fetchOffers = async () => {
      try {
        const response = await fetch("/offer.json");
        const data = await response.json();
        setoffers(data.cutoutnameslips);

      } catch (error) {
        console.error("Error fetching offers:", error);
      }
    };
    fetchOffers();
    loadProductDetails();
    fetchCoupons();
  }, []);

  const handlePersonalizeAndAddToCart = (id, template, productcode) => {
    localStorage.removeItem("editedproduct");

    // Correct navigation without `:`
    if (`CT${template}`) {
      navigate(`/${template}/${productcode}`);
    }

    else {
      console.warn("Invalid template:", template);
    }

  };

  if (!product) {
    return <div>Loading...</div>;
  }




  const start = new Date();
  const end = new Date(offers?.end_time || null);

  const formatted = new Date(coupons[6]?.coupon_end) || null;

  const diffInMs = end - start;
  const diffInSeconds = diffInMs / 1000;

  return (
    <section id="prodetails" className="section-p1">
      <div className="single-pro-image">
        <img src={product.source} alt={product.name} width="100%" id="MainImg" loading="lazy" />
      </div>
      <div className="single-pro-details" id="details">
        <h6>Home / Product</h6>
        <h4>{product.name}</h4>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-start", alignItems: "center" }}>
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
          originalPrice={offers?.original_price || 340}
          discountPercentage={offers?.offer_percentage || null}
          offerEndTime={diffInSeconds}
          productprice={offers?.original_price || 340}
          offername={offers?.offername || null}
          productname={"cutoutnameslips"}
        />
        {/* <h2>Rs. {product.price}</h2> */}
        <strong> 10x4.4cm with 130gsm paper thickness gumming paper</strong>
        <h4>Product Details</h4>
        <span>{product.name}</span>
        <br />
        <span>{product.props.join(', ')}</span>
        <br />
        <button className="P-btn" id="targetbtn"
          onClick={() => handlePersonalizeAndAddToCart(product.id, product.template, product.productcode)}
        >
          Personalize and Add To Cart
        </button>
      </div>

    </section>
  );
};

export default ProductDetails;
