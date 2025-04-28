import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js';
import { CartContext } from './CartContext';

const AiNameslipGen = () => {
    const [iframeLoading, setIframeLoading] = useState(true);
    const [editedImage, setEditedImage] = useState(null);
    const navigate = useNavigate();
    const persImgContRef = useRef();
    const { addToCart, cartCount, removeFromCart } = useContext(CartContext);

    // Listen for postMessage from iframe
    useEffect(() => {
        const handleMessage = (event) => {
            if (event.origin === 'https://inked-frame.vercel.app') {
                console.log('Got edited image data:', event.data);
                setEditedImage(event.data.editedImageURL);
            }
        };
        window.addEventListener('message', handleMessage);
        return () => window.removeEventListener('message', handleMessage);
    }, []);

    const handleIframeLoad = () => {
        setIframeLoading(false); // hide spinner when iframe is fully loaded
    };

    const handleAddToCart = async () => {

        if (persImgContRef.current) {
            try {

                const canvas = await html2canvas(persImgContRef.current);
                const imageData = canvas.toDataURL('image/png'); // Export as a Base64 image

                // Ensure price and quantity are being passed correctly
                const productDetails = {
                    image: imageData, // Base64 image data
                    quantity: 1, // User-selected quantity
                    price: 50, // Calculated price for the given quantity
                    Name: "AI Prompt Gen Image", // Product name
                    productcode: "NS00001",
                    label: ["dgdg", "dgg", "kjfdnnkfnd"],
                    labeltype: "matte",
                    size: "ufhfkjdnkjf", // Size information (if needed)


                };


                // Debugging log
                console.log('Product Details:', productDetails);
                // Retrieve existing cart from localStorage
                const existingCart = JSON.parse(localStorage.getItem('OrderData')) || [];

                // Push the new product to the cart
                existingCart.push(productDetails);

                // Store the updated cart back into localStorage
                localStorage.setItem('OrderData', JSON.stringify(existingCart));

                addToCart();

                alert('Product added to cart successfully!');
            } catch (error) {
                console.error('Error capturing the div:', error);
            }

            navigate('/Order');
        };

    }


    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        const imageURL = URL.createObjectURL(file);
        setEditedImage(imageURL);
    };

    return (
        <div style={{ position: "relative", minHeight: "100vh" }}>
            {/* Loader overlay */}
            {iframeLoading && (
                <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    background: "rgba(255, 255, 255, 0.9)",
                    zIndex: 10
                }}>
                    <div className="spinner" style={{
                        width: "50px",
                        height: "50px",
                        border: "5px solid #ccc",
                        borderTop: "5px solid #333",
                        borderRadius: "50%",
                        animation: "spin 1s linear infinite"
                    }}></div>
                </div>
            )}

            {/* Iframe */}
            <iframe
                src="https://inked-frame.vercel.app/app"
                onLoad={handleIframeLoad}
                style={{ width: "100%", height: "100vh", border: "none" }}
                title="AI Editor"
                loading="lazy"
            ></iframe>

            {/* Render edited image if available */}
            {editedImage && (
                <div style={{ textAlign: 'center', marginTop: '20px' }} ref={persImgContRef}>
                    <img
                        src={editedImage}
                        alt="Edited Result"
                        style={{ maxWidth: '90%', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.1)' }}
                    />
                </div>
            )}
            <input type="file" accept="image/*" onChange={handleFileUpload} />


            <button onClick={handleAddToCart}>Add to Cart</button>
            <style>
                {`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                `}
            </style>


        </div>
    );
};

export default AiNameslipGen;