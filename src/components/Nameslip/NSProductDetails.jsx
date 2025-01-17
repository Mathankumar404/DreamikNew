import React, { useEffect, useState } from 'react';
import { useNavigate,useParams } from 'react-router-dom';
const NSProductDetails = () => {
  const [product, setProduct] = useState(null);
  const navigate=useNavigate();
  const { id } = useParams();
  useEffect(() => {
    const fetchData = async () => {
      const url = '/data.json';
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
      if (data && id && data[id]) {
        setProduct(data[id]);
        document.title = data[id].name; // Update document title to the product name
      } else {
        console.warn('Product not found');
      }
    };

    loadProductDetails();
  }, [id]);

  const handlePersonalizeAndAddToCart = (id) => {
    
    if (id) {
      localStorage.setItem('keyid', id); // Store the current product ID in localStorage
      navigate(`/nspersonalize/${id}`); // Navigate to the NSPersonalize route
    }
  };
  if (!product) {
    return <div>Loading...</div>;
  }
  

  return (
    <section id="prodetails" className="section-p1">
      <div className="single-pro-image">
        <img src={product.source} alt={product.name} width="100%" id="MainImg" />
      </div>
      <div className="single-pro-details" id="details">
        <h6>Home / Product</h6>
        <h4>{product.name}</h4>
        <h2>Rs. {product.price}</h2>

        <h4>Product Details</h4>
        <span>{product.name}</span>
        <br />
        {product.props && <span>{product.props.join(', ')}</span>}

        <br />
        <button className="P-btn" id="targetbtn" onClick={() => handlePersonalizeAndAddToCart(product.id)} >
          Personalize and Add To Cart
        </button>
      </div>
      <button onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
        Go Back
      </button>
    </section>
  );
};

export default NSProductDetails;
