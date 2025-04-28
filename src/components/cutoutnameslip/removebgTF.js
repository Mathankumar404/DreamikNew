import { removeBackground } from "@imgly/background-removal";

export const processWithImgly = async (selectedImage,  setselectedImage,setremovebg) => {
    try {
      const response = await fetch(selectedImage, { mode: "cors" });
      if (!response.ok) throw new Error("Failed to fetch image");
  
      const blob = await response.blob();
      const file = new File([blob], "image.png", { type: blob.type });
  
      if (typeof removeBackground !== "function")
        throw new Error("removeBackground is not a function!");
  
      const result = await removeBackground(file);
      if (!result || !(result instanceof Blob))
        throw new Error("Invalid Imgly result");
  
      setselectedImage(URL.createObjectURL(result));
      sessionStorage.setItem("removebg",URL.createObjectURL(result))
      setremovebg(true)
    } catch (error) {
      console.error("Error processing with Imgly:", error);
    }
  };
  