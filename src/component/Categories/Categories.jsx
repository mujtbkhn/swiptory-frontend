import React, { useState } from "react";
import { Filters } from "../../utils/FIlters";
import { useSelector } from "react-redux";
import { useEditableContext } from "../contexts/EditableContext";

const Categories = () => {
  const { setSelectedCategory } = useEditableContext();
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [activeFilter, setActiveFilter] = useState(null);

  const handleFilterClick = (filterId) => {
    setSelectedCategory(filterId);
    setActiveFilter(filterId);
  };

  return (
    <div className={`grid ${isSmallScreen ? "grid-cols-2 gap-4" : "grid-cols-4 lg:grid-cols-6 gap-6"} py-8`}>
      {Filters.map((filter, index) => (
        <div
          key={index}
          onClick={() => handleFilterClick(filter.id)}
          className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 ${
            activeFilter === filter.id ? "ring-4 ring-blue-500" : ""
          }`}
        >
          <img 
            src={filter.background} 
            alt={filter.name} 
            className="object-cover w-full h-full"
            loading="lazy"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40">
            <h1 className="text-lg font-bold text-center text-white">{filter.name}</h1>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Categories;