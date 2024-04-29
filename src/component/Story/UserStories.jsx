import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";
import "./StoryMainCard/StoryMainCard.css"

const UserStories = () => {
  const [userStories, setUserStories] = useState([]);
  const [showAllUserStories, setShowAllUserStories] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) {
          console.error("User is not authenticated");
          return;
        }
        if (userId) {
          setUserId(true);
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
  return (
    <div>
      {userId && userStories && !isSmallScreen && (
        <div className="story_main_card">
          <div className="category_card_main">
            <div
              className={
                isSmallScreen ? "category_card__mobile" : "category_card"
              }
            >
                <div style={{display: "flex", justifyContent: "center", margin: " 1rem auto"}}>

              <h2>Your Stories</h2>
                </div>
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
    </div>
  );
};

export default UserStories;
