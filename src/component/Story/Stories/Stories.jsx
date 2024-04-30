import React, { useEffect, useState } from "react";
import "./Stories.css";
import { fetchStoryByCategory } from "../../../apis/story";
import StoryCard from "../StoryCard/StoryCard";
import { useSelector } from "react-redux";
import { useEditableContext } from "../../contexts/EditableContext";
import UserStories from "../UserStories";
import AllCategoryStories from "../AllCategoryStories";
import Loader from "../../../utils/Loader";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const { selectedCategory, setSelectedCategory } = useEditableContext();

  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        if (Array.isArray(fetchedStories)) {
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

  if(stories.length === 0 && selectedCategory !== "all"){
    return <Loader />
  }

  return (
    <>
    {!isSmallScreen && selectedCategory === "all" && <UserStories />}
    {selectedCategory === "all" && <AllCategoryStories />}
    {selectedCategory !== "all" && (
      <div className="story_main_card">
        <div className="category_card_main">
          <div
            className={
              isSmallScreen ? "category_card__mobile" : "category_card"
            }
          >
            <h2>Top Stories from {selectedCategory}</h2>
            <div
              className={`story__cards ${
                isSmallScreen ? "small-screen" : "large-screen"
              }`}
            >
              {stories?.map((story, index) => (
                <StoryCard key={index} className="story__card" story={story} />
              ))}
            </div>
          </div>
        </div>
      </div>
    )}
  </>
  
  );
};

export default Stories;
