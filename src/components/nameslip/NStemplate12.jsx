import React, { useContext, useState, useEffect, useRef } from "react";
// import html2canvas from 'html2canvas';
import "./NStemplate12.css";
import { useNavigate, useParams } from "react-router-dom";
import { CartContext } from "../CartContext";
import html2canvas from "https://cdn.jsdelivr.net/npm/html2canvas@latest/dist/html2canvas.esm.js";
import TransformControls from "./TransformControls";
import Removebg from "./Removebg";
import { compressImageIfNeeded } from '../imagecompressor/imagecompressor.js'; // Adjust the path accordingly

const NSPersonalize = () => {
  const persImgContRef = useRef(null);
  const [activeCustomizeDiv, setActiveCustomizeDiv] = useState(null);
  const navigate = useNavigate();
  const [brightness, setBrightness] = useState(100); // Default 100% (no change)
  const [contrast, setContrast] = useState(100); // Default 100% (no change)
  const { addToCart, cartCount } = useContext(CartContext);
  const [labelType, setlabeltype] = useState("matte");
  const [imageBorder, setImageBorder] = useState(false);
  const { productcode } = useParams();
  const [price, setPrice] = useState(100);
  const [initialimage, setinitialimage] = useState("");
  var editedproduct = JSON.parse(localStorage.getItem("editedproduct"));

  const normalRef = useRef(null);
  const glossyRef = useRef(null);
  const [isremovebg, setremovebg] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(null);
  const [labelsize, setLabelsize] = useState('Medium - (100mm * 44 mm) 12 labels - 36nos');

  const offer = JSON.parse(sessionStorage.getItem("Nameslipoffer")) || 100;



  const studentDetail = JSON.parse(sessionStorage.getItem("studentDetails")) || null;
  const calculateFontSize = (
    textLength,
    baseFontSize = 38,
    minFontSize = 20
  ) => {
    // Reduce font size as text length increases
    const fontSize = baseFontSize - textLength * 0.3; // Adjust the multiplier (0.5) as needed
    return Math.max(fontSize, minFontSize); // Ensure font size doesn't go below the minimum
  };
  const [transformations, setTransformations] = useState({
    scale: 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
  });
  const fontdetails = JSON.parse(sessionStorage.getItem("detailsFont") || null);

  const [nameTrans, setNameTrans] = useState({

    fontSize: editedproduct?.labels?.[0]?.text?.length
      ? calculateFontSize(editedproduct.labels[0].text.length) + 10
      : studentDetail?.name?.length
        ? calculateFontSize(studentDetail.name.length) + 10
        : 30, scale: editedproduct ? parseInt(editedproduct.labels[0].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[0] ? editedproduct.labels[0].fontColor : fontdetails?.[0]?.color ? fontdetails?.[0]?.color : "#292d9e",

  });
  const [schooltrans, setschooltrans] = useState({
    fontSize: editedproduct?.labels?.[1]?.text?.length
      ? calculateFontSize(editedproduct.labels[1].text.length)
      : studentDetail?.schoolName?.length
        ? calculateFontSize(studentDetail.schoolName.length)
        : 30,
    scale: editedproduct ? parseInt(editedproduct.labels[1].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[1] ? editedproduct.labels[1].fontColor : fontdetails?.[1]?.color ? fontdetails[1].color : "#292d9e",

  });
  const [subjecttrans, setsubjecttrans] = useState({
    fontSize: editedproduct ? parseInt(editedproduct.labels[2].fontSize) : 30,
    scale: editedproduct ? parseInt(editedproduct.labels[2].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[2] ? editedproduct.labels[2].fontColor : fontdetails?.[2]?.color ? fontdetails[2].color : "#292d9e",

  });
  const [rollnotrans, setrollnotrans] = useState({
    fontSize: editedproduct?.labels?.[3]?.text?.length
      ? calculateFontSize(editedproduct.labels[3].text.length)
      : studentDetail?.rollNumber?.length
        ? calculateFontSize(studentDetail.rollNumber.length)
        : 30,
    scale: editedproduct ? parseInt(editedproduct.labels[3].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[3] ? editedproduct.labels[3].fontColor : fontdetails?.[3]?.color ? fontdetails[3].color : "#292d9e",

  });
  const [sectiontrans, setsectiontrans] = useState({
    fontSize: editedproduct?.labels?.[4]?.text?.length
      ? calculateFontSize(editedproduct.labels[4].text.length)
      : studentDetail?.section?.length
        ? calculateFontSize(studentDetail.section.length)
        : 30, scale: editedproduct ? parseInt(editedproduct.labels[4].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[4] ? editedproduct.labels[4].fontColor : fontdetails?.[4]?.color ? fontdetails[4].color : "#292d9e",

  });
  const [classtrans, setclasstrans] = useState({
    fontSize: editedproduct?.labels?.[5]?.text?.length
      ? calculateFontSize(editedproduct.labels[5].text.length)
      : studentDetail?.class?.length
        ? calculateFontSize(studentDetail.class.length)
        : 30, scale: editedproduct ? parseInt(editedproduct.labels[5].scale) : 1, // Zoom level
    rotate: 0, // Rotation angle
    translateX: 0, // Horizontal movement
    translateY: 0, // Vertical movement
    mirror: 1,
    color: editedproduct?.labels?.[5] ? editedproduct.labels[5].fontColor : fontdetails?.[5]?.color ? fontdetails[5].color : "#292d9e",

  });
  // State for student details
  const [orderData, setOrderData] = useState(() => {
    try {
      const storedData = JSON.parse(localStorage.getItem("OrderData")) || [];
      return storedData.length > 0 ? storedData[storedData.length - 1] : null;
    } catch (error) {
      console.error("Error parsing OrderData from localStorage:", error);
      return null;
    }
  });

  const [selectedImage, setSelectedImage] = useState(sessionStorage.getItem("personImage") ||
    orderData?.personImage || null
  );
  const str = orderData?.labels?.[2]?.text;

  const formattedStr = Array.isArray(str) ? str[0] : str;

  // Convert string to an array
  const arr = typeof formattedStr === "string"
    ? formattedStr.split(",").map(item => item.trim()).filter(item => item !== "")
    : [];

  const [studentDetails, setStudentDetails] = useState({
    name: editedproduct?.labels?.[0]?.text || studentDetail?.name || orderData?.labels?.[0]?.text || "",
    schoolName: editedproduct?.labels?.[1]?.text || studentDetail?.schoolName || orderData?.labels?.[1]?.text || "",
    subject: editedproduct?.labels?.[2]?.text || studentDetail?.subject || orderData && arr || [],
    rollNumber: editedproduct?.labels?.[3]?.text || studentDetail?.rollNumber || orderData?.labels?.[3]?.text || "",
    section: editedproduct?.labels?.[4]?.text || studentDetail?.section || orderData?.labels?.[4]?.text || "",
    class: editedproduct?.labels?.[5]?.text || studentDetail?.class || orderData?.labels?.[5]?.text || "",

  });
  sessionStorage.setItem("studentDetails", JSON.stringify(studentDetails) || null);
  sessionStorage.setItem("detailsFont", JSON.stringify([nameTrans, schooltrans, subjecttrans, rollnotrans, sectiontrans, classtrans] || null));


  useEffect(() => {

    if (labelType === "matte") {
      setPrice(Math.round(offer.original_price_matte
        * (1 - offer.
          offer_percentage_matte / 100)
      ) || 100);
      if (studentDetails.subject.length > 0) {
        setPrice(Math.round(offer.original_price_matte
          * (1 - offer.
            offer_percentage_matte / 100)
        ) + 30 || 100 + 30);
      }
    }
    if (labelType === "glossy") {
      setPrice(Math.round(
        offer.original_price_glossy * (1 - offer.
          offer_percentage_glossy / 100)
      ) || 160)
      if (studentDetails.subject.length > 0) {
        setPrice(Math.round(
          offer.original_price_glossy * (1 - offer.
            offer_percentage_glossy / 100) + 30
        ) || 160 + 30)
      }
    };
  }, [offer, labelType, studentDetails.subject])

  useEffect(() => {
    let offer = null
    const fetchOfferAndCheckCart = async () => {
      try {
        const response = await fetch("/offer.json");
        if (!response.ok) {
          console.log("error");
        } else {
          offer = await response.json();
        }
      } catch (error) {
        console.error(error);
      }

      const end_time_string = offer?.onePlusOneOffer?.end_time;

      const end_time = end_time_string ? new Date(end_time_string) : null;
      const start_time = new Date();
      const diffInSeconds = (end_time - start_time) / 1000;
      if (diffInSeconds > 10) {
        const cart = JSON.parse(localStorage.getItem("OrderData")) || [];
        let cartnscount = 0;

        cart.forEach((item) => {
          if (item.template?.startsWith("templ")) {
            cartnscount += 1;
          }
        });

        if (cartnscount % 2 !== 0) {
          if (labelType === "matte") {
            setPrice(0);
          }

        }
      };
    }
    fetchOfferAndCheckCart();
  }, [orderData, labelType]);

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
  }

  const [fontColor, setFontColor] = useState(
    editedproduct ? editedproduct.labels[0].fontColor : "#292d9e"
  );
  const [fontFamily, setFontFamily] = useState(
    editedproduct ? editedproduct.labels[0].fontFamily : "Arial"
  );
  const [quantity, setQuantity] = useState(
    parseInt(editedproduct?.quantity) || 1
  );
  const [product, setProduct] = useState({});

  // const [cartCount, setCartCount] = useState(0);

  // useEffect(() => {
  //   const storedCartCount = JSON.parse(localStorage.getItem('CartCount')) || 0;
  //   setCartCount(storedCartCount);
  // }, []);
  // Handle input changes
  const customizeDivRefs = useRef({});

  useEffect(() => {
    if (activeCustomizeDiv && customizeDivRefs.current[activeCustomizeDiv]) {
      const div = customizeDivRefs.current[activeCustomizeDiv];

      setTimeout(() => {
        div.scrollIntoView({
          behavior: "smooth",
          block: "end",
          inline: "nearest",
        });
        div.focus({ preventScroll: true });
        div.blur();
      }, 100);
    }
  }, [activeCustomizeDiv]);

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
        console.error(
          "There has been a problem with your fetch operation:",
          error
        );
      }
    };

    const loadProductDetails = async () => {
      const data = await fetchData();
      const key = localStorage.getItem("keyid");
      if (key && data[key]) {
        setProduct(data[key]);
        document.title = data[key].name;
      }
    };

    loadProductDetails();

    const storedLabel = localStorage.getItem("selectedlabel");
    if (storedLabel) {
      setSelectedLabel(storedLabel);
    }

    // if(editedproduct)
    // {
    //     if(editedproduct.size.includes('+ OneSheet totally 48nos'))
    //     {
    //       handleSheet();
    //     }

    // }
    // if(editedproduct)
    // {
    //     if(editedproduct.labeltype==="matte")
    //     {
    //       normal();
    //     }
    //     if(editedproduct.labeltype==="glossy")
    //       {
    //         glossy();
    //       }

    // }

    if (!editedproduct) {
      return;
    }
    // Determine the label type
    var label = editedproduct.labeltype ? editedproduct.labeltype : labelType;
    // Update state

    setlabeltype(label);
    // Call appropriate function based on label type

    if (label === "glossy") {
      glossy();
    } else if (label === "matte") {
      normal();
    }

    // Set selected image
    setSelectedImage(
      editedproduct.personImage ? editedproduct.personImage : selectedImage
    );
    if (editedproduct.size?.includes("OneSheet totally 48nos")) {
      setSheet((prevSheet) => {
        const newSheetState = true;
        const l = label === "glossy" ? 60 : 0;
        setExtra(newSheetState ? " + OneSheet totally 48nos" : "");
        setPrice(newSheetState ? price + 40 + l : 100 + l);

        return newSheetState;
      });
    }
  }, []);

  const normal = () => {
    if (normalRef.current && glossyRef.current) {
      normalRef.current.style.backgroundColor = "#13aa52";
      normalRef.current.style.color = "#fff";
      normalRef.current.style.transform = "scale(1.2)";
      normalRef.current.style.borderRadius = "15px";

      glossyRef.current.style.backgroundColor = "snow";
      glossyRef.current.style.color = "black";
      glossyRef.current.style.borderRadius = "0px";
      glossyRef.current.style.transform = "scale(1)";

      normalRef.current.style.transition = ".4s";
      glossyRef.current.style.transition = ".4s";

      setlabeltype("matte");
      // setPrice(product.price);

      !editedproduct && setPrice(product.price);
      // editedproduct && setPrice(product.price);
      editedproduct && setPrice(100);
      if (sheet) {
        setPrice(100 + 40);
      } else {
        setPrice(100);
      }
    }
  };
  const glossy = () => {
    if (normalRef.current && glossyRef.current) {
      glossyRef.current.style.backgroundColor = "#13aa52";
      glossyRef.current.style.color = "#fff";
      glossyRef.current.style.transform = "scale(1.2)";
      glossyRef.current.style.borderRadius = "15px";

      normalRef.current.style.backgroundColor = "snow";
      normalRef.current.style.color = "black";
      normalRef.current.style.borderRadius = "0px";
      normalRef.current.style.transform = "scale(1)";

      normalRef.current.style.transition = ".4s";
      glossyRef.current.style.transition = ".4s";

      setlabeltype("glossy");
      !editedproduct && setPrice(product.price + 60);
      // editedproduct && setPrice(100+60);
      editedproduct && setPrice(100 + 60);
      if (sheet) {
        setPrice(100 + 60 + 40);
      } else {
        setPrice(100 + 60);
      }
    }
  };

  const [sheet, setSheet] = useState(false);
  const [extra, setExtra] = useState("");
  const handleSheet = () => {
    setSheet((prevSheet) => {
      const l = labelType === "glossy" ? 60 : 0;
      const newSheetState = !prevSheet;
      setExtra(newSheetState ? " + OneSheet totally 48nos" : "");
      setPrice(newSheetState ? price + 40 : 100 + l);

      return newSheetState;
    });
  };

  const handleSelectOption = (e) => {
    setLabelsize(e.target.value);
  };

  //add to the cart
  const handleAddToCart = async () => {
    if (quantity <= 0) {
      return alert("Set quantity atleast 1 ");
    }
    if (persImgContRef.current) {
      try {
        const canvas = await html2canvas(persImgContRef.current);
        const imageData = canvas.toDataURL("image/png"); // Export as a Base64 image

        const now = new Date();
        const formattedDateTime = `${now.getFullYear()}-${String(
          now.getMonth() + 1
        ).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}T${String(
          now.getHours()
        ).padStart(2, "0")}:${String(now.getMinutes()).padStart(
          2,
          "0"
        )}:${String(now.getSeconds()).padStart(2, "0")}`;

        // Ensure price and quantity are being passed correctly
        const productDetails = {
          image: imageData, // Base64 image data
          quantity: quantity, // User-selected quantity
          price: price * quantity, // Calculated price for the given quantity
          Name: product.name, // Product name
          labeltype: labelType, // Example for extra info like label type
          size: `${labelsize}${extra}`, // Size information (if needed)
          labels: [],
          productcode: product.productcode, // Ensure this is initialized
          template: product.template,
          personImage: selectedImage,
          source: product.source,
          waterlabel: selectedLabel,
          datetime: formattedDateTime, // Added custom formatted date-time
        };
        const rgbToHex = (rgb) => {
          const rgbValues = rgb.match(/\d+/g); // Extract numeric values from rgb string
          if (!rgbValues) return "#000000"; // Fallback to black if invalid
          return `#${rgbValues
            .map((value) => parseInt(value, 10).toString(16).padStart(2, "0"))
            .join("")}`.toUpperCase();
        };
        // Define all label classes
        const labelClasses = [
          "studentname-lab12",
          "schoolname-lab12",
          "subjectname-lab12",
          "rollnu-lab12",
          "sectionname-lab12",
          "classname-lab12",
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
            const rect = textRef.current.getBoundingClientRect();
            productDetails.labels.push({
              className: labelClass,
              text: [label.textContent],
              fontSize: `${fontSize}px`,
              scale,
              fontColor,
              fontFamily: styles.fontFamily,
              fontStyle: styles.fontStyle,
              ...(labelClass.startsWith("subject") && {
                position: {
                  x: rect.left + window.scrollX,
                  y: rect.top + window.scrollY,
                },
                subjectCount: label.textContent.trim()
                  ? `${(label.textContent.match(/,/g) || []).length + 1}`
                  : "0",
              }),
            });
          } else {
            console.warn(`Label with class .${labelClass} not found.`);
          }
        });

        // Debugging log
        // Retrieve existing cart from localStorage
        const existingCart =
          JSON.parse(localStorage.getItem("OrderData")) || [];

        // Push the new product to the cart
        existingCart.push(productDetails);

        // Store the updated cart back into localStorage
        localStorage.setItem("OrderData", JSON.stringify(existingCart));

        // Update cart count
        addToCart();
        localStorage.removeItem("editedproduct");

        // const newCartCount = cartCount + 1;
        // setCartCount(newCartCount);
        // localStorage.setItem('CartCount', newCartCount);

        alert("Product added to cart successfully!");
      } catch (error) {
        console.error("Error capturing the div:", error);
      }
    }
    navigate("/Order");
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
  const [loadingimage, setLoadingimage] = useState(false); // Loading state

  const handleImageChange = async (event) => {
    sessionStorage.removeItem("removebg");
    const file = event.target.files[0];
    if (file) {
      setLoadingimage(true)

      const reader = new FileReader();
      const compressedFile = await compressImageIfNeeded(file);
      // When the file is read, update the state with the image's base64 string
      reader.onload = (e) => {
        setSelectedImage(e.target.result);
        setinitialimage(e.target.result)
        sessionStorage.setItem("personImage", e.target.result)
        sessionStorage.setItem("initialimage", e.target.result);
        setLoadingimage(false);
      };

      reader.readAsDataURL(compressedFile); // Read the file as a data URL
    }
  };

  // Handle slider changes
  const handleBrightnessChange = (e) => setBrightness(e.target.value);
  const handleContrastChange = (e) => setContrast(e.target.value);



  const handleInputChange = (e) => {
    const { name, value } = e.target;

    const newFontSize = calculateFontSize(value.length);

    setStudentDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
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

    window
      .html2canvas(element, { useCORS: true, backgroundColor: "#ffffff" }) // Ensure CORS and background color
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

  const handleotherDetails = () => {
    if (document.getElementById("OD").style.display === "block") {
      document.getElementById("OD").style.display = "none";
    } else {
      document.getElementById("OD").style.display = "block";
    }
  };

  const handleCircleBorder = (isChecked) => {
    setCircleImage(isChecked); // Update state based on checkbox
  };

  const handleImageBorder = (isChecked) => {
    setImageBorder(isChecked); // Update state for image border
  };
  const handlecolorchange = (e) => {
    setNameTrans((prev) => ({
      ...prev,
      color: e,
    }));
    setclasstrans((prev) => ({
      ...prev,
      color: e,
    }));
    setsectiontrans((prev) => ({
      ...prev,
      color: e,
    }));

    setsubjecttrans((prev) => ({
      ...prev,
      color: e,
    }));
    setschooltrans((prev) => ({
      ...prev,
      color: e,
    }));
    setrollnotrans((prev) => ({
      ...prev,
      color: e,
    }));
  };

  const [showOptions, setShowOptions] = useState(false);
  // const [expandedGroup, setExpandedGroup] = useState(null);
  const [selectedOption, setSelectedOption] = useState("");
  const dropdownRef = useRef(null);
  const textRef = useRef(null);
  // const [activeGroup, setActiveGroup] = useState(null);
  const subjectsData = {
    KG: [
      "English",
      "English CW",
      "English HW",
      "Hindi",
      "Hindi CW",
      "Hindi HW",
      "Maths",
      "Maths CW",
      "Maths HW",
      "Rhymes",
      "Story",
    ].sort(),

    "I-V std": [
      "Arts",
      "Computer",
      "Computer CW",
      "Drawing Note",
      "English",
      "English CW",
      "English HW",
      "EVS",
      "EVS CW",
      "EVS HW",
      "Hindi",
      "Hindi CW",
      "Hindi HW",
      "Language",
      "Language CW",
      "Language HW",
      "Maths",
      "Maths CW",
      "Maths HW",
      "Rough Note",
      "Science",
      "Science HW",
    ].sort(),

    "VI and above": [
      "Arts",
      "Computer",
      "Computer CW",
      "Drawing Note",
      "English",
      "English CW",
      "English HW",
      "EVS",
      "EVS CW",
      "EVS HW",
      "Graph Note",
      "Hindi",
      "Hindi CW",
      "Hindi HW",
      "Language",
      "Language CW",
      "Language HW",
      "Maths",
      "Maths CW",
      "Maths HW",
      "Rough Note",
      "Science",
      "Science HW",
      "Social",
      "Social CW",
      "Social HW",
    ].sort(),
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCheckboxChange = (group, subject, checked) => {
    setStudentDetails((prev) => {
      let updatedSubjects = [...prev.subject];

      if (checked) {
        if (!updatedSubjects.includes(subject)) {
          updatedSubjects.push(subject);
        }
      } else {
        updatedSubjects = updatedSubjects.filter((item) => item !== subject);
      }

      return {
        ...prev,
        subject: updatedSubjects,
      };
    });
  };
  const [manualSubject, setManualSubject] = useState("");
  const [manualSubjects, setManualSubjects] = useState(JSON.parse(localStorage.getItem("manuallyaddedsubject")) || []);

  const handleManualInputChange = (e) => {
    const value = e.target.value;
    const regex =
      /^[A-Za-z0-9_\-\.!@#$%&*()\s\u0900-\u097F\u0B80-\u0BFF]{0,16}$/;
    // Only set value if valid
    if (regex.test(value) || value === "") {
      setManualSubject(value);
    }
  };
  return (
    <div className="personalizecontainer">
      <div className="pers-img-cont">
        <div ref={persImgContRef}>
          <div className="stickerdiv">
            <img
              src={
                editedproduct && editedproduct.source
                  ? editedproduct.source
                  : product.source
              }
              alt="productImage3"
              className="personalise-Image"
            />
            {loadingimage && (
              <div className="loading-spinner">
                <div className="spinner"></div>
              </div>
            )}
            {selectedImage && !loadingimage &&
              <img
                id="perimg"
                className="personImage12"
                src={selectedImage}
                alt="yours Image"
                style={{
                  border: imageBorder ? "2px solid black" : "none",
                  borderRadius: circleImage ? "100%" : "15%",
                  filter: `brightness(${brightness}%) contrast(${contrast}%)`,

                  transform: `scale(${transformations.scale}) rotate(${transformations.rotate}deg) translate(${transformations.translateX}px, ${transformations.translateY}px) scaleX(${transformations.mirror})`,
                  transition: "transform 0.2s",
                }}
              />
            }
          </div>
          <img
            src={
              editedproduct && editedproduct.waterlabel
                ? editedproduct.waterlabel
                : selectedLabel
            }
            alt="waterlabel"
            className={
              selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.png" ||
                selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.png"
                ? "watermark-special12"
                : "watermark12"
            }
          />
          <label
            className={`studentname-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "namelabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "namelabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "namelabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp"
                    ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "namelabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT02.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "namelabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${nameTrans.fontSize}px`,
              color: nameTrans.color,
              fontFamily: fontFamily,
              transform: `scale(${nameTrans.scale}) rotate(${nameTrans.rotate}deg) translate(${nameTrans.translateX}px, ${nameTrans.translateY}px) scaleX(${nameTrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.name}
          </label>
          <label
            className={`schoolname-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "schoolnamelabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "schoolnamelabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "schoolnamelabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp" ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "schoolnamelabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT02.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "schoolnamelabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${schooltrans.fontSize * schooltrans.scale}px`,
              color: schooltrans.color,
              fontFamily: fontFamily,
              transform: `scale(${schooltrans.scale}) rotate(${schooltrans.rotate}deg) translate(${schooltrans.translateX}px, ${schooltrans.translateY}px) scaleX(${schooltrans.mirror})`,
              transition: "transform 0.2s",
              wordBreak: "break-word", // Ensures long words wrap
              overflowWrap: "break-word",
              maxWidth: "55%", // Adjust as needed
              display: "inline-block",
            }}
          >
            {studentDetails.schoolName}
          </label>
          <label
            ref={textRef}
            className={`subjectname-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "subjectnamelabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "subjectnamelabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "subjectnamelabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp" ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "subjectnamelabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "subjectnamelabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${subjecttrans.fontSize}px`,
              color: subjecttrans.color,
              fontFamily: fontFamily,
              transform: `scale(${subjecttrans.scale}) rotate(${subjecttrans.rotate}deg) translate(${subjecttrans.translateX}px, ${subjecttrans.translateY}px) scaleX(${subjecttrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.subject.join(",")}
          </label>
          <label
            className={`rollnu-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "rollnulabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "rollnulabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "rollnulabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp"
                    ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "rollnulabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT02.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "rollnulabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${rollnotrans.fontSize}px`,
              color: rollnotrans.color,
              fontFamily: fontFamily,
              transform: `scale(${rollnotrans.scale}) rotate(${rollnotrans.rotate}deg) translate(${rollnotrans.translateX}px, ${rollnotrans.translateY}px) scaleX(${rollnotrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.rollNumber}
          </label>
          <label
            className={`sectionname-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "sectionnamelabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "sectionnamelabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "sectionnamelabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp" ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "sectionnamelabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT02.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "sectionnamelabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${sectiontrans.fontSize}px`,
              color: sectiontrans.color,
              fontFamily: fontFamily,
              transform: `scale(${sectiontrans.scale}) rotate(${sectiontrans.rotate}deg) translate(${sectiontrans.translateX}px, ${sectiontrans.translateY}px) scaleX(${sectiontrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.section}
          </label>

          <label
            className={`classname-lab12 ${selectedLabel ===
              "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT01.webp"
              ? "classnamelabel12-style-2"
              : selectedLabel ===
                "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT02.webp"
                ? "classnamelabel12-style-1"
                : selectedLabel ===
                  "/image/Rightpic Nameslips-Blank-Templates-v4-DreamikAI-Type2-Label-Rectangle-HD(1920 x 1080 px)/FERT04.webp"
                  ? "classnamelabel12-style-3"
                  : selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT01.webp" ||
                    selectedLabel ===
                    "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT01.webp" ||
                    selectedLabel === "/image/waterlabel/FELT.png"
                    ? "classnamelabel12-style-4"
                    : selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FTLT02.webp" ||
                      selectedLabel ===
                      "/image/UTF lang leftframe DreamikAIComics-Type2-Label-Rectangle-Image-v1-HD(1920 x 1080 px)/FHLT02.webp"
                      ? "classnamelabel12-style-5"
                      : ""
              }`}
            style={{
              fontSize: `${classtrans.fontSize}px`,
              color: classtrans.color,
              fontFamily: fontFamily,
              transform: `scale(${classtrans.scale}) rotate(${classtrans.rotate}deg) translate(${classtrans.translateX}px, ${classtrans.translateY}px) scaleX(${classtrans.mirror})`,
              transition: "transform 0.2s",
            }}
          >
            {studentDetails.class}
          </label>
        </div>
        {/* Medium - (100mm * 44 mm) 12 labels - 36nos */}{" "}
        <span>
          {labelsize}
          {extra}
        </span>
      </div>
      <div className="controllize-container">
        <div id="imagebar">
          <label htmlFor="select-image" id="sel-img-btn">
            Select Your image
          </label>

          <input
            type="file"
            id="select-image"
            onChange={handleImageChange}
            accept="image/*"
          />

          <button
            onClick={() => toggleCustomizeDiv("customizediv12")}
            style={{ width: "75px " }}
          >
            <img
              src="/image/custamize.png"
              style={{ width: "25px " }}
              alt=""
              className="custamlogo"
            />
          </button>
        </div>
        {activeCustomizeDiv === "customizediv12" && (
          <div
            id="customizediv12"
            ref={(el) => (customizeDivRefs.current["customizediv12"] = el)}
            tabIndex={-1}
          >
            <TransformControls
              onUpdateTransform={(type, value) =>
                updateTransform(type, value, setTransformations)
              }
              div={"customizediv"}
            />
            <div style={{ display: "flex", margin: "4%", marginLeft: "20%" }}>
              <button onClick={toggleMirror}>
                {transformations.mirror === 1 ? "Mirror Image" : "Unmirror Image"}
              </button>


              <Removebg
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
                initialimage={initialimage}
                isremovebg={isremovebg}
                setremovebg={setremovebg}
              />
            </div>
            <div style={{ display: "flex" }}>
              <label
                htmlFor="circleImg"
                style={{
                  marginLeft: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Circle Border
              </label>{" "}
              <input
                type="checkbox"
                id="circleImg"
                checked={circleImage}
                onChange={(e) => handleCircleBorder(e.target.checked)}
              />
              <label
                htmlFor="imageBorder"
                style={{
                  marginLeft: "8px",
                  fontSize: "20px",
                  fontWeight: "bold",
                }}
              >
                Image Border
              </label>
              <input
                type="checkbox"
                id="imageBorder"
                checked={imageBorder}
                onChange={(e) => handleImageBorder(e.target.checked)}
              />
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
                <button onClick={handleDeleteImage} className="delete-btn">
                  delete
                </button>
              </div>
            </div>
          </div>
        )}

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
            <button onClick={() => toggleCustomizeDiv("namecustomizediv12")}>
              <img
                src="/image/custamize.png"
                width={"25px"}
                alt=""
                className="custamlogo"
              />
            </button>
            {activeCustomizeDiv === "namecustomizediv12" && (
              <div
                id="namecustomizediv12"
                ref={(el) =>
                  (customizeDivRefs.current["namecustomizediv12"] = el)
                }
                tabIndex={-1}
              >
                <TransformControls
                  onUpdateTransform={(type, value) =>
                    type === "color"
                      ? setNameTrans((prev) => ({ ...prev, [type]: value }))
                      : setNameTrans((prev) => ({
                        ...prev,
                        [type]: prev[type] + value,
                      }))
                  }
                  fontSize={nameTrans.fontSize * nameTrans.scale}
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
            <button
              onClick={() => toggleCustomizeDiv("schoolnamecustomizediv12")}
            >
              {" "}
              <img
                src="/image/custamize.png"
                alt=""
                width={"25px"}
                className="custamlogo"
              />
            </button>
            {activeCustomizeDiv === "schoolnamecustomizediv12" && (
              <div
                id="schoolnamecustomizediv11"
                ref={(el) =>
                  (customizeDivRefs.current["schoolnamecustomizediv11"] = el)
                }
                tabIndex={-1}
              >
                <TransformControls
                  onUpdateTransform={(type, value) =>
                    type === "color"
                      ? setschooltrans((prev) => ({ ...prev, [type]: value }))
                      : setschooltrans((prev) => ({
                        ...prev,
                        [type]: prev[type] + value,
                      }))
                  }
                  fontSize={schooltrans.fontSize * schooltrans.scale}
                />
              </div>
            )}
          </div>

          <br />
          <button id="otherdetails" onClick={handleotherDetails}>
            Other Details <br />
            (class,section or rollno edit)
          </button>
          <div id="OD">
            <div className="img-cus">
              <input
                type="text"
                name="class"
                placeholder="Class"
                value={studentDetails.class}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("classcustomizediv12")}>
                {" "}
                <img
                  src="/image/custamize.png"
                  width={"25px"}
                  alt=""
                  className="custamlogo"
                />
              </button>
              {activeCustomizeDiv === "classcustomizediv12" && (
                <div
                  id="classcustomizediv12"
                  ref={(el) =>
                    (customizeDivRefs.current["classcustomizediv12"] = el)
                  }
                  tabIndex={-1}
                >
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      type === "color"
                        ? setclasstrans((prev) => ({ ...prev, [type]: value }))
                        : setclasstrans((prev) => ({
                          ...prev,
                          [type]: prev[type] + value,
                        }))
                    }
                    fontSize={classtrans.fontSize * classtrans.scale}
                  />
                </div>
              )}
            </div>
            <div className="img-cus">
              <input
                type="text"
                name="section"
                placeholder="Section"
                value={studentDetails.section}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button
                onClick={() => toggleCustomizeDiv("sectioncustomizediv12")}
              >
                {" "}
                <img
                  src="/image/custamize.png"
                  width={"25px"}
                  alt=""
                  className="custamlogo"
                />
              </button>
              {activeCustomizeDiv === "sectioncustomizediv12" && (
                <div
                  id="sectioncustomizediv12"
                  ref={(el) =>
                    (customizeDivRefs.current["sectioncustomizediv12"] = el)
                  }
                  tabIndex={-1}
                >
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      type === "color"
                        ? setsectiontrans((prev) => ({
                          ...prev,
                          [type]: value,
                        }))
                        : setsectiontrans((prev) => ({
                          ...prev,
                          [type]: prev[type] + value,
                        }))
                    }
                    fontSize={sectiontrans.fontSize * sectiontrans.scale}
                  />
                </div>
              )}
            </div>
            <div className="img-cus">
              <input
                type="text"
                name="rollNumber"
                placeholder={`${selectedLabel === "/image/waterlabel/4.png"
                  ? "Contact Number"
                  : "Roll number"
                  } `}
                value={studentDetails.rollNumber}
                onInput={handleInputChange}
                className="studentDetails"
              />
              <button onClick={() => toggleCustomizeDiv("rollcustomizediv12")}>
                {" "}
                <img
                  src="/image/custamize.png"
                  width={"25px"}
                  alt=""
                  className="custamlogo"
                />
              </button>
              {activeCustomizeDiv === "rollcustomizediv12" && (
                <div
                  id="rollcustomizediv12"
                  ref={(el) =>
                    (customizeDivRefs.current["rollcustomizediv12"] = el)
                  }
                  tabIndex={-1}
                >
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      type === "color"
                        ? setrollnotrans((prev) => ({ ...prev, [type]: value }))
                        : setrollnotrans((prev) => ({
                          ...prev,
                          [type]: prev[type] + value,
                        }))
                    }
                    fontSize={rollnotrans.fontSize * rollnotrans.scale}
                  />
                </div>
              )}
            </div>
            <div className="img-cus" style={{ position: "relative" }}>
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={selectedOption || studentDetails.subject}
                onFocus={() => setShowOptions(true)}
                // onInput={handleInputChange}
                readOnly
                className="studentDetails"
              />
              {showOptions && (
                <div className="custom-dropdown" ref={dropdownRef}>
                  {/* Existing Subjects */}
                  {Object.keys(subjectsData).map((group) => (
                    <div className="option-group" key={group}>
                      <div className="main-option">{group} ▸</div>
                      <div className="sub-options">
                        {subjectsData[group].map((subject, idx) => (
                          <div key={idx} className="sub-option-item">
                            <label className="subjectnames">
                              <input
                                type="checkbox"
                                checked={studentDetails.subject.includes(
                                  subject
                                )}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "Custom",
                                    subject,
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !studentDetails.subject.includes(subject) &&
                                  studentDetails.subject.length > 29
                                }
                              />
                              <span>{subject}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {/* Custom Added Subject Group */}
                  <div className="option-group">
                    <div className="main-option">Custom Added Subjects ▸</div>
                    <div className="sub-options">
                      {manualSubjects.length > 0 ? (
                        manualSubjects.map((subject, idx) => (
                          <div key={idx} className="sub-option-item">
                            <label className="subjectnames">
                              <input
                                type="checkbox"
                                checked={studentDetails.subject.includes(
                                  subject
                                )}
                                onChange={(e) =>
                                  handleCheckboxChange(
                                    "Custom",
                                    subject,
                                    e.target.checked
                                  )
                                }
                                disabled={
                                  !studentDetails.subject.includes(subject) &&
                                  studentDetails.subject.length > 29
                                }
                              />
                              <span>{subject}</span>
                            </label>
                          </div>
                        ))
                      ) : (
                        <div style={{ padding: "5px", fontStyle: "italic" }}>
                          No custom subjects yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Manual Add Section */}
                  <div style={{ marginTop: "10px" }}>
                    <input
                      type="text"
                      placeholder="Add custom subject"
                      value={manualSubject}
                      onChange={handleManualInputChange}
                      maxLength={16}
                      style={{ width: "70%", marginRight: "5px" }}
                      disabled={studentDetails.subject.length > 29}
                    />
                    <button
                      onClick={() => {
                        if (
                          manualSubject &&
                          !manualSubjects.includes(manualSubject)
                        ) {
                          setManualSubjects((prev) => [...prev, manualSubject]);
                          setStudentDetails((prev) => ({
                            ...prev,
                            subject: [...prev.subject, manualSubject],
                          }));
                          const existedsubjects = JSON.parse(localStorage.getItem("manuallyaddedsubject")) || []
                          localStorage.setItem("manuallyaddedsubject", JSON.stringify([manualSubject]));

                          if (existedsubjects.length > 0) {
                            const manuallyadded = [...existedsubjects, manualSubject]

                            localStorage.setItem("manuallyaddedsubject", JSON.stringify(manuallyadded));
                          }
                          setManualSubject("");
                        }
                      }}
                      disabled={!manualSubject}
                    >
                      Add
                    </button>
                  </div>
                </div>
              )}
              <button /*onClick={() => toggleCustomizeDiv("subjectcustomizediv3")}*/
              >
                {" "}
                <img
                  src="/image/custamize.png"
                  alt=""
                  className="custamlogo"
                  width={"25px"}
                />
              </button>
              {activeCustomizeDiv === "subjectcustomizediv3" && (
                <div id="subjectcustomizediv3">
                  <TransformControls
                    onUpdateTransform={(type, value) =>
                      setsubjecttrans((prev) => ({
                        ...prev,
                        [type]: prev[type] + value,
                      }))
                    }
                  />
                </div>
              )}
            </div>
            count: {
              studentDetails?.subject?.filter(sub => sub.trim() !== '').length
            }
            <button onClick={() => setStudentDetails(prev => ({
              ...prev,
              subject: []
            }))}>clear all subjects</button>
            <br />
            You need to pay extra ₹ 30 for adding subjects
            <p style={{ color: "red", fontSize: "12px", marginTop: "5px" }}>
              {studentDetails.subject.length > 29
                ? "⚠ You can only select up to 30 subjects!"
                : studentDetails.subject.length < 1
                  ? "⚠ You can only select up to 30 subjects!"
                  : ""}
            </p>
          </div>
          <div id="fontcenter">
            {/* Customize Font Family */}
            <div id="font-family">
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
            <div>
              <h4
                style={{ margin: "8px", fontSize: "16px", fontWeight: "bold" }}
              >
                Pick color for all text:
              </h4>

              <input
                type="color"
                title="Change Font Color"
                onChange={(e) => handlecolorchange(e.target.value)}
                style={{
                  width: "20%",
                  height: "40px",
                  border: "none",
                  outline: "none",
                  cursor: "pointer",
                  padding: "5px",
                  background: "transparent",
                }}
              />
            </div>
            <div id="type">
              <h3>Type</h3>
              <br />
              <button id="normal" ref={normalRef} onClick={normal}>
                <h4>Matte</h4>
              </button>
              <button id="glossy" ref={glossyRef} onClick={glossy}>
                <h4>Glossy</h4>
              </button>
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
              {sheet ? (
                <button id="removeextrasheet" onClick={handleSheet}>
                  Remove extra sheet
                </button>
              ) : (
                <button id="addextrasheet" onClick={handleSheet}>
                  Add extra sheet
                </button>
              )}
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
            <label id="price" className="price-label" title={`₹${price} x ${quantity} = ₹${price * quantity}`}>
              Price: {price === 0 ? ("Free") : (<span className="price-value">
                ₹{(price * quantity).toLocaleString('en-IN')}
              </span>)}
            </label>          <br />
            <button id="add" onClick={handleAddToCart}>
              <i className="fa-solid fa-cart-plus"></i> Add to cart
            </button>
            <br />
            <button id="whatsapp" onClick={sendToWhatsApp}>
              <i className="fa-brands fa-whatsapp" id="whatsapp-icon"></i> For
              More Than One Image Contact Us in WhatsApp
            </button>
            <br />
            <button onClick={handleDownload} id="down">
              Download Image
            </button>{" "}
            <br />
          </div>
          <button
            id="goback"
            onClick={() => navigate(-1)}
            style={{ marginBottom: "20px" }}
          >
            <i className="fa-solid fa-arrow-left"></i> Go Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default NSPersonalize;