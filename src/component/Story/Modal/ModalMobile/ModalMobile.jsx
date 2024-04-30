// Modal.js
import React, { useEffect, useState } from "react";
import "./ModalMobile.css"; // Importing the CSS file for styling
import {
  bookmark,
  getUserIdFromToken,
  like,
  viewStoryByUserId,
} from "../../../../apis/story";
import toast from "react-hot-toast";
import previous from "../../../../assets/previous.png";
import next from "../../../../assets/next.png";
import share from "../../../../assets/share.png";
import cross from "../../../../assets/cross.png";

const ModalMobile = ({ story, onClose }) => {
  if (!story) {
    return null; // Return null or any placeholder content if story is undefined
  }
  // console.log(story);

  const { slides, _id } = story;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);

  const userId = getUserIdFromToken();

  // console.log("userId",userId)

  useEffect(() => {
    if (!story) return;
    const fetchBookmarkAndLikesData = async () => {
      try {
        if (!userId) {
          console.error("User is not authenticated");
          return;
        }
        const { bookmarked, liked, totalLikes } = await viewStoryByUserId(
          _id,
          userId
        );
        setIsBookmarked(bookmarked);
        setIsLiked(liked);
        setTotalLikes(totalLikes);
      } catch (error) {
        console.error("error fetching bookmark and likes data", error);
      }
    };
    fetchBookmarkAndLikesData();
  }, [_id]);

  const handleBookmark = async () => {
    if (!userId) {
      // setErrorState(true);
      return;
    }
    try {
      await bookmark(story?._id);
      // console.log(story);
      setIsBookmarked(true);
    } catch (error) {
      console.error(error);
    }
  };
  const handleLiked = async () => {
    if (!userId) {
      // setErrorState(true);
      return;
    }
    try {
      await like(story?._id);
      // console.log(story);
      setIsLiked(true);
    } catch (error) {
      console.error(error);
    }
  };

  const goToPreviousSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === 0 ? slides.length - 1 : prevIndex - 1
    );
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleView = async () => {
    try {
      const storyURL = `${window.location.origin}/view/${story._id}`;

      // Copy the URL to the clipboard
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link Copied to clipboard");

      console.log("Link copied to clipboard:", storyURL);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="modal-overlay">
        <div className="slide">
          <div className="story__top">
            <img
              className="story__cross"
              src={cross}
              alt="multiply"
              onClick={onClose}
            />{" "}
            <img
              className="story__share"
              src={share}
              alt="share"
              onClick={handleView}
            />
          </div>
          <div className="prev1" onClick={goToPreviousSlide}></div>

          <img
            src={slides[currentSlideIndex].imageUrl}
            alt={`Slide ${currentSlideIndex + 1}`}
          />
          <div className="next1" onClick={goToNextSlide}></div>
          <div className="slide__content">
            <h2>{slides[currentSlideIndex].title}</h2>
            <p>{slides[currentSlideIndex].description}</p>
          </div>
          <div className="story__bottom">
            <img
              className="story__bookmark"
              src={
                isBookmarked
                  ? "https://img.icons8.com/ios-filled/50/228BE6/bookmark-ribbon.png"
                  : "https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
              }
              alt="bookmark-ribbon"
              onClick={handleBookmark}
            />

            <img
              className="story__liked"
              src={
                isLiked
                  ? "https://img.icons8.com/ios-filled/50/FF0000/like--v1.png"
                  : "https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png"
              }
              alt="like--v1"
              onClick={handleLiked}
            />
            <p>{story.totalLikes}</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ModalMobile;
