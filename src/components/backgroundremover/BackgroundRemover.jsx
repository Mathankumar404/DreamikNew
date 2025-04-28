import React, { useState, useRef, useEffect, useCallback } from "react";
import { removeBackground } from "@imgly/background-removal";
import * as bodyPix from "@tensorflow-models/body-pix";
import "@tensorflow/tfjs";
import { getCroppedImg } from "./CropUtils";
import "./crop.css";
import ReactCrop from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { useDropzone } from "react-dropzone";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { PlusCircle } from "lucide-react";

const BackgroundRemover = () => {
  // State management
  const [allImages, setAllImages] = useState([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isFileSelected, setIsFileSelected] = useState(false);
  const [loading, setLoading] = useState(false);
  const [method, setMethod] = useState("ML");
  // const [showGrid, setShowGrid] = useState(true);
  const [lastCropPosition, setLastCropPosition] = useState(null);
  const [isCropToolVisible, setIsCropToolVisible] = useState(false);
  const [crop, setCrop] = useState({
    x: 10,
    y: 10,
    width: 50,
    height: 50,
    unit: "%",
  });
  const [cropShape, setCropShape] = useState("square");
  const [showCropSelection, setShowCropSelection] = useState(false);
  // Refs
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
  const imgRef = useRef(null);
  const allImagesRef = useRef(allImages);

  // Initialize dropzone
  const onDrop = useCallback((acceptedFiles) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      handleImageFile(file);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    maxFiles: 1,
    noClick: true,
  });

  // Handle image file
  const handleImageFile = (file) => {
    if (!file) return;

    // Check if file is an image
    if (!file.type.match("image.*")) {
      alert("Please select an image file");
      return;
    }

    const imageUrl = URL.createObjectURL(file);
    const img = new Image();
    img.src = imageUrl;

    img.onload = () => {
      const newImage = {
        id: Date.now(),
        original: imageUrl,
        processed: null,
        cropped: null,
        size: { width: img.width, height: img.height },
        showOriginal: true,
        file: file,
      };

      setAllImages((prev) => {
        const newImages = [...prev, newImage];
        setCurrentImageIndex(newImages.length - 1); // Set to new image index
        return newImages;
      });
      setIsFileSelected(true);
    };
  };

  // Handle file input change
  const handleNewImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      handleImageFile(file);
    }
  };

  // Handle URL upload
  const handleURLUpload = async () => {
    const url = prompt("Enter image URL:");
    if (!url) return;

    // Basic URL validation
    if (!url.match(/\.(jpeg|jpg|png|webp)$/i)) {
      alert("Please enter a valid image URL (JPEG, JPG, PNG, WEBP)");
      return;
    }

    try {
      const response = await fetch(url, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
      handleImageFile(file);
    } catch (error) {
      alert(
        "Failed to load image. Ensure it's a direct image URL and CORS is enabled."
      );
      console.error("URL upload error:", error);
    }
  };

  const updateImageInArray = (id, updates) => {
    setAllImages((prev) =>
      prev.map((img) => (img.id === id ? { ...img, ...updates } : img))
    );
  };

  // Handle image selection from thumbnails
  const handleImageSelect = (index) => {
    setCurrentImageIndex(index);
  };

  // Image processing
  const processCurrentImage = async () => {
    const currentImage = allImages[currentImageIndex];
    if (!currentImage) return;

    setLoading(true);
    try {
      let processedUrl;
      if (method === "tensorflow") {
        processedUrl = await processWithTensorFlow(currentImage.original);
      } else {
        processedUrl = await processWithImgly(currentImage.original);
      }

      updateImageInArray(currentImage.id, {
        processed: processedUrl,
        showOriginal: false,
      });
    } catch (error) {
      console.error("Error processing image:", error);
    }
    setLoading(false);
  };

  const processWithTensorFlow = async (imageSrc) => {
    try {
      const net = await bodyPix.load();
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageSrc;
      await new Promise((resolve) => (img.onload = resolve));

      const canvas = canvasRef.current;
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      const segmentation = await net.segmentPerson(img, {
        internalResolution: "medium",
        segmentationThreshold: 0.6,
      });

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;
      for (let i = 0; i < data.length; i += 4) {
        if (segmentation.data[i / 4] === 0) data[i + 3] = 0;
      }
      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL("image/png");
    } catch (error) {
      console.error("Error processing with TensorFlow:", error);
      throw error;
    }
  };

  const processWithImgly = async (imageSrc) => {
    try {
      const response = await fetch(imageSrc, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");

      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });

      const result = await removeBackground(file);
      if (!result || !(result instanceof Blob))
        throw new Error("Invalid Imgly result");

      return URL.createObjectURL(result);
    } catch (error) {
      console.error("Error processing with Imgly:", error);
      throw error;
    }
  };

  // Cropping functionality
  const onCropComplete = async (_, croppedAreaPixels) => {
    const currentImage = allImages[currentImageIndex];
    if (!currentImage) return;

    const cropped = await getCroppedImg(
      imgRef.current,
      croppedAreaPixels,
      croppedAreaPixels.width,
      croppedAreaPixels.height
    );

    updateImageInArray(currentImage.id, { cropped });
  };

  const cropImage = async () => {
    if (!imgRef.current || !crop) return;

    const currentImage = allImages[currentImageIndex];
    if (!currentImage) return;
    setLastCropPosition(crop);

    const image = imgRef.current;
    const canvas = document.createElement("canvas");
    const scaleX = image.naturalWidth / image.width;
    const scaleY = image.naturalHeight / image.height;
    const ctx = canvas.getContext("2d");

    canvas.width = crop.width * scaleX;
    canvas.height = crop.height * scaleY;

    ctx.drawImage(
      image,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width * scaleX,
      crop.height * scaleY
    );

    const croppedDataUrl = canvas.toDataURL("image/png");
    updateImageInArray(currentImage.id, { cropped: croppedDataUrl });
    setShowCropSelection(true);
    setShowGrid(true);
    setIsCropToolVisible(true);
    setCrop(crop);
  };
  const resetCropSelection = () => {
    setShowCropSelection(false);
    setCrop({
      x: 10,
      y: 10,
      width: 50,
      height: 50,
      unit: "%",
    });
  };
  // Download handlers
  const downloadProcessedImage = () => {
    const currentImage = allImages[currentImageIndex];
    const imageToDownload = currentImage?.processed;
    if (!imageToDownload) return;

    const link = document.createElement("a");
    link.href = imageToDownload;
    link.download = "processed-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadCroppedImage = () => {
    const currentImage = allImages[currentImageIndex];
    const imageToDownload = currentImage?.cropped;
    if (!imageToDownload) return;

    const link = document.createElement("a");
    link.href = imageToDownload;
    link.download = "cropped-image.png";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle between original and processed view
  const toggleOriginalView = () => {
    const currentImage = allImages[currentImageIndex];
    if (!currentImage) return;

    const newShowOriginal = !currentImage.showOriginal;
    updateImageInArray(currentImage.id, { showOriginal: newShowOriginal });
  };
  useEffect(() => {
    allImagesRef.current = allImages;
  }, [allImages]);
  // Cleanup
  useEffect(() => {
    return () => {
      allImagesRef.current.forEach((image) => {
        URL.revokeObjectURL(image.original);
        if (image.processed) URL.revokeObjectURL(image.processed);
        if (image.cropped) URL.revokeObjectURL(image.cropped);
      });
    };
  }, []);

  // Get current image data
  const currentImage = allImages[currentImageIndex] || {};
  const displayImage = currentImage.showOriginal
    ? currentImage.original
    : currentImage.processed || currentImage.original;

  return (
    <HelmetProvider>
      <div className="container">
        <Helmet>
          <title>
            Free Background Remover - Kickout Background Online | DreamikAI
          </title>
          <meta
            name="description"
            content="Remove image backgrounds instantly with DreamikAI's Kickout Background tool. 100% free, automatic, and easy to use. Get transparent backgrounds in seconds!"
          />
          <meta
            name="keywords"
            content="free background remover, remove image background online, AI background remover, transparent background maker, photo background eraser, automatic background removal"
          />
        </Helmet>
        <h2 className="Bgtitle">Kick out Background (Free)</h2>

        {/* File upload area */}
        {!isFileSelected && (
          <div
            {...getRootProps()}
            className={`dropzone ${isDragActive ? "active" : ""}`}
          >
            <input {...getInputProps()} />
            <button
              className="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Your Image
            </button>
            <div className="button-group">
              <p>Drag & drop an Image here,</p>
              <br />
              <a
                href="#"
                className="button21"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleURLUpload();
                }}
              >
                Paste image or URL
              </a>
            </div>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleNewImageUpload}
              style={{ display: "none" }}
            />
            {isDragActive && (
              <div className="dropzone-overlay">
                <p>Drop your image here</p>
              </div>
            )}
          </div>
        )}

        <div className="leo">
          <div className="Bgremover">
            {/* Process buttons */}
            {isFileSelected && !currentImage.processed && (
              <div className="mt-4">
                <div className="button-group">
                  <button
                    className={`button11 ${method === "ML" ? "active" : ""}`}
                    onClick={() => setMethod("ML")}
                  >
                    Activate Machine Learning
                  </button>
                  <button
                    className={`button11 ${method === "AI" ? "active" : ""}`}
                    onClick={() => setMethod("AI")}
                  >
                    Activate Neural Network
                  </button>
                </div>
                <button
                  onClick={processCurrentImage}
                  className="button process-button"
                  disabled={loading}
                >
                  {loading ? "Processing..." : `Remove Background (${method})`}
                </button>
                <br />
                {loading && "Response may take a moment please wait..."}
                <h2 className="text-lg font-bold">
                  {currentImage.showOriginal
                    ? "Original Image"
                    : "Processed Image"}
                </h2>
              </div>
            )}

            {/* Image gallery */}
            <div className="image-gallery-container">
              {/* Main image display */}
              <div className="main-image-display">
                {isFileSelected && displayImage && (
                  <img
                    src={displayImage}
                    alt={`Image ${currentImageIndex + 1}`}
                    className="main-image"
                    style={{
                      width:
                        currentImage.size?.width > 400
                          ? `${currentImage.size.width * 0.6}px`
                          : `${currentImage.size?.width}px`,
                      height:
                        currentImage.size?.height > 400
                          ? `${currentImage.size.height * 0.6}px`
                          : `${currentImage.size?.height}px`,
                    }}
                  />
                )}
              </div>

              {/* Thumbnail strip */}
              {isFileSelected && (
                <div className="thumbnail-strip">
                  {allImages.map((image, index) => (
                    <div
                      key={image.id}
                      className={`thumbnail ${
                        index === currentImageIndex ? "active" : ""
                      }`}
                      onClick={() => handleImageSelect(index)}
                    >
                      <img
                        src={image.cropped || image.processed || image.original}
                        alt={`Thumbnail ${index + 1}`}
                      />
                      {index === currentImageIndex && (
                        <div className="active-indicator" />
                      )}
                    </div>
                  ))}
                  <label className="add-image-thumbnail">
                    <PlusCircle size={40} />
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleNewImageUpload}
                      style={{ display: "none" }}
                    />
                  </label>
                </div>
              )}
            </div>

            {/* Processed image actions */}
            {currentImage.processed && (
              <div className="processed-container">
                <button
                  onClick={downloadProcessedImage}
                  className="button download-button"
                >
                  Download
                </button>
                <button
                  className="mt-2 px-4 py-2 bg-gray-500 text-white rounded-md"
                  onClick={toggleOriginalView}
                >
                  {currentImage.showOriginal ? "BG Removed" : "Original"}
                </button>
              </div>
            )}
          </div>

          <canvas
            ref={canvasRef}
            className="hidden-canvas"
            style={{ display: "none" }}
          />

          {/* Crop tool section */}
          <div className="crop-tool-container">
            {currentImage.processed && (
              <>
                <div>
                  <button
                    onClick={cropImage}
                    className="mt-4 px-6 py-3 bg-green-500 text-white rounded-md"
                  >
                    Crop Image
                  </button>
                  {currentImage.cropped && (
                    <button
                      onClick={downloadCroppedImage}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md"
                    >
                      Download Cropped
                    </button>
                  )}
                  {currentImage.cropped && (
                    <button
                      onClick={() => {
                        updateImageInArray(currentImage.id, { cropped: null });
                      }}
                      className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md"
                    >
                      Reset Crop
                    </button>
                  )}
                </div>
                <select
                    value={cropShape}
                    onChange={(e) => setCropShape(e.target.value)}
                    className="px-2 py-1 border border-gray-400 rounded-md mt-2"
                  >
                    <option value="square">Square</option>
                    <option value="rectangle">Rectangle</option>
                    <option value="circle">Circle</option>
                  </select>
                <div className="relative w-96 h-96 bg-gray-200 mt-4">
                 
                  <ReactCrop
                    crop={showCropSelection ? crop : undefined}
                    onChange={
                      showCropSelection
                        ? (newCrop) => setCrop(newCrop)
                        : undefined
                    }
                    onComplete={showCropSelection ? onCropComplete : undefined}
                    aspect={cropShape === "rectangle" ? 16 / 11 : 1}
                    keepSelection
                    minWidth={50}
                    minHeight={50}
                    circularCrop={cropShape === "circle"}
                    disabled={!showCropSelection} // Disable when not showing selection
                  >
                    <img
                      ref={imgRef}
                      src={currentImage.cropped || currentImage.processed}
                      alt="To be cropped"
                      className="max-w-full"
                      onClick={() => {
                        setIsCropToolVisible(true);
                        setShowCropSelection(true);
                        if (lastCropPosition) {
                          setCrop(lastCropPosition); // Restore last crop position
                        }
                      }}
                      style={{
                        width:
                          currentImage.size?.width > 400
                              ? `${currentImage.size.width * 0.6}px`
                            : `${currentImage.size?.width}px`,
                        height:
                          currentImage.size?.height > 400
                            ? `${currentImage.size.height * 0.6}px`
                            : `${currentImage.size?.height}px`,
                      }}
                    />
                  </ReactCrop>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </HelmetProvider>
  );
};

export default BackgroundRemover;