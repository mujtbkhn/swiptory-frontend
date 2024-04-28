import React, { useEffect, useState } from "react";
import "./StoryMainCard.css";
import {
  fetchStoryByCategory,
  fetchUserStories,
  getUserIdFromToken,
} from "../../../apis/story";
import StoryCard from "../StoryCard/StoryCard";
import { Filters } from "../../../utils/FIlters";
import { useSelector } from "react-redux";

const StoryMainCard = () => {
  const [stories, setStories] = useState([]);
  const [userStories, setUserStories] = useState([]);
  const [category, setCategory] = useState("all");
  const [showAllUserStories, setShowAllUserStories] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const userId = getUserIdFromToken();

  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedStories = await fetchStoryByCategory(category);
        setStories(fetchedStories || []);
        // console.log(stories);
      } catch (error) {
        console.error("Error fetching stories:", error);
      }
    };

    fetchData();
  }, [category]);
  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        const userId = getUserIdFromToken();
        if (!userId) {
          console.error("User is not authenticated");
          return;
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
        // console.log(userStories);
      } catch (error) {
        console.error("error fetching", error);
      }
    };
    fetchUserStory();
  }, []);

  const handleShowMoreBtn = () => {
    setShowAllUserStories(true);
    setShowMoreBtn(false);
  };

  useEffect(() => {
    if (!showAllUserStories && userStories.length > 4) {
      setShowMoreBtn(true);
    }
  }, [showAllUserStories, userStories]);

  // console.log(category);
  return (
    <>
      <div
        className={
          isSmallScreen ? "filter__sub__main__mobile" : "filter__sub__main"
        }
      >
        {Filters.map((filter, index) => (
          <div
            className={isSmallScreen ? "filter__mobile" : "filter"}
            key={index}
            onClick={() => setCategory(filter.id)}
          >
            <img src={filter.background} alt={filter.name} />
            <h1>{filter.name}</h1>
          </div>
        ))}
      </div>
      {userId && userStories && !isSmallScreen && (
        <div className="story__main__card">
          <div className="category__card__main">
            <div
              className={
                isSmallScreen ? "category__card__mobile" : "category__card"
              }
            >
              <h2>Your Stories</h2>
              <div
                className={`story__cards ${
                  isSmallScreen ? "small-screen" : "large-screen"
                }`}
              >
                {userStories
                  .slice(0, showAllUserStories ? userStories.length : 4)
                  .map((userStory, index) => (
                    <StoryCard
                      key={index}
                      story={userStory}
                      isUserStory={true}
                    />
                  ))}
              </div>
              <div className="see-more-btn">
                {showMoreBtn && (
                  <button onClick={handleShowMoreBtn}> See More</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {category === "all" &&
        Object.keys(stories).map((categoryName, categoryIndex) => (
          <div className="category__card__main" key={categoryIndex}>
            <div
              className={
                isSmallScreen ? "category__card__mobile" : "category__card"
              }
            >
              <div>
                <h2>Top Stories About {categoryName}</h2>
              </div>
              <div
                className={`story__cards ${
                  isSmallScreen ? "small-screen" : "large-screen"
                }`}
              >
                {stories[categoryName]?.map((story, storyIndex) => (
                  <StoryCard key={storyIndex} story={story} />
                ))}
              </div>
            </div>
          </div>
        ))}
      {category !== "all" &&
        stories[category]?.map((story, storyIndex) => (
          <StoryCard key={storyIndex} story={story} />
        ))}
      {category !== "all" &&
        stories[category] &&
        stories[category].length > 0 && (
          <div className="story__main__card">
            <div className="category__card__main">
              <div
                className={
                  isSmallScreen ? "category__card__mobile" : "category__card"
                }
              >
                <h2>Top Stories from {category}</h2>
                <div
                  className={`story__cards ${
                    isSmallScreen ? "small-screen" : "large-screen"
                  }`}
                >
                  {stories[category].map((userStory, index) => (
                    <StoryCard key={index} story={userStory} />
                  ))}
                </div>
                <div className="see-more-btn">
                  {showMoreBtn && (
                    <button onClick={handleShowMoreBtn}> See More</button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
    </>
  );
};

export default StoryMainCard;
