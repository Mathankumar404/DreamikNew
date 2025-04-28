import React, { useState, useContext, useEffect } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import './bulkorder_style.css';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../CartContext';
import * as XLSX from "xlsx";
import { Helmet, HelmetProvider } from 'react-helmet-async';
const BulkOrder = () => {
  const [backgroundImgDataUrl, setBackgroundImgDataUrl] = useState('');
  const [imageFiles, setImageFiles] = useState([]);
  const [textFile, setTextFile] = useState(null);
  const [totalPrice, setTotalPrice] = useState(0);
  const pricePerLabel = 50; // Price per label
  const [quantity, setQuantity] = useState(0);
  const { addToCart, cartCount } = useContext(CartContext);
  const navigate = useNavigate();
  const [selectedBg, setSelectedBg] = useState(null);

  const pricePerItem = 50;
  const [fileData, setFileData] = useState({});
  // Predefined background images
  const predefinedBackgrounds = [
    '/image/bkop1.jpg',
    '/image/Diecut-cutout-v3c-DreamikAIComics-Type2-Label-Image-v1-HD-1(1920 x 1080 px).png',
    '/image/DreamikAILabel-Rectangle-1080x1920px-HD-WhiteBK-FlowerTheme-Type2-ImageLeft.png',

  ];

  // Handle predefined background image selection
  const handlePredefinedBgImageChange = (url) => {
    setBackgroundImgDataUrl(url);
    setSelectedBg(url)
  };





  // Handle custom background image file selection
  const handleCustomBgImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImgDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };


  // Handle background image file selection
  // const handleBgImageChange = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       setBackgroundImgDataUrl(e.target.result);
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // Handle text file (txt/json/csv) file selection
  const handleTextFileChange = (e) => {
    setTextFile(e.target.files[0]);
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      const fileExtension = file.name.split(".").pop().toLowerCase();

      reader.onload = (event) => {
        let jsonData = [];

        if (fileExtension === "csv") {
          // Handling CSV files
          const csvData = event.target.result;
          const workbook = XLSX.read(csvData, { type: "string" });
          const sheet = workbook.Sheets[workbook.SheetNames[0]];
          jsonData = XLSX.utils.sheet_to_json(sheet, { header: 1 });

          // Convert array of arrays to array of objects
          const headers = jsonData[0];
          jsonData = jsonData.slice(1).map((row) =>
            row.reduce((obj, value, index) => {
              obj[headers[index]] = value;
              return obj;
            }, {})
          );
        } else {
          // Handling Excel files (.xlsx, .xls)
          const data = new Uint8Array(event.target.result);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          jsonData = XLSX.utils.sheet_to_json(worksheet);
        }

        setFileData(jsonData);

      };
      if (fileExtension === "csv") {
        reader.readAsText(file); // For CSV
      } else {
        reader.readAsArrayBuffer(file); // For Excel
      }
    }
  };

  // Handle image folder (multiple images) selection
  const handleImageFolderChange = (event) => {
    const im = Array.from(event.target.files)

    setImageFiles(im);


  };

  // Generate labels based on the text and image files
  const generateLabels = () => {
    if (textFile && imageFiles.length > 0) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target.result;
        let data;

        if (textFile.name.endsWith('.json')) {
          try {
            data = JSON.parse(content);
          } catch (err) {
            alert('Invalid JSON file format.');
            return;
          }
        } else {
          data = parseTxtFile(content);
        }

        if (!Array.isArray(data)) {
          alert('Invalid file format. Please provide an array of objects.');
          return;
        }

        const canvasContainer = document.getElementById('canvasContainer');
        canvasContainer.innerHTML = ''; // Clear previous canvases

        imageFiles.forEach((imageFile, index) => {
          const canvas = document.createElement('canvas');
          canvas.width = 450;
          canvas.height = 300;

          const ctx = canvas.getContext('2d');
          const textData = data[index % data.length];

          drawLabel(ctx, textData, imageFile, canvas.width, canvas.height).then(() => {
            canvasContainer.appendChild(canvas);

            // Update price dynamically based on the number of labels
            const totalImages = canvasContainer.childElementCount;
            setQuantity(totalImages);
            setTotalPrice(totalImages * pricePerLabel);

            if (index === imageFiles.length - 1) {
              document.getElementById('downloadAllButton').style.display = 'block';
              document.getElementById('bulk-price').style.display = 'block';
              document.getElementById('add').style.display = 'block';
            }
          });
        });
      };
      reader.readAsText(textFile);
    } else {
      alert('Please upload both text file and image folder.');
    }
  };

  // Parse a CSV/TXT file into an array of data objects
  const parseTxtFile = (content) => {
    const lines = content.split('\n').filter((line) => line.trim() !== '');
    const data = [];
    const headers = lines[1].split(',').map((val) => val.trim());

    for (let i = 2; i < lines.length; i++) {
      const values = lines[i].split(',').map((val) => val.trim().replace(/"/g, ''));
      if (values.length < 6) continue;

      data.push({
        imgname: values[0],
        name: values[1],
        className: values[2],
        section: values[3],
        rollNumber: values[4],
        school: values[5],
      });
    }
    return data;
  };

  // Draw the label on the canvas
  const drawLabel = (ctx, data, imageFile, canvasWidth, canvasHeight) => {
    return new Promise((resolve) => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      const { name, className, section, rollNumber, school } = data;

      const backgroundImg = new Image();
      backgroundImg.onload = function () {
        ctx.drawImage(backgroundImg, 0, 0, canvasWidth, canvasHeight);

        const image = new Image();
        image.onload = function () {
          ctx.save();
          ctx.beginPath();

          const centerX = canvasWidth * 0.17;
          const centerY = canvasHeight * 0.375;
          const radiusX = canvasWidth * 0.125;
          const radiusY = canvasHeight * 0.1875;

          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.closePath();
          ctx.clip();

          ctx.drawImage(image, canvasWidth * 0.03, canvasHeight * 0.1875, canvasWidth * 0.25, canvasHeight * 0.375);
          ctx.restore();

          ctx.fillStyle = '#000';
          ctx.font = `bold ${canvasWidth * 0.042 * 1.2}px sans-serif`;
          ctx.fillText(`${name}`, canvasWidth * 0.34, canvasHeight * 0.1475);
          ctx.font = `${canvasWidth * 0.036}px Arial`;
          ctx.fillText(`${className}`, canvasWidth * 0.425, canvasHeight * 0.2725);
          ctx.fillText(`${section}`, canvasWidth * 0.69, canvasHeight * 0.2725);
          ctx.fillText(`${rollNumber}`, canvasWidth * 0.9, canvasHeight * 0.2725);
          ctx.font = `${canvasWidth * 0.032}px Arial`;
          ctx.fillText(`${school}`, canvasWidth * 0.44, canvasHeight * 0.5625);

          resolve();
        };

        const reader = new FileReader();
        reader.onload = function (e) {
          image.src = e.target.result;
        };
        reader.readAsDataURL(imageFile);
      };
      backgroundImg.src = backgroundImgDataUrl;
    });
  };

  // Download all generated labels as a ZIP file
  const downloadAllLabels = () => {
    const zip = new JSZip();
    const canvasElements = document.querySelectorAll('#canvasContainer canvas');

    if (canvasElements.length === 0) {
      alert('No labels to download.');
      return;
    }

    canvasElements.forEach((canvas, index) => {
      const dataUrl = canvas.toDataURL();
      const imgData = dataUrl.replace(/^data:image\/(png|jpg);base64,/, '');
      zip.file(`label_${index + 1}.png`, imgData, { base64: true });
    });

    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'labels.zip');
    });
  };

  // Save the generated labels and zip file to localStorage
  const saveToLocalStorage = async () => {
    try {

      const zipCanvas = document.createElement('canvas');
      const canvases = document.querySelectorAll('#canvasContainer canvas');

      // Define the dimensions for a 3x3 grid
      const gridRows = 3;
      const gridColumns = 3;
      const canvasWidth = 150;  // Width of each individual canvas in the grid
      const canvasHeight = 150; // Height of each individual canvas in the grid

      // Set the dimensions of the final zipCanvas (3x3 grid)
      zipCanvas.width = canvasWidth * gridColumns;
      zipCanvas.height = canvasHeight * gridRows;

      const ctx = zipCanvas.getContext('2d');

      // Loop through all canvases and draw them onto the final canvas (3x3 grid)
      canvases.forEach((canvas, index) => {
        const row = Math.floor(index / gridColumns); // Determine the row
        const col = index % gridColumns; // Determine the column

        // Draw each canvas onto the zipCanvas at the correct position
        ctx.drawImage(canvas, col * canvasWidth, row * canvasHeight, canvasWidth, canvasHeight);
      });

      // Convert the final canvas to a Data URL with lower quality (to reduce size)
      const cascadingImage = zipCanvas.toDataURL('image/png', 0.6); // Adjust quality as needed

      // Save data to localStorage
      const bulkOrderData = {
        image: cascadingImage,
        price: totalPrice,
        quantity: quantity,
        type: "Bulk orders",
        timestamp: new Date().toISOString(),
      };
      const existingCart = JSON.parse(localStorage.getItem("OrderData")) || [];
      const FullorderData = [...existingCart, bulkOrderData]
      localStorage.setItem('OrderData', JSON.stringify(FullorderData));

      const zip = new JSZip();
      const canvasElements = document.querySelectorAll('#canvasContainer canvas');

      if (canvasElements.length === 0) {
        alert('No labels to add.');
        return;
      }

      // Add each canvas image to the ZIP file
      canvasElements.forEach((canvas, index) => {
        const dataUrl = canvas.toDataURL();
        const imgData = dataUrl.replace(/^data:image\/(png|jpg);base64,/, ''); // Remove the Data URL prefix
        zip.file(`label_${index + 1}.png`, imgData, { base64: true });
      });

      // Generate the ZIP file as a Blob
      zip.generateAsync({ type: 'blob' }).then((zipBlob) => {
        // Convert the Blob to a Base64 string
        const reader = new FileReader();

        reader.onloadend = function () {
          const base64String = reader.result; // This is the Base64 representation of the ZIP file
          storeZipFile(base64String); // Store the Base64 string in localStorage
        };

        reader.readAsDataURL(zipBlob); // This will convert the Blob to a Base64 string
      });
      function storeZipFile(base64String) {
        try {
          // Store the Base64 string in localStorage
          localStorage.setItem("zipFileData", base64String);
          alert('ZIP file stored successfully!');
          addToCart()
          navigate('/order')

        } catch (error) {
          console.error('Error storing ZIP file:', error);
          alert('Failed to store ZIP file.');
        }
      }

    } catch (error) {
      console.error('Error saving to localStorage:', error.message);
      alert('Failed to add to cart. Please try again.');
    }


    const cartItems = JSON.parse(localStorage.getItem("excelfile")) || [];

    const newCartItem = {

      items: fileData,

    };

    cartItems.push(newCartItem);
    localStorage.setItem("excelfile", JSON.stringify(cartItems));

    alert("Items added to cart successfully!");



  };
  const handleDownloadcsv = () => {
    fetch('/Book1.csv') // Path relative to the public folder
      .then((response) => response.text())
      .then((csvText) => {
        const bom = '\uFEFF'; // Byte Order Mark for UTF-8
        const blob = new Blob([bom + csvText], { type: 'text/csv;charset=utf-8;' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'Book1.csv'; // Name of the downloaded file
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      })
      .catch((error) => console.error('Error downloading CSV:', error));
  };
  const handleBgImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackgroundImgDataUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <HelmetProvider>
    <div className="--bulkorder">
      <Helmet>
        <title>Bulk Order Online - Wholesale Discounts & Custom Orders | DreamikAI</title>
        <meta name="description" content="Place bulk orders with DreamikAI for wholesale prices and exclusive discounts. Perfect for businesses, events, and large-scale orders. Get a custom quote today!" />
        <meta name="keywords" content="bulk order online, wholesale ordering, large quantity purchases, custom bulk orders, corporate bulk buying, DreamikAI bulk order, wholesale deals, bulk printing services" />
      </Helmet>
      <h1>Kids Label Generator</h1>
      <div id="uploadSection">

        <a href='https://www.canva.com/design/DAGeoUxiChc/ugFZISiuEcJKMrzHEMF5YQ/edit?utm_content=DAGeoUxiChc&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton'
          className='canvaedit'
        >
          <i className="fa-solid fa-palette"></i>Click to design Your Background image in canva
        </a>
        <label>Choose a Background Image:</label>
        <div>
          {predefinedBackgrounds.map((url, index) => (
            <img
              key={index}
              src={url}
              alt={`Background ${index + 1}`}
              // style={{ width: '100px', height: '70px', margin: '5px', cursor: 'pointer',border:"2px solid black" }}


              className={`bg-option ${selectedBg === url ? 'selected-bg' : ''}`} // Apply selected class conditionally
              onClick={() => handlePredefinedBgImageChange(url)}
            />
          ))}
        </div>

        <label htmlFor="bgImage">Or Upload Custom Background Image:</label>

        <input type="file" id="bgImage" accept="image/*" onChange={handleCustomBgImageChange} />

        <br />
        <label htmlFor="textFile">Upload TXT/JSON File:</label>
        <input type="file" id="textFile" accept=".txt,.json,.csv" onChange={handleTextFileChange} />
        <a href='#'
          onClick={handleDownloadcsv}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
        >
          Download Sample file format
        </a>
        <br />

        <label htmlFor="imageFolder">Upload Kid's Image Folder:</label>
        <input type="file" id="imageFolder" accept="image/*" webkitdirectory="true" onChange={handleImageFolderChange} />
        <br />
        <label style={{ color: "red" }}>please upload all Images in one folder and atleast 10 images</label><br />
        <button onClick={generateLabels}>Generate Labels</button>
      </div>

      <div id="canvasContainer"></div>
      <h2 id='bulk-price'>Total Price: ₹{totalPrice}</h2>
      <button id="downloadAllButton" style={{ display: 'none', marginLeft: "44%" }} onClick={downloadAllLabels}>
        Download All Labels
      </button>
      <button id='add' style={{ width: "30%", display: 'none', marginLeft: "40%", marginTop: "3%" }} onClick={saveToLocalStorage}>
        Add to Cart
      </button>
    </div>
    </HelmetProvider>
  );
};

export default BulkOrder;