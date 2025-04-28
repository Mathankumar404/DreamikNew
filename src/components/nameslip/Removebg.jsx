import { useEffect, useState } from "react";
import { removeBackground } from "@imgly/background-removal";
import "./removebg.css";
const Removebg = ({ selectedImage, setSelectedImage, initialimage, isremovebg, setremovebg }) => {

  const [isloading, setLoading] = useState(false);

  const removebackground = async () => {


    if (!selectedImage || selectedImage === "") {
      alert("Please select an image first!");
      return;
    }
    if (sessionStorage.getItem("removebg")) {
      setremovebg(true)
      return setSelectedImage(sessionStorage.getItem("removebg"));
    }
    try {
      setLoading(true);

      // Fetch image as a Blob
      const response = await fetch(selectedImage, { mode: "cors" });

      if (!response.ok) throw new Error("❌ Failed to fetch image");

      const blob = await response.blob();

      // Convert blob into a File object
      const file = new File([blob], "image.png", { type: blob.type });


      // 🛑 Check if `removeBackground` is a function
      if (typeof removeBackground !== "function") {
        throw new Error(
          "❌ removeBackground is not a function! Check the import."
        );
      }

      
      const result = await removeBackground(file);


      if (!result || !(result instanceof Blob)) {
        throw new Error("❌ Imgly returned an invalid result.");
      }

      // Convert processed image to URL
      const url = URL.createObjectURL(result);
      setLoading(false);
      setSelectedImage(url);
      sessionStorage.setItem("personImage", url)
      sessionStorage.setItem("removebg", result)
      setremovebg(true);
    } catch (error) {
      console.error("❌ Error processing image with Imgly:", error);
    }

    // // Convert selected image to a downloadable file
    // const response = await fetch(selectedImage);
    // const blob = await response.blob();
    // const file = new File([blob], "image.png", { type: "image/png" });

    // // Create a temporary link to download the image
    // const link = document.createElement("a");
    // link.href = URL.createObjectURL(file);
    // link.download = "selected-image.png";
    // document.body.appendChild(link);
    // link.click();
    // document.body.removeChild(link);

    // // Redirect to Remove.bg upload page
    // setTimeout(() => {
    //   window.open("https://www.remove.bg/upload", "_blank");
    // }, 1500);
  };

  const undoremoveBackground = () => {
    setSelectedImage(sessionStorage.getItem("initialimage") || initialimage);
    setremovebg(false);
  };

  // const handlesetremovebg = () => {
  //   if (istoggleremove) {
  //     const r = sessionStorage.getItem("removebg") || null;
  //     setSelectedImage(r)
  //   }
  //   console.log(initialimage)
  //   if (!istoggleremove) {
  //     setSelectedImage(initialimage)

  //   }
  //   settoggleremove(!istoggleremove)
  // }
  return (
    <div>
      {!isremovebg && (
        <button
          onClick={removebackground}
          className="removebg-btn"
          style={{ backgroundColor: "green" }}
        >
          {isloading ? "Processing..." : "Remove Background"}
        </button>
      )}

      {isremovebg && (
        <button
          onClick={undoremoveBackground}
          className="removebg-btn"
          style={{ backgroundColor: "red" }}
        >
          undo Background
        </button>
      )}
      {/* {isremovebg &&
        <div className="removetoggle">
          <label className="toggle-switch">
            <input
              type="checkbox"
              onChange={() => handlesetremovebg()}
            />
            <span className="slider"></span>
          </label>
          <span className={`toggle-status ${istoggleremove ? 'with-bg' : 'without-bg'}`}>
            {istoggleremove ? "With Background" : "Without Background"}
          </span>
        </div>
      } */}
    </div>

  );
};

export default Removebg;