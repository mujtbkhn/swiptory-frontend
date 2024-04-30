import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../apis/story";
import StoryCard from "../../component/Story/StoryCard/StoryCard";
import "./Bookmark.css"
import Form from "../../component/Form/Form";
import Test from "../../component/Test";

const Bookmark = () => {
  const [stories, setStories] = useState([]);
  const [showAllUserStories, setShowAllUserStories] = useState(false)
  const [showMoreBtn, setShowMoreBtn] = useState(false)

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getAllBookmarks();
        // console.log(data.bookmarks);
        setStories(data && data.bookmarks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookmarks();
  }, []);

  const handleShowMoreBtn = () => {
    setShowAllUserStories(true);
    setShowMoreBtn(false);
  };

  useEffect(() => {
    if (!showAllUserStories && stories.length > 4) {
      setShowMoreBtn(true);
    }
  }, [showAllUserStories, stories]);

  if(stories.length === 0){
    return <Test />
  }
  return (
    <div >
      <Form />
      <h1 style={{display:"flex", justifyContent: "center", margin: "2rem auto"}}>Your Bookmarks</h1>
      <div className="bookmark__main">

      <div className="bookmark">
        {stories
        .slice(0, showAllUserStories ? stories.length : 4)
        ?.map((story, index) => (
          <StoryCard
          key={index}
          story={story}
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
  );
};

export default Bookmark;
