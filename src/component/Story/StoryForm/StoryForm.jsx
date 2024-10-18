import React, { useEffect, useState } from "react";
import { CATEGORIES } from "../../../utils/constants";

const StoryForm = ({ initialSlide, slide, slideIndex, handleChange }) => {
  const [slides, setSlides] = useState(initialSlide);
  
  useEffect(() => {
    setSlides(initialSlide);
  }, [initialSlide]);

  return (
    <div className="px-8 pt-6 pb-8 mb-4 bg-white rounded shadow-md">
      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="title">
          Title
        </label>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="title"
          type="text"
          name="title"
          value={slide?.title}
          placeholder="Your heading"
          onChange={(e) => handleChange(e, slideIndex)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="description">
          Description
        </label>
        <textarea
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="description"
          name="description"
          value={slide?.description}
          placeholder="Story Description"
          onChange={(e) => handleChange(e, slideIndex)}
          rows="3"
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="imageUrl">
          Image URL
        </label>
        <input
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="imageUrl"
          type="text"
          name="imageUrl"
          value={slide?.imageUrl}
          placeholder="Add Image URL"
          onChange={(e) => handleChange(e, slideIndex)}
        />
      </div>

      <div className="mb-4">
        <label className="block mb-2 text-sm font-bold text-gray-700" htmlFor="category">
          Category
        </label>
        <select
          className="w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline"
          id="category"
          name="category"
          value={slide?.category}
          onChange={(e) => handleChange(e, slideIndex)}
        >
          <option value="" disabled className="text-gray-500">
            Select category
          </option>
          {CATEGORIES.map((cat, index) => (
            <option key={index} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default StoryForm;