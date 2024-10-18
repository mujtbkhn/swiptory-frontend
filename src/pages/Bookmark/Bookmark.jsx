import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../apis/story";
import StoryCard from "../../component/Story/StoryCard/StoryCard";
import "./Bookmark.css";
import Form from "../../component/Form/Form";
import Shimmer from "../../component/Story/Shimmer/Shimmer";

const Bookmark = () => {
  const [stories, setStories] = useState([]);
  const [visibleStoriesCount, setVisibleStoriesCount] = useState(4);
  const [showMoreBtn, setShowMoreBtn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getAllBookmarks();
        setStories(data && data.bookmarks);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchBookmarks();
  }, []);

  const handleShowMoreBtn = () => {
    setVisibleStoriesCount((prevCount) => prevCount + 4);
  };

  useEffect(() => {
    setShowMoreBtn(stories?.length > visibleStoriesCount);
  }, [stories?.length, visibleStoriesCount]);

  return (
    <div className="container px-4 mx-auto">
      <div className="relative z-50">
        <Form />
      </div>
      {loading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, index) => (
            <Shimmer key={index} />
          ))}
        </div>
      ) : stories?.length > 0 ? (
        <>
          <h1 className="my-8 text-3xl font-bold text-center">Your Bookmarks</h1>
          <div className="relative z-0">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {stories.slice(0, visibleStoriesCount)?.map((story, index) => (
                <StoryCard key={index} story={story} />
              ))}
            </div>
            {showMoreBtn && (
              <div className="mt-8 text-center see-more-btn">
                <button onClick={handleShowMoreBtn} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                  See More
                </button>
              </div>
            )}
          </div>
        </>
      ) : (
        <h1 className="my-8 text-3xl font-bold text-center">No Bookmarks Found</h1>
      )}
    </div>
  );
};

export default Bookmark;