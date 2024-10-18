import React, { useEffect, useState } from "react";
import { fetchUserStories, getUserIdFromToken } from "../../apis/story";
import { useSelector } from "react-redux";
import StoryCard from "./StoryCard/StoryCard";

const UserStories = () => {
  const [userStories, setUserStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [userId, setUserId] = useState(false);

  useEffect(() => {
    const fetchUserStory = async () => {
      try {
        const userId = await getUserIdFromToken();
        if (!userId) {
          return;
        }
        if (userId) {
          setUserId(true);
        }
        const fetchUser = await fetchUserStories(userId);
        setUserStories(fetchUser.stories);
      } catch (error) {
        console.error("error fetching", error);
      }
    };
    fetchUserStory();
  }, []);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevStories) => prevStories + 4);
  };

  useEffect(() => {
    if (userStories.length > visibleStoriesCount) {
      setShowMoreBtn(true);
    } else {
      setShowMoreBtn(false);
    }
  }, [userStories.length, visibleStoriesCount]);

  if (userStories.length === 0) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-bold">No User Stories Available</h2>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4 text-center">Your Stories</h2>
      <div className={`grid ${isSmallScreen ? "grid-cols-1" : "grid-cols-1 md:grid-cols-2 lg:grid-cols-4"} gap-6`}>
        {userStories.slice(0, visibleStoriesCount).map((userStory, index) => (
          <StoryCard key={index} story={userStory} isUserStory={true} />
        ))}
      </div>
      {showMoreBtn && (
        <div className="mt-6 text-center">
          <button 
            onClick={handleShowMoreBtn}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            See More
          </button>
        </div>
      )}
    </div>
  );
};

export default UserStories;