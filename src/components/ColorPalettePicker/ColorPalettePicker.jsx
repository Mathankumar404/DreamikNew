// ColorPalettePicker.jsx
import React from 'react';
import { SwatchesPicker } from 'react-color';

const ColorPalettePicker = ({ onColorChange }) => {
  return (
    <div style={{ maxWidth: 300 }}>
      <SwatchesPicker
        onChangeComplete={(color) => onColorChange(color.hex)}
      />
    </div>
  );
};

export default ColorPalettePicker;
