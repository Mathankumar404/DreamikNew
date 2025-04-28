import React, { useContext, useState, useEffect, useRef } from 'react';
// import html2canvas from 'html2canvas';
import "./CustomNameslip.css"
import { useNavigate, useParams } from 'react-router-dom';
import { CartContext } from '../CartContext';
import html2canvas from 'https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js';
import TransformControls from '../nameslip/TransformControls';
import Removebg from '../nameslip/Removebg';
import { compressImageIfNeeded } from '../imagecompressor/imagecompressor';
const CustomNameSlips = () => {
  const persImgContRef = useRef(null);
  const [activeCustomizeDiv, setActiveCustomizeDiv] = useState(null);
  const [isremovebg, setremovebg] = useState(false);
  const navigate = useNavigate();
  const [initialimage, setinitialimage] = useState("");
  const [brightness, setBrightness] = useState(100); // Default 100% (no change)
  const [contrast, setContrast] = useState(100); // Default 100% (no change)
  const { addToCart, cartCount } = useContext(CartContext);
  const [labelType, setlabeltype] = useState("matte")
  const [selectedImage, setSelectedImage] = useState(null);
  const [labelsize, setLabelsize] = useState('Medium - (100mm * 44 mm) 12 labels - 36nos');
  const [imageBorder, setImageBorder] = useState(false);
  const { productcode } = useParams();
  const [backgroundImage, setbackgroundImage] = useState("/image/DreamikAILabel-Rectangle-1080x1920px-HD-WhiteBK-Type2-ImageLeft.png")
  const [transformations, setTransformations] = useState({
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [nameTrans, setNameTrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [schooltrans, setschooltrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [subjecttrans, setsubjecttrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [rollnotrans, setrollnotrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [sectiontrans, setsectiontrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const [classtrans, setclasstrans] = useState({
    fontSize: 30,
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  // State for student details
  const [studentDetails, setStudentDetails] = useState({
    name: "",
    schoolName: "",
    subject: "",
    rollNumber: "",
    section: "",
    class: "",
  });
  const [circleImage, setCircleImage] = useState(false);
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

  const [studentName, setStudentName] = useState("");
  const [fontSize, setFontSize] = useState(30);
  const [fontColor, setFontColor] = useState("#000000");
  const [fontFamily, setFontFamily] = useState("Arial");
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState({});
  const [price, setPrice] = useState(100);
  const [sheet, setSheet] = useState(false);

  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   const storedCartCount = JSON.parse(localStorage.getItem('CartCount')) || 0;
  //   setCartCount(storedCartCount);
  // }, []);
  // Handle input changes
  useEffect(() => {
    const fetchData = async () => {
      const url = '/nameslip_data.json';
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

    loadProductDetails();
  }, []);



  useEffect(() => {
    if (sheet && labelType === "glossy") {
      setPrice(200)
    }
    else if (sheet && labelType === "matte") {
      setPrice(140)
    }


  }, [sheet, labelType])
  var glossy1 = document.getElementById('glossy')
  var normal1 = document.getElementById('normal')
  var labelstyle = "matte";
  const normal = () => {
    normal1.style.backgroundColor = "#13aa52";
    normal1.style.color = "#fff";
    normal1.style.transform = "scale(1.2)";
    glossy1.style.backgroundColor = "snow";
    glossy1.style.borderRadius = "0px";
    normal1.style.borderRadius = "15px";
    glossy1.style.color = "black";
    glossy1.style.transform = "scale(1)";
    normal1.style.transition = ".4s";
    glossy1.style.transition = ".4s";
    setPrice(product.price)
    setlabeltype("matte")
  };
  const glossy = () => {
    glossy1.style.backgroundColor = "#13aa52";
    glossy1.style.color = "#fff";
    glossy1.style.transform = "scale(1.2)";
    normal1.style.backgroundColor = "snow";
    normal1.style.borderRadius = "0px";
    glossy1.style.borderRadius = "15px";
    normal1.style.color = "black";
    normal1.style.transform = "scale(1)";
    normal1.style.transition = ".4s";
    glossy1.style.transition = ".4s";
    setlabeltype("glossy")

    setPrice(160)

  };

  const [extra, setExtra] = useState('');
  const handleSheet = () => {
    setSheet((prevSheet) => {
      const newSheetState = !prevSheet;
      setExtra(newSheetState ? " + OneSheet totally 48nos" : "");
      setPrice(newSheetState ? price + 40 : product.price);
      return newSheetState;
    });
  };

  const handleSelectOption = (e) => {
    setLabelsize(e.target.value);
  }

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
          productcode: product.productcode // Ensure this is initialized
        };
        const rgbToHex = (rgb) => {
          const rgbValues = rgb.match(/\d+/g); // Extract numeric values from rgb string
          if (!rgbValues) return '#000000'; // Fallback to black if invalid
          return `#${rgbValues
            .map((value) => parseInt(value, 10).toString(16).padStart(2, '0'))
            .join('')}`.toUpperCase();
        };
        // Define all label classes
        const labelClasses = [
          'studentname-lab-cus',
          'schoolname-lab-cus',
          'subjectname-lab-cus',
          'rollnu-lab-cus',
          'sectionname-lab-cus',
          'classname-lab-cus'
        ];

        // Map through each label class
        labelClasses.forEach((labelClass) => {
          const label = document.querySelector(`.${labelClass}`);
          if (label) {
            const styles = window.getComputedStyle(label);
            const scaleMatch = styles.transform.match(/matrix\((\d+\.?\d*),/);
            const scale = scaleMatch ? parseFloat(scaleMatch[1]) : 1;
            const fontSize = parseFloat(styles.fontSize) * scale;
            const fontColor = rgbToHex(styles.color);

            productDetails.labels.push({
              className: labelClass,
              text: label.textContent,
              fontSize: `${fontSize}px`,
              fontColor,
              fontFamily: styles.fontFamily,
              fontStyle: styles.fontStyle,
            });
          } else {
            console.warn(`Label with class .${labelClass} not found.`);
          }
        });

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




  // Handle font color change
  const handleFontColorChange = (event) => {
    setFontColor(event.target.value);
  };

  // Handle font family change
  const handleFontFamilyChange = (event) => {
    setFontFamily(event.target.value);

  };
  // Handle image change
  const handleImageChange = async (event) => {
    sessionStorage.removeItem("removebg");
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const compressedFile = await compressImageIfNeeded(file);

      const base64 = await new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.readAsDataURL(compressedFile);
        fileReader.onloadend = () => resolve(fileReader.result);
        fileReader.onerror = (error) => reject(error);
      });

      setinitialimage(base64);
      setSelectedImage(base64)
      sessionStorage.setItem("initialimage", base64);
      sessionStorage.setItem("personImage", base64);


    } catch (err) {

    }
  };

  const handlebackgroundImageChange = (event) => {

    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      // When the file is read, update the state with the image's base64 string
      reader.onload = (e) => {
        setbackgroundImage(e.target.result);
      };

      reader.readAsDataURL(file); // Read the file as a data URL
    }
    console.log(backgroundImage)
  }
  // Handle slider changes
  const handleBrightnessChange = (e) => setBrightness(e.target.value);
  const handleContrastChange = (e) => setContrast(e.target.value);

  const calculateFontSize = (textLength, baseFontSize = 36, minFontSize = 10) => {
    // Reduce font size as text length increases
    const fontSize = baseFontSize - textLength * 0.5; // Adjust the multiplier (0.5) as needed
    return Math.max(fontSize, minFontSize); // Ensure font size doesn't go below the minimum
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newFontSize = calculateFontSize(value.length);

    setStudentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    console.log(name, value)
    // Update the font size for the corresponding label
    if (name === "name") {
      setNameTrans((prev) => ({ ...prev, fontSize: newFontSize }));
    } else if (name === "schoolName") {
      setschooltrans((prev) => ({ ...prev, fontSize: newFontSize }));
    } else if (name === "subject") {
      setsubjecttrans((prev) => ({ ...prev, fontSize: newFontSize }));
    } else if (name === "rollNumber") {
      setrollnotrans((prev) => ({ ...prev, fontSize: newFontSize }));
    } else if (name === "section") {
      setsectiontrans((prev) => ({ ...prev, fontSize: newFontSize }));
    } else if (name === "class") {
      setclasstrans((prev) => ({ ...prev, fontSize: newFontSize }));
    }
  };


  const handleDeleteImage = () => {
    setSelectedImage(null);
    setTransformations({
      scale: 1,
      rotate: 0,
      translateX: 0,
      translateY: 0,
      mirror: 1,
    });
  };
  const updateTransform = (type, value, setter) => {
    setter((prev) => ({ ...prev, [type]: prev[type] + value }));
  };
  const toggleMirror = () => {
    setTransformations((prev) => ({
      ...prev,
      mirror: prev.mirror === 1 ? -1 : 1,
    }));
  };

  const toggleCustomizeDiv = (divId) => {
    console.log(divId)
    setActiveCustomizeDiv((prev) => (prev === divId ? null : divId));
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
  const handlecustomImage = () => {
    if (document.getElementById("customizediv").style.display === "block") {
      document.getElementById("customizediv").style.display = "none";
    } else {
      document.getElementById("customizediv").style.display = "block";
    }
  };
  const handleotherDetails = () => {
    if (document.getElementById("OD").style.display === "block") {
      document.getElementById("OD").style.display = "none";
    } else {
      document.getElementById("OD").style.display = "block";
    }
  };
  // const handlehidename = () => {
  //   if (document.getElementById("namecustomizediv").style.display === "block") {
  //     document.getElementById("namecustomizediv").style.display = "none";
  //   } else {
  //     document.getElementById("namecustomizediv").style.display = "block";
  //   }
  // };
  const handlehideschoolname = () => {
    if (document.getElementById("schoolnamecustomizediv").style.display === "block") {
      document.getElementById("schoolnamecustomizediv").style.display = "none";
    } else {
      document.getElementById("schoolnamecustomizediv").style.display = "block";
    }
  };
  const handlehideSubject = () => {
    if (
      document.getElementById("subjectcustomizediv").style.display ===
      "block"
    ) {
      document.getElementById("subjectcustomizediv").style.display = "none";
    } else {
      document.getElementById("subjectcustomizediv").style.display = "block";
    }
  };
  const handlehideRollno = () => {
    if (
      document.getElementById("rollcustomizediv").style.display ===
      "block"
    ) {
      document.getElementById("rollcustomizediv").style.display = "none";
    } else {
      document.getElementById("rollcustomizediv").style.display = "block";
    }
  };
  const handlehidesection = () => {
    if (
      document.getElementById("sectioncustomizediv").style.display === "block") {
      document.getElementById("sectioncustomizediv").style.display = "none";
    } else {
      document.getElementById("sectioncustomizediv").style.display = "block";
    }
  };
  const handlehideclass = () => {
    if (
      document.getElementById("classcustomizediv").style.display ===
      "block"
    ) {
      document.getElementById("classcustomizediv").style.display = "none";
    } else {
      document.getElementById("classcustomizediv").style.display = "block";
    }
  };
  const handleCircleBorder = (isChecked) => {
    setCircleImage(isChecked); // Update state based on checkbox
  };

  const handleImageBorder = (isChecked) => {
    setImageBorder(isChecked); // Update state for image border
  };
  return (
    <div className="personalizecontainer">
      <div className="pers-img-cont" >
        <div ref={persImgContRef}>
          <div className='stickerdiv'>

            <img
              src={backgroundImage}
              alt="productImage"
              className="personalise-Image"
            />

            <img
              id='perimg'
              className='personImage-cus'
              src={selectedImage}
              alt="yours Image"
              style={{
                border: imageBorder ? "2px solid black" : "none",
                borderRadius: circleImage ? "100%" : "0%",
                filter: `brightness(${brightness}%) contrast(${contrast}%)`,

                transform: `scale(${transformations.scale}) rotate(${transformations.rotate}deg) translate(${transformations.translateX}px, ${transformations.translateY}px) scaleX(${transformations.mirror})`,
                transition: "transform 0.2s",
              }}
            />

          </div>
          <label
            className="studentname-lab-cus"

            style={{
              fontSize: `${nameTrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${nameTrans.scale}) rotate(${nameTrans.rotate}deg) translate(${nameTrans.translateX}px, ${nameTrans.translateY}px) scaleX(${nameTrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.name}
          </label>
          <label
            className="schoolname-lab-cus"
            style={{
              fontSize: `${schooltrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${schooltrans.scale}) rotate(${schooltrans.rotate}deg) translate(${schooltrans.translateX}px, ${schooltrans.translateY}px) scaleX(${schooltrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.schoolName}
          </label>
          <label

            className="subjectname-lab-cus"
            style={{
              fontSize: `${subjecttrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${subjecttrans.scale}) rotate(${subjecttrans.rotate}deg) translate(${subjecttrans.translateX}px, ${subjecttrans.translateY}px) scaleX(${subjecttrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.subject}
          </label>
          <label
            className="rollnu-lab-cus"
            style={{
              fontSize: `${rollnotrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${rollnotrans.scale}) rotate(${rollnotrans.rotate}deg) translate(${rollnotrans.translateX}px, ${rollnotrans.translateY}px) scaleX(${rollnotrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.rollNumber}
          </label>
          <label
            className="sectionname-lab-cus"
            style={{
              fontSize: `${sectiontrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${sectiontrans.scale}) rotate(${sectiontrans.rotate}deg) translate(${sectiontrans.translateX}px, ${sectiontrans.translateY}px) scaleX(${sectiontrans.mirror})`,
              transition: "transform 0.2s",
            }}

          >
            {studentDetails.section}
          </label>
          <label
            className="classname-lab-cus"
            style={{
              fontSize: `${classtrans.fontSize}px`,
              color: fontColor,
              fontFamily: fontFamily,
              transform: `scale(${classtrans.scale}) rotate(${classtrans.rotate}deg) translate(${classtrans.translateX}px, ${classtrans.translateY}px) scaleX(${classtrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.class}
          </label>
        </div>
        {/* Medium - (100mm * 44 mm) 12 labels - 36nos */} <span>{labelsize}{extra}</span>
      </div>

      <div className="controllize-container">

        <div id="imagebar">
          <a href='https://www.canva.com/design/DAGeoUxiChc/ugFZISiuEcJKMrzHEMF5YQ/edit?utm_content=DAGeoUxiChc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
            className='canvaedit'>
            <p>Click Here to</p>
            <i className="fa-solid fa-palette"></i> design Your Background image in canva
          </a>
          <label htmlFor="select-image" id="sel-img-btn">
            Select Your image
          </label>


          <input
            type="file"
            id="select-image"
            onChange={handleImageChange}
            accept="image/*"
          />
          <label htmlFor="select-backgroundimage" id="sel-img-btn">
            Select Background image
          </label>


          <input
            type="file"
            id="select-backgroundimage"
            onChange={handlebackgroundImageChange}
            accept="image/*"
          />
          <button onClick={() => toggleCustomizeDiv("customizediv-cus")} style={{ width: "75px " }} >
            <img
              src="/image/custamize.png"
              style={{ width: "25px " }}
              alt=""
              className="custamlogo"
            />
          </button>
        </div>
        {activeCustomizeDiv === "customizediv-cus" && (
          <div id="customizediv-cus">
            <TransformControls
              onUpdateTransform={(type, value) => updateTransform(type, value, setTransformations)} div={"customize"}
            />
            <button onClick={toggleMirror}>
              {transformations.mirror === 1 ? "Mirror Image" : "Unmirror Image"}
            </button>
            <Removebg selectedImage={selectedImage} setSelectedImage={setSelectedImage} initialimage={initialimage} isremovebg={isremovebg}
              setremovebg={setremovebg} />
            <div className='borderdiv'>
              <div style={{ display: "flex", flexWrap: "nowrap", gap: "10px" }}>
                <label htmlFor="circleImg" style={{ marginLeft: "8px", fontSize: "20px", fontWeight: "bold", whiteSpace: "nowrap" }}>Circle Border</label>
                <input type="checkbox" id='circleImg' checked={circleImage} onChange={(e) => handleCircleBorder(e.target.checked)} />
              </div>
              <div style={{ display: "flex", flexWrap: "nowrap", gap: "10px" }}>
                <label htmlFor="imageBorder" style={{ marginLeft: "8px", fontSize: "20px", fontWeight: "bold", whiteSpace: "nowrap" }}>
                  Image Border
                </label>
                <input
                  type="checkbox"
                  id="imageBorder"
                  checked={imageBorder}
                  onChange={(e) => handleImageBorder(e.target.checked)}
                />
              </div>
            </div>
            <br />
            <div style={{ padding: "20px" }}>
              <h3>Image Brightness & Contrast Adjustment</h3>

              <div style={{ marginBottom: "20px" }}>
                {/* Brightness Slider */}
                <label>
                  Brightness ({brightness}%):
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={brightness}
                    onChange={handleBrightnessChange}
                    style={{ marginLeft: "10px" }}
                  />
                </label>
              </div>

              <div style={{ marginBottom: "20px" }}>
                {/* Contrast Slider */}
                <label>
                  Contrast ({contrast}%):
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={contrast}
                    onChange={handleContrastChange}
                    style={{ marginLeft: "10px" }}
                  />
                </label>
                <button onClick={handleDeleteImage} className='delete-btn'>delete</button>
              </div>
            </div>
          </div>)}

        {/* Input Fields for Student Details */}
        <div className="student-details">
          <div>
            <input
              type="text"
              name="name"
              placeholder="Student Name"
              value={studentDetails.name}
              onInput={handleInputChange}
              className="studentDetails"
            />
            <button onClick={() => toggleCustomizeDiv("namecustomizediv-cus")}>
              <img
                src="/image/custamize.png"
                width={"25px"}
                alt=""
                className="custamlogo"
              />
            </button>
            {activeCustomizeDiv === "namecustomizediv-cus" && (
              <div id="namecustomizediv-cus">
                <TransformControls
                  onUpdateTransform={(type, value) =>
                    setNameTrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                  }
                />

              </div>
            )}
          </div>

          <br />
          <div>
            <input
              type="text"
              name="schoolName"
              placeholder="School Name"
              value={studentDetails.schoolName}
              onInput={handleInputChange}
              className="studentDetails"
            />
            <button onClick={() => toggleCustomizeDiv("schoolnamecustomizediv-cus")}>  <img
              src="/image/custamize.png"
              alt=""
              width={"25px"}
              className="custamlogo"
            /></button>
            {activeCustomizeDiv === "schoolnamecustomizediv-cus" && (
              <div id="schoolnamecustomizediv-cus">
                <TransformControls
                  onUpdateTransform={(type, value) =>
                    setschooltrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                  }
                />
              </div>
            )}
          </div>

          <br />
          <button id="otherdetails" onClick={handleotherDetails}>
            Other Details
          </button>
          <div id="OD">
            <div className='img-cus'>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={studentDetails.subject}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("subjectcustomizediv-cus")}> <img src="/image/custamize.png" alt="" className="custamlogo" width={"25px"} /></button>
              {activeCustomizeDiv === "subjectcustomizediv-cus" && (
                <div id="subjectcustomizediv-cus">
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      setsubjecttrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                    }
                  />
                </div>
              )}

            </div>
            <div className='img-cus'>
              <input
                type="text"
                name="rollNumber"
                placeholder="Roll Number"
                value={studentDetails.rollNumber}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("rollcustomizediv-cus")}> <img
                src="/image/custamize.png"
                width={"25px"}
                alt=""
                className="custamlogo"
              /></button>
              {activeCustomizeDiv === "rollcustomizediv-cus" && (
                <div id="rollcustomizediv-cus">
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      setrollnotrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                    }
                  />
                </div>
              )}
            </div>
            <div className='img-cus'>
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={studentDetails.section}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("sectioncustomizediv-cus")}> <img
                src="/image/custamize.png"
                width={"25px"}
                alt=""
                className="custamlogo"
              /></button>
              {activeCustomizeDiv === "sectioncustomizediv-cus" && (
                <div id="sectioncustomizediv-cus">
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      setsectiontrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                    }
                  />
                </div>
              )}


            </div>
            <div className='img-cus'>
              <input
                type="text"
                name="class"
                placeholder="Class"
                value={studentDetails.class}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("classcustomizediv-cus")}>  <img
                src="/image/custamize.png"
                width={"25px"}
                alt=""
                className="custamlogo"

              /></button>
              {activeCustomizeDiv === "classcustomizediv-cus" && (
                <div id="classcustomizediv1">
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      setclasstrans((prev) => ({ ...prev, [type]: prev[type] + value }))
                    }
                  />
                </div>
              )}

            </div>
          </div >
          <div id="fontcenter">

            {/* Customize Font Color */}
            <div id='font-color'>
              Pick Font Color:
              <input
                type="color"
                value={fontColor}
                onChange={handleFontColorChange}
              />
            </div>
            {/* Customize Font Family */}
            <div id='font-family'>
              <label>Font Family: </label>
              <select onChange={handleFontFamilyChange} value={fontFamily}>
                <option value="Arial">Arial</option>
                <option value="Verdana">Verdana</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Times New Roman">Times New Roman</option>
              </select>
            </div>
            <br />
            <div id="type">
              <h3>Type</h3>
              <br />
              <button id="normal" onClick={normal} ><h4>Matte</h4></button>
              <button id="glossy" onClick={glossy} ><h4>Glossy</h4></button>

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
          </div>
          <button id='goback' onClick={() => navigate(-1)} style={{ marginBottom: '20px' }}>
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default CustomNameSlips;