import React, { useEffect, useState } from "react";
import { fetchStoryByCategory } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";
import { useEditableContext } from "../contexts/EditableContext";
import Shimmer from "./Shimmer/Shimmer";

const AllCategoryStories = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState({});
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const { selectedCategory } = useEditableContext();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(selectedCategory);
        if (typeof fetchedStories === "object" && fetchedStories !== null) {
          setStories(fetchedStories);

          const initialVisibleCount = {};
          Object.keys(fetchedStories).forEach(
            (categoryName) => (initialVisibleCount[categoryName] = 4)
          );
          setVisibleStoriesCount(initialVisibleCount);
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

  const handleShowMoreBtn = (categoryName) => {
    setVisibleStoriesCount((prevCount) => ({
      ...prevCount,
      [categoryName]: prevCount[categoryName] + 4,
    }));
  };

  useEffect(() => {
    if (Object.values(stories).flatMap((arr) => arr).length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [stories, visibleStoriesCount]);

  if (Object.keys(stories).length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[...Array(4)].map((_, index) => (
          <Shimmer key={index} />
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-12">
      {Object.entries(stories).map(([categoryName, categoryStories], categoryIndex) => (
        <div key={categoryIndex} className="bg-gray-100 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4 text-center">Top Stories About {categoryName}</h2>
          <div className={`grid ${isSmallScreen ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"} gap-6`}>
            {categoryStories.slice(0, visibleStoriesCount[categoryName]).map((story, storyIndex) => (
              <StoryCard key={storyIndex} story={story} />
            ))}
          </div>
          {categoryStories.length > 4 && visibleStoriesCount[categoryName] < categoryStories.length && (
            <div className="mt-6 text-center">
              <button 
                onClick={() => handleShowMoreBtn(categoryName)}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                See More
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default AllCategoryStories;