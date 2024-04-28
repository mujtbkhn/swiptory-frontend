import React, { useEffect, useState } from "react";
import { getAllBookmarks } from "../../apis/story";
import StoryCard from "../../component/Story/StoryCard/StoryCard";
import "./Bookmark.css"
import Form from "../../component/Form/Form";

const Bookmark = () => {
  const [stories, setStories] = useState([]);


  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const data = await getAllBookmarks();
        console.log(data.bookmarks);
        setStories(data.bookmarks);
      } catch (error) {
        console.error(error);
      }
    };
    fetchBookmarks();
  }, []);
  return (
    <div>
      <Form />
      <h1 style={{display:"flex", justifyContent: "center", margin: "2rem auto"}}>Your Bookmarks</h1>
      <div className="bookmark">
        {stories?.map((story, index) => (
          <StoryCard
            key={index}
            story={story}
          />
        ))}
      </div>
    </div>
  );
};

export default Bookmark;
