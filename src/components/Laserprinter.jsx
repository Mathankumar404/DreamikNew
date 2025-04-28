import React, { useContext,useState, useEffect, useRef } from 'react';
// import html2canvas from 'html2canvas';
 import "./laserprinter.css"
import { useNavigate,useParams } from 'react-router-dom';
import { CartContext } from './CartContext';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js';
// import TransformControls from './TransformControls';
const NSPersonalize = () => {
  const persImgContRef = useRef(null);
  const navigate=useNavigate();
  const { addToCart, cartCount } = useContext(CartContext);
  const [labelsize,setLabelsize]=useState('Medium - (100mm * 44 mm) 12 labels - 36nos');
  const { productcode } = useParams(); 
const[labelType,setlabeltype]=useState("Glossy")
  function sendToWhatsApp() {
    var message = " ";
    var phoneNumber = "919498088659";
    var whatsappLink =
      "https://api.whatsapp.com/send?phone=" +
      phoneNumber +
      "&text=" +
      encodeURIComponent(message);
    window.location.href = whatsappLink;
    // window.open() = Window.prototype.open();
    // window.open(whatsappLink);
  };

  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [quantity, setQuantity] = useState(1);
  const [product,setProduct]=useState({});
 const [price,setPrice]=useState(500);
  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   const storedCartCount = JSON.parse(localStorage.getItem('CartCount')) || 0;
  //   setCartCount(storedCartCount);
  // }, []);
  // Handle input changes
  useEffect(() => {
        const fetchData = async () => {
          const url = '/products.json';
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
        const key = "Inkjet/Laser printer";
        if (key && data[key]) {
          setProduct(data[key]);
          document.title = data[key].name;
        }
      };
  
      loadProductDetails();
    }, []);


  const [sheet,setSheet]=useState(false);
  const [extra,setExtra]=useState('');
  const handleSheet = () => {
    setSheet((prevSheet) => {
      const newSheetState = !prevSheet;
      setExtra(newSheetState ? " + OneSheet totally 48nos" : "");
      setPrice(newSheetState ? price + 40 : product.price);
      return newSheetState;
    });
  };

  const handleSelectOption = (e) => {
    setLabelsize(e.target.value);}

    //add to the cart
    const handleAddToCart = async () => {
     
      if (persImgContRef.current) {
        try {
         
          const canvas = await html2canvas(persImgContRef.current);
          const imageData = canvas.toDataURL('image/png'); // Export as a Base64 image
          
          
          // Ensure price and quantity are being passed correctly
          const productDetails = {
            image: imageData, // Base64 image data
            quantity: quantity, // User-selected quantity
            price: price * quantity, // Calculated price for the given quantity
            Name: product.name, // Product name
            labeltype: labelType, // Example for extra info like label type
            size: `${labelsize}${extra}`, // Size information (if needed)
            labels: [],
            productcode:product.productcode // Ensure this is initialized
        };
    //     const rgbToHex = (rgb) => {
    //       const rgbValues = rgb.match(/\d+/g); // Extract numeric values from rgb string
    //       if (!rgbValues) return '#000000'; // Fallback to black if invalid
    //       return `#${rgbValues
    //           .map((value) => parseInt(value, 10).toString(16).padStart(2, '0'))
    //           .join('')}`.toUpperCase();
    //   };
        // Define all label classes
        // const labelClasses = [
        //     'studentname-lab2',
        //     'schoolname-lab2',
        //     'subjectname-lab2',
        //     'rollnu-lab2',
        //     'sectionname-lab2',
        //     'classname-lab2'
        // ];
        
        // // Map through each label class
        // labelClasses.forEach((labelClass) => {
        //     const label = document.querySelector(`.${labelClass}`);
        //     if (label) {
        //         const styles = window.getComputedStyle(label);
        //         const scaleMatch = styles.transform.match(/matrix\((\d+\.?\d*),/);
        //         const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
        //         const fontSize = parseFloat(styles.fontSize) * scale;
        //         const fontColor = rgbToHex(styles.color);
        
        //         productDetails.labels.push({
        //             className: labelClass,
        //             text: label.textContent,
        //             fontSize: `${fontSize}px`,
        //             fontColor,
        //             fontFamily: styles.fontFamily,
        //             fontStyle: styles.fontStyle,
        //         });
        //     } else {
        //         console.warn(`Label with class .${labelClass} not found.`);
        //     }
        // });
        
        // Debugging log
        console.log('Product Details:', productDetails);
          // Retrieve existing cart from localStorage
          const existingCart = JSON.parse(localStorage.getItem('OrderData')) || [];
    
          // Push the new product to the cart
          existingCart.push(productDetails);
    
          // Store the updated cart back into localStorage
          localStorage.setItem('OrderData', JSON.stringify(existingCart));

          // Update cart count
          addToCart();
        // const newCartCount = cartCount + 1;
        // setCartCount(newCartCount);
        // localStorage.setItem('CartCount', newCartCount);

          alert('Product added to cart successfully!');
        } catch (error) {
          console.error('Error capturing the div:', error);
        }
      }
      navigate('/Order');
    };
    

  const handlePrice = (e) => {
    setQuantity(e.target.value);
  };

  const handleDownload = () => {
    const element = persImgContRef.current; // Get the referenced div
    if (!element) {
      console.error("Element not found for download");
      return;
    }
  
    window.html2canvas(element, { useCORS: true, backgroundColor: "#ffffff" }) // Ensure CORS and background color
      .then((canvas) => {
        const imgData = canvas.toDataURL("image/png");
        const link = document.createElement("a");
        link.href = imgData;
        link.download = "personalized-image.png";
        link.click();
      })
      .catch((error) => {
        console.error("Error capturing the div:", error.message);
      });
  };

 


  return (
    <div className="personalizecontainer-laser">
      <div className="pers-img-cont-laser" >
        <div ref={persImgContRef}>
        <img
          src="/image/laserprinter.png"
          alt="productImage"
          className="personalise-Image-laser"
        />
        </div>
        <h3>A4 glossy 120GSM precut sticker(6x2) Blank inkjet printable</h3>
        {/* Medium - (100mm * 44 mm) 12 labels - 36nos */} <span>{labelsize}{extra}</span>
      
      </div>
          <div id="fontcenter">
            <div id="type">
            <h3>Type:Glossy</h3>
          </div>
          <div id="size">
            <h3>Size</h3>
            <br />
            <select name="" id="selectsize" onClick={handleSelectOption}>
               {/* <option value="small">
                Small - (100mm * 34 mm) 16 labels - 32nos
              </option> */}
              <option value="Medium - (100mm * 44 mm) 12 labels - 36nos">
                Medium - (100mm * 44 mm) 12 labels - 36nos
              </option>
               {/* <option value="Large - (100mm * 58 mm) 10 labels - 40nos">
                Large - (100mm * 58 mm) 10 labels - 40nos
              </option>
              <option value="Jumbo - (100mm * 68 mm) 8 labels - 48nos">
                Jumbo - (100mm * 68 mm) 8 labels - 48nos
              </option>  */}
            </select>
            {sheet ? (<button id="removeextrasheet" onClick={handleSheet}>Remove extra sheet</button>) 
            : (<button id="addextrasheet" onClick={handleSheet}>Add extra sheet</button>)}
          </div>
          <div id="quantity">
          Quantity
            <input
              type="number"
              min={1}
              value={quantity}
              onChange={handlePrice}
              style={{ width: "50px" }}
            />
          </div>
            <label id="price">Rs.price {price * quantity}</label>
            <br />
            <button id="add" onClick={handleAddToCart}><i className="fa-solid fa-cart-plus"></i> Add to cart</button>
            <br />
            
            <button id="whatsapp" onClick={sendToWhatsApp}>
            <i className='fa-brands fa-whatsapp' id='whatsapp-icon'></i> For More Than One Image Contact Us in WhatsApp
          </button><br />
          <button onClick={handleDownload} id="down">
              Download Image
            </button> <br />
        
          <button id='goback' onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
          <i className="fa-solid fa-arrow-left"></i> Go Back
      </button>
      </div>
        </div>
      
  );
};

export default NSPersonalize;