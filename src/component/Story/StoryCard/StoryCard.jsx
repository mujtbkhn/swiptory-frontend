import React, { useState } from "react";
import { useSelector } from "react-redux";
import ModalDesk from "../Modal/ModalDesktop/ModalDesk.jsx";
import ModalMobile from "../Modal/ModalMobile/ModalMobile.jsx";
import { useEditableContext } from "../../contexts/EditableContext.jsx";
import { Pencil } from "lucide-react";

const StoryCard = ({ story, isUserStory }) => {
  const { isSmallScreen } = useSelector((state) => state.layout);
  const [showModal, setShowModal] = useState(false);
  const { setEditStoryId, setEditableState, modal, setModal } = useEditableContext();

  const toggleModal = () => {
    setShowModal(!showModal);
    setModal(true);
  };

  const firstSlide = story.slides && story.slides.length > 0 ? story.slides[0] : null;

  const handleEditBtn = (e) => {
    e.stopPropagation();
    setEditStoryId(story._id);
    setEditableState(true);
  };

  return (
    <>
      <div 
        className="relative overflow-hidden transition-transform duration-300 rounded-lg shadow-lg cursor-pointer hover:scale-105"
        onClick={toggleModal}
      >
        {firstSlide && (
          <>
            <div className="absolute inset-0 bg-black opacity-40" />
            <img 
              src={story?.slides[0]?.imageUrl} 
              alt={`Slide 1`}
              className="object-cover w-full h-96" // Updated height to h-80
            />
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="mb-2 text-xl font-bold">{story?.slides[0]?.title}</h2>
              <p className="text-sm">{story?.slides[0]?.description}</p>
            </div>
            {isUserStory && (
              <div 
                onClick={handleEditBtn}
                className="absolute p-2 bg-white rounded-full shadow-md top-2 right-2"
              >
                <Pencil size={20} color="black" />
              </div>
            )}
          </>
        )}
      </div>
      {modal && showModal && (
        isSmallScreen ? (
          <ModalMobile story={story} onClose={toggleModal} />
        ) : (
          <ModalDesk story={story} onClose={toggleModal} />
        )
      )}
    </>
  );
};

export default StoryCard;