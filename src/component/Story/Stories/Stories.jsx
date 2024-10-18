import React, { useEffect, useState } from "react";
import { fetchStoryByCategory } from "../../../apis/story";
import StoryCard from "../StoryCard/StoryCard";
import { useSelector } from "react-redux";
import { useEditableContext } from "../../contexts/EditableContext";
import UserStories from "../UserStories";
import AllCategoryStories from "../AllCategoryStories";
import Shimmer from "../Shimmer/Shimmer";

const Stories = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { selectedCategory } = useEditableContext();
  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        if (Array.isArray(fetchedStories)) {
          setStories(fetchedStories);
        } else {
          console.log("Error: Invalid data format returned from API", fetchedStories);
        }
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchData();
  }, [selectedCategory]);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    if (stories.length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [stories.length, visibleStoriesCount]);

  if (stories.length === 0 && selectedCategory !== "all") {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {!isSmallScreen && selectedCategory === "all" && (
        <UserStories />
      )}
      {selectedCategory === "all" && <AllCategoryStories />}
      {selectedCategory !== "all" && (
        <div className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Top Stories from {selectedCategory}</h2>
          <div className={`grid ${isSmallScreen ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"} gap-6`}>
            {stories.slice(0, visibleStoriesCount)?.map((story, index) => (
              <StoryCard key={index} story={story} />
            ))}
          </div>
          {showMoreBtn && (
            <div className="mt-6 text-center">
              <button onClick={handleShowMoreBtn} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                See More
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Stories;