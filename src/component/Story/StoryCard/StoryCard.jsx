// StoryCard.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalDesk from "../Modal/ModalDesktop/ModalDesk.jsx";
import ModalMobile from "../Modal/ModalMobile/ModalMobile.jsx";
import "./StoryCard.css";
import { useNavigate } from "react-router-dom";
import { useEditableContext } from "../../contexts/EditableContext.jsx";

const StoryCard = ({ story, isUserStory }) => {
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [showModal, setShowModal] = useState(false);
  const { setEditStoryId,editable, setEditableState, modal, setModal } = useEditableContext(); 
  const toggleModal = () => {
    setShowModal(!showModal);
    setModal(true)
  };
  const firstSlide =
    story.slides && story.slides.length > 0 ? story.slides[0] : null;

  const handleEditBtn = (e) => {
    e.stopPropagation()
    setEditStoryId(story._id);
    setEditableState(true); 
    console.log(editable); 
  };

  return (
    <>
      <div className="story__card" onClick={toggleModal}>
        {firstSlide && (
          <>
            <img src={story?.slides[0]?.imageUrl} alt={`Slide 1`} />
            <div className="text__content">
              <h2>{story?.slides[0]?.title}</h2>
              <p>{story?.slides[0]?.description}</p>
            </div>
            {!isSmallScreen && isUserStory &&(
              <div onClick={handleEditBtn} className="edit-btn">
                <button>Edit</button>
              </div>
            )}
          </>
        )}
      </div>
      {modal && showModal &&
        (isSmallScreen ? (
          <>
            {" "}
            <ModalMobile story={story} onClose={toggleModal} />
          </>
        ) : (
          <>
            <ModalDesk story={story} onClose={toggleModal} />{" "}
          </>
        ))}
    </>
  );
};

export default StoryCard;
