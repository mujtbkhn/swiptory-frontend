import React, { useEffect, useState, useCallback, useRef } from "react";
import {
  bookmark,
  getUserIdFromToken,
  like,
  viewStoryByUserId,
} from "../../../../apis/story";
import toast from "react-hot-toast";
import { useEditableContext } from "../../../contexts/EditableContext";
import previous from "../../../../assets/previous.png";
import next from "../../../../assets/next.png";
import share from "../../../../assets/share.png";
import cross from "../../../../assets/cross.png";
import ProgressBar from "../../ProgressBar/ProgressBar";

const ModalDesk = ({ story, onClose }) => {
  if (!story) return null;

  const { slides, _id } = story;
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [totalLikes, setTotalLikes] = useState(0);
  const { setErrorState, setModal } = useEditableContext();
  const intervalRef = useRef(null);

  const userId = getUserIdFromToken();

  const resetInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    intervalRef.current = setInterval(() => {
      setCurrentSlideIndex((prevIndex) =>
        prevIndex === slides.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);
  }, [slides.length]);

  useEffect(() => {
    resetInterval();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [resetInterval]);

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
  }, [_id, userId, story]);

  const handleBookmark = async () => {
    if (userId) {
      const newBookmarkedStatus = !isBookmarked;
      setIsBookmarked(newBookmarkedStatus);
  
      try {
        await bookmark(story?._id);
      } catch (error) {
        setIsBookmarked(!newBookmarkedStatus);
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
      } catch (error) {
        setIsLiked(!newLikedStatus);
        setTotalLikes((prev) => prev - (newLikedStatus ? 1 : -1));
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
    resetInterval();
  };

  const goToNextSlide = () => {
    setCurrentSlideIndex((prevIndex) =>
      prevIndex === slides.length - 1 ? 0 : prevIndex + 1
    );
    resetInterval();
  };

  const handleView = async () => {
    try {
      const storyURL = `${window.location.origin}/view/${story._id}`;
      await navigator.clipboard.writeText(storyURL);
      toast.success("Link copied to clipboard", {
        style: {
          position: "relative",
          top: "10rem",
          color: "red",
          fontSize: "1.5rem",
        },
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
      <div className="relative flex items-center">
        <button
          className="absolute left-[-60px] p-2 text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
          onClick={goToPreviousSlide}
        >
          <img src={previous} alt="Back" className="w-8 h-8" />
        </button>

        <div className="relative h-[80vh] w-[350px] overflow-hidden rounded-lg shadow-lg bg-gray-900">
          <ProgressBar slides={slides.length} iteration={currentSlideIndex} />

          <div className="absolute z-20 flex justify-between top-4 left-4 right-4">
            <button onClick={onClose} className="transition-opacity duration-200 hover:opacity-75">
              <img src={cross} alt="Close" className="w-8 h-8" />
            </button>
            <button onClick={handleView} className="transition-opacity duration-200 hover:opacity-75">
              <img src={share} alt="Share" className="w-8 h-8" />
            </button>
          </div>

          <img
            src={slides[currentSlideIndex]?.imageUrl}
            alt={`Slide ${currentSlideIndex + 1}`}
            className="object-cover w-full h-full"
          />

          <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black opacity-60"></div>

          <div className="absolute text-white bottom-20 left-4 right-4">
            <h2 className="mb-2 text-2xl font-bold">{slides[currentSlideIndex]?.title}</h2>
            <p className="text-sm">{slides[currentSlideIndex]?.description}</p>
          </div>

          <div className="absolute flex items-center justify-between bottom-4 left-4 right-4">
            <button onClick={handleBookmark} className="transition-opacity duration-200 hover:opacity-75">
              <img
                src={isBookmarked
                  ? "https://img.icons8.com/ios-filled/50/228BE6/bookmark-ribbon.png"
                  : "https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
                }
                alt="Bookmark"
                className="w-8 h-8"
              />
            </button>
            <button onClick={handleLiked} className="flex items-center transition-opacity duration-200 hover:opacity-75">
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

        <button
          className="absolute right-[-60px] p-2 text-white hover:bg-gray-700 rounded-full transition-colors duration-200"
          onClick={goToNextSlide}
        >
          <img src={next} alt="Forward" className="w-8 h-8" />
        </button>
      </div>
    </div>
  );
};

export default ModalDesk;