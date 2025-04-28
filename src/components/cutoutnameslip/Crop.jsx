import React, { useRef, useState } from 'react';

const CustomResizable = () => {
  const customDivRef = useRef(null);
  const imageRef = useRef(null);
  const [zoom, setZoom] = useState(1);
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Resize logic
  const handleMouseDown = (e, direction) => {
    e.preventDefault();
    e.stopPropagation();

    const startX = e.clientX;
    const startY = e.clientY;
    const startWidth = customDivRef.current.offsetWidth;
    const startHeight = customDivRef.current.offsetHeight;

    const handleMouseMove = (e) => {
      let newWidth = startWidth;
      let newHeight = startHeight;

      if (direction.includes('e')) {
        newWidth = startWidth + (e.clientX - startX);
      }
      if (direction.includes('s')) {
        newHeight = startHeight + (e.clientY - startY);
      }
      if (direction.includes('w')) {
        newWidth = startWidth - (e.clientX - startX);
      }
      if (direction.includes('n')) {
        newHeight = startHeight - (e.clientY - startY);
      }

      // Clamp div size
      newWidth = Math.max(150, Math.min(newWidth, 800));
      newHeight = Math.max(100, Math.min(newHeight, 600));

      customDivRef.current.style.width = `${newWidth}px`;
      customDivRef.current.style.height = `${newHeight}px`;
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  // Drag logic
  const handleImageMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setDragOffset({
      x: e.clientX - imagePosition.x,
      y: e.clientY - imagePosition.y,
    });
  };

  const handleMouseMove = (e) => {
    if (!dragging) return;
    const containerRect = customDivRef.current.getBoundingClientRect();

    let x = e.clientX - dragOffset.x;
    let y = e.clientY - dragOffset.y;

    // Optional: Clamp the image inside the container
    x = Math.min(0, Math.max(x, containerRect.width - imageRef.current.offsetWidth));
    y = Math.min(0, Math.max(y, containerRect.height - imageRef.current.offsetHeight));

    setImagePosition({ x, y });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  // Zoom logic (slider or wheel)
  const handleZoomChange = (e) => {
    setZoom(Number(e.target.value));
  };

  return (
    <div>
      <div
        ref={customDivRef}
        style={{
          position: 'relative',
          width: '300px',
          height: '200px',
          border: '1px solid #ccc',
          overflow: 'hidden',
          minWidth: '150px',
          minHeight: '100px',
          resize: 'none',
          marginBottom: '10px',
          userSelect: 'none',
        }}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src="/Cutoutnameslipdemo/CNimage3.jpeg"
          alt="zoomable"
          onMouseDown={handleImageMouseDown}
          style={{
            position: 'absolute',
            left: imagePosition.x,
            top: imagePosition.y,
            width: `${300 * zoom}px`,
            height: `${200 * zoom}px`,
            cursor: dragging ? 'grabbing' : 'grab',
            userSelect: 'none',
          }}
        />
        {/* Corner Handles */}
        <div onMouseDown={(e) => handleMouseDown(e, 'nw')} style={resizeHandleStyle('top', 'left')} />
        <div onMouseDown={(e) => handleMouseDown(e, 'ne')} style={resizeHandleStyle('top', 'right')} />
        <div onMouseDown={(e) => handleMouseDown(e, 'sw')} style={resizeHandleStyle('bottom', 'left')} />
        <div onMouseDown={(e) => handleMouseDown(e, 'se')} style={resizeHandleStyle('bottom', 'right')} />
      </div>

      {/* Zoom Slider */}
      <input
        type="range"
        min="0.5"
        max="3"
        step="0.1"
        value={zoom}
        onChange={handleZoomChange}
      /> Zoom: {zoom.toFixed(1)}x
    </div>
  );
};

const resizeHandleStyle = (vertical, horizontal) => ({
  width: '12px',
  height: '12px',
  background: '#000',
  position: 'absolute',
  [vertical]: 0,
  [horizontal]: 0,
  cursor: `${vertical[0]}${horizontal[0]}-resize`,
});

export default CustomResizable;
