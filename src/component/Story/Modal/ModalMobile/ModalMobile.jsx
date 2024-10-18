import React, { useEffect, useState } from "react";
import "./ModalMobile.css";
import "../../ProgressBar/ProgressBar.css";
import {
  bookmark,
  getUserIdFromToken,
  like,
  viewStoryByUserId,
} from "../../../../apis/story";
import toast from "react-hot-toast";
import share from "../../../../assets/share.png";
import cross from "../../../../assets/cross.png";
import { useEditableContext } from "../../../contexts/EditableContext";
import ProgressBar from "../../ProgressBar/ProgressBar";

const ModalMobile = ({ story, onClose }) => {
  if (!story) {
    return null;
  }

  const { slides, _id } = story;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { setModal, setErrorState } = useEditableContext();

  const userId = getUserIdFromToken();

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
    if (userId) {
      const newBookmarkedStatus = !isBookmarked;
      setIsBookmarked(newBookmarkedStatus);

      try {
        await bookmark(story?._id);
        // Optionally, you can fetch the updated data here
      } catch (error) {
        setIsBookmarked(!newBookmarkedStatus); // Revert if API fails
        console.error(error);
      }
    } else {
      setErrorState(true);
      setModal(false);
    }
  };

  const handleLiked = async () => {
    if (userId) {
      const newLikedStatus = !isLiked;
      setIsLiked(newLikedStatus);
      setTotalLikes((prev) => prev + (newLikedStatus ? 1 : -1));

      try {
        await like(story?._id);
        // Optionally, fetch the updated data here
      } catch (error) {
        setIsLiked(!newLikedStatus); // Revert if API fails
        setTotalLikes((prev) => prev - (newLikedStatus ? 1 : -1)); // Revert total likes
        console.error(error);
      }
    } else {
      setErrorState(true);
      setModal(false);
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
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link Copied to clipboard", {
        style: { position: "relative", top: "10rem", color: "red", fontSize: "1.5rem" }
      });

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black">
      <div className="relative h-full w-full">
        <ProgressBar slides={slides.length} iteration={currentSlideIndex} />

        <div className="absolute top-4 left-4 right-4 flex justify-between z-20">
          <button onClick={onClose}>
            <img src={cross} alt="Close" className="w-8 h-8" />
          </button>
          <button onClick={handleView}>
            <img src={share} alt="Share" className="w-8 h-8" />
          </button>
        </div>

        <div className="h-full w-full" onClick={goToNextSlide}>
          <img
            src={slides[currentSlideIndex].imageUrl}
            alt={`Slide ${currentSlideIndex + 1}`}
            className="h-full w-full object-cover"
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>

        <div className="absolute bottom-20 left-4 right-4 text-white">
          <h2 className="text-2xl font-bold mb-2">{slides[currentSlideIndex].title}</h2>
          <p className="text-sm">{slides[currentSlideIndex].description}</p>
        </div>

        <div className="absolute bottom-4 left-4 right-4 flex justify-between">
          <button onClick={handleBookmark}>
            <img
              src={isBookmarked
                ? "https://img.icons8.com/ios-filled/50/228BE6/bookmark-ribbon.png"
                : "https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
              }
              alt="Bookmark"
              className="w-8 h-8"
            />
          </button>
          <button onClick={handleLiked} className="flex items-center">
            <img
              src={isLiked
                ? "https://img.icons8.com/ios-filled/50/FF0000/like--v1.png"
                : "https://img.icons8.com/ios-filled/50/FFFFFF/like--v1.png"
              }
              alt="Like"
              className="w-8 h-8 mr-2"
            />
            <span className="text-white">{totalLikes}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalMobile;
