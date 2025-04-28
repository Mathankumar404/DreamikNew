
import React, { useState } from "react";
import "./SearchCategories.css";

const categories = [
      "Flower", "Sports","Leader","white","Rainbow","Rocket","School","Unicorn","horse","india","skating",
      "football","Rose","Friends","spider","Netaji","Boxing","Music","Krishna","Cake","christmas","Chandrayaan"
      ,"Athletes","Winner","Gaming","Lord","Girls","Butterfly","Artist","Satellite","Race","car","Bike","karate",
      "Silambam","Toy","Anime"
   ];

const SearchCategories = ({ searchText, setSearchText }) => {
  const [showMore, setShowMore] = useState(false);

  return (
   
    <div>
      <div className={`categories-container ${showMore ? "show-more" : ""}`}>
        {categories.map((category, index) => (
          <span 
            key={index} 
            className="category-bubble"
            onClick={() => setSearchText(category)}
          >
            {category}
          </span>
        ))}
      </div>
      <div 
        className="show-more-button" 
        onClick={() => setShowMore(!showMore)}
      >
        {showMore ? "Show Less" : "Show More"}
      </div>
      <hr />
    </div>
  );
};

export default SearchCategories;
