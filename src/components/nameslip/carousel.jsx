import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react"; // Icons for navigation & delete

const options = ["Roll No", "Contact No"];

const TextCarousel = ({ addField }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const nextSlide = () => setSelectedIndex((prev) => (prev + 1) % options.length);
  const prevSlide = () => setSelectedIndex((prev) => (prev - 1 + options.length) % options.length);

  return (
    <div className="flex flex-col items-center space-y-4 p-4 border rounded-lg shadow-lg w-80">
      <h2 className="text-lg font-semibold">Select a Field to Add</h2>

      {/* Carousel Navigation */}
      <div className="flex items-center space-x-2">
        <button onClick={prevSlide} className="p-2 bg-gray-200 rounded-full">
          <ChevronLeft size={24} />
        </button>
        <div className="text-xl font-bold">{options[selectedIndex]}</div>
        <button onClick={nextSlide} className="p-2 bg-gray-200 rounded-full">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Add Button */}
      <button 
        onClick={() => addField(options[selectedIndex])} 
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
      >
        Add Field
      </button>
    </div>
  );
};

export default TextCarousel;