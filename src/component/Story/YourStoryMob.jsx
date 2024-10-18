import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import "./Stories/Stories.css";
import StoryCard from "./StoryCard/StoryCard";
import Form from "../Form/Form";
import { useSelector } from "react-redux";

const YourStoryMob = () => {
  const [userStories, setUserStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const userId = getUserIdFromToken();
  const { isSmallScreen } = useSelector((state) => state.layout);

  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        if (!userId) {
          console.error("user is not authenticated");
          return;
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
      } catch (error) {
        console.error("error fetching user stories", error);
      }
    };
    fetchUserStory();
  }, [userId]);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    setShowMoreBtn(userStories.length > visibleStoriesCount);
  }, [userStories.length, visibleStoriesCount]);

  return (
    <div>
      <Form />
      {userStories.length > 0 ? (
        <>
          {userId && userStories && isSmallScreen && (
            <div className="story__main__card">
              <div className="category__card__main">
                <div className="category__card__mobile">
                  <h2 className="mb-4 text-2xl font-bold">Your Stories</h2>
                  <div className={`story__cards ${isSmallScreen ? "small-screen" : ""} grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4`}>
                    {userStories
                      .slice(0, visibleStoriesCount)
                      .map((userStory, index) => (
                        <StoryCard
                          key={index}
                          story={userStory}
                          isUserStory={true}
                        />
                      ))}
                  </div>
                  {showMoreBtn && (
                    <div className="mt-4 text-center see-more-btn">
                      <button onClick={handleShowMoreBtn} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                        See More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <h2 className="mt-8 text-2xl font-bold text-center">No User Stories Available</h2>
      )}
    </div>
  );
};

export default YourStoryMob;