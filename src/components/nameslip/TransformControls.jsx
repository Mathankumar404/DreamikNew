import React from 'react';
import { SwatchesPicker } from "react-color";
import { useState } from 'react';
const TransformControls = ({ onUpdateTransform, div, fontSize }) => {
  fontSize = Math.round(fontSize)


  const [showPalette, setShowPalette] = useState(false); // toggle visibility
  const [textcolor, settextcolor] = useState("#292d9e")
  const handleColorSelect = (color) => {
    onUpdateTransform("color", color.hex);
    settextcolor(color.hex)
    setShowPalette(false);

  };
  return (
    <div className="flex space-x-2">
      <button title={`Zoom in fs:${fontSize}`} onClick={() => onUpdateTransform("scale", 0.1)}>
        <i className="fas fa-search-plus"></i>
      </button>
      <button title={`Zoom in fs:${fontSize}`} onClick={() => onUpdateTransform("scale", -0.1)}>
        <i className="fas fa-search-minus"></i>
      </button>
      <button title="Tilt Left" onClick={() => onUpdateTransform("rotate", -5)}>
        <i className="fas fa-undo"></i>
      </button>
      <button title="Tilt Right" onClick={() => onUpdateTransform("rotate", 5)}>
        <i className="fas fa-redo"></i>
      </button>
      <button title="Upside Down" onClick={() => onUpdateTransform("rotate", 180)}>
        <i className="fas fa-sync-alt"></i>
      </button>
      <button title="Move Up" onClick={() => onUpdateTransform("translateY", -5)}>
        <i className="fas fa-arrow-up"></i>
      </button>
      <button title="Move Down" onClick={() => onUpdateTransform("translateY", 5)}>
        <i className="fas fa-arrow-down"></i>
      </button>
      <button title="Move Left" onClick={() => onUpdateTransform("translateX", -5)}>
        <i className="fas fa-arrow-left"></i>
      </button>
      <button title="Move Right" onClick={() => onUpdateTransform("translateX", 5)}>
        <i className="fas fa-arrow-right"></i>
      </button>

      <br />
      {!div &&

        <div style={{ position: "relative", display: "inline-block" }}>
          <h4 style={{ margin: "8px", fontSize: "16px", fontWeight: "bold" }}>Change color:</h4>


          <div
            title="Change Font Color"
            onClick={() => setShowPalette((prev) => !prev)}
            style={{
              width: "40px",
              height: "40px",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              background: textcolor,
              marginLeft: "40px"
            }}
          >

          </div>

          {showPalette && (
            <div style={{
              position: "absolute", zIndex: 10, left: "-50px", // Adjust this value as needed
              transform: "scale(0.7)",
              transformOrigin: "top left"
            }}>
              <SwatchesPicker onChangeComplete={handleColorSelect} />
            </div>
          )}
        </div>
      }

      {/* {div &&
        <>
          <button> Crop Image</button>
        </>
      } */}
    </div>
  );
};

export default TransformControls;
