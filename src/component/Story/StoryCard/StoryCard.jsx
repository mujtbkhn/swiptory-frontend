// StoryCard.js
import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalDesk from "../Modal/ModalDesktop/ModalDesk.jsx";
import ModalMobile from "../Modal/ModalMobile/ModalMobile.jsx";
import "./StoryCard.css";
import { useNavigate } from "react-router-dom";
import { useEditableContext } from "../../contexts/EditableContext.jsx";
import edit from "../../../assets/edit.png";

const StoryCard = ({ story, isUserStory }) => {
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [showModal, setShowModal] = useState(false);
  const { setEditStoryId, editable, setEditableState, modal, setModal } =
    useEditableContext();
  const toggleModal = () => {
    setShowModal(!showModal);
    setModal(true);
  };
  const firstSlide =
    story.slides && story.slides.length > 0 ? story.slides[0] : null;

  const handleEditBtn = (e) => {
    e.stopPropagation();
    setEditStoryId(story._id);
    setEditableState(true);
  };

  return (
    <>
      <div className="story__card" onClick={toggleModal}>
        {firstSlide && (
          <>
            <div className="image-overlay" />
            <img src={story?.slides[0]?.imageUrl} alt={`Slide 1`} />
            <div className="text__content">
              <h2>{story?.slides[0]?.title}</h2>
              <p>{story?.slides[0]?.description}</p>
            </div>
            {isUserStory && (
              <div onClick={handleEditBtn} className="edit-btn">
                <div style={{ position: "absolute", left: "1rem" }}>
                  <img src={edit} alt="" />
                </div>
                <button>Edit</button>
              </div>
            )}
          </>
        )}
      </div>
      {modal &&
        showModal &&
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
