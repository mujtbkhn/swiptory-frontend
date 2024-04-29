import React from "react";
import { Filters } from "../../utils/FIlters";
import { useSelector } from "react-redux";
import { useEditableContext } from "../contexts/EditableContext";

const Categories = () => {
  const { selectedCategory, setSelectedCategory } = useEditableContext();
  const { isSmallScreen } = useSelector((state) => state.layout);

  // console.log(selectedCategory)
  return (
    <div
      className={
        isSmallScreen ? "filter__sub__main__mobile" : "filter__sub__main"
      }
    >
      {Filters.map((filter, index) => (
        <div
          className={isSmallScreen ? "filter__mobile" : "filter"}
          key={index}
          onClick={() => setSelectedCategory(filter.id)}
        >
          <img src={filter.background} alt={filter.name} />
          <h1>{filter.name}</h1>
        </div>
      ))}
    </div>
  );
};

export default Categories;
