import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import "./StoryMainCard/StoryMainCard.css";
import StoryCard from "./StoryCard/StoryCard";
import Form from "../Form/Form";
import { useSelector } from "react-redux";
import Test from "../Test";

const YourStoryMob = () => {
  const [userStories, setUserStories] = useState("");
  const [showAllUserStories, setShowAllUserStories] = useState(false);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const userId = getUserIdFromToken();
  const { isSmallScreen } = useSelector((state) => state.layout);
  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        if (!userId) {
          console.error("user is not authenticated", error);
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
      } catch (error) {
        console.error("error fetching user stories", error);
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

  if(userStories.length === 0){
    return <Test />
  }

  return (
    <div>
      <Form />
      {userId && userStories && isSmallScreen && (
        <div className="story__main__card">
          <div className="category__card__main">
            <div className={"category__card__mobile"}>
              <h2>Your Stories</h2>
              <div className={`story__cards ${"small-screen"}`}>
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

export default YourStoryMob;
