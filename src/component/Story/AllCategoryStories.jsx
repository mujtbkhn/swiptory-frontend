import React, { useEffect, useState } from "react";
import { fetchStoryByCategory, fetchUserStories } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";
import { useEditableContext } from "../contexts/EditableContext";
import "./StoryMainCard/StoryMainCard.css";
import Test from "../Test";

const AllCategoryStories = () => {
  const [stories, setStories] = useState([]);
  const [showAllUserStories, setShowAllUserStories] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const { selectedCategory, setSelectedCategory } = useEditableContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        // console.log("API Response:", fetchedStories); // Log the API response
        if (typeof fetchedStories === "object" && fetchedStories !== null) {
          setStories(fetchedStories);
        } else {
          console.error(
            "Error: Invalid data format returned from API",
            fetchedStories
          );
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };
    
    fetchData();
  }, [selectedCategory]);

  const handleShowMoreBtn = () => {
    setShowAllUserStories(true);
    setShowMoreBtn(false);
  };

  useEffect(() => {
    if (
      !showAllUserStories &&
      Object.values(stories).flatMap((arr) => arr).length > 4
    ) {
      setShowMoreBtn(true);
    }
  }, [showAllUserStories, stories]);

  if (stories.length === 0) {
    return <Test />;
  }

  return (
    <div>
      {Object.entries(stories).map(
        ([categoryName, categoryStories], categoryIndex) => (
          <div className="category_card_main" key={categoryIndex}>
            <div
              className={
                isSmallScreen ? "category_card__mobile" : "category_card"
              }
            >
              <div style={{ display: "flex", justifyContent: "center", margin: " 1rem auto"}}>
                <h2>Top Stories About {categoryName}</h2>
              </div>
              <div
                className={`story__cards ${
                  isSmallScreen ? "small-screen" : "large-screen"
                }`}
              >
                {categoryStories.map((story, storyIndex) => (
                  <StoryCard key={storyIndex} story={story} />
                ))}
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default AllCategoryStories;
