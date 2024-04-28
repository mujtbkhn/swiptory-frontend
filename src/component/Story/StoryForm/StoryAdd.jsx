import React, { useEffect, useState } from "react";
import { createStory, editStory, getStoryById } from "../../../apis/story";
import toast from "react-hot-toast";
import StoryForm from "./StoryForm";
import "./StoryForm.css";
import { useParams } from "react-router-dom";
import { useEditableContext } from "../../contexts/EditableContext";
import { useSelector } from "react-redux";

const StoryAdd = ({ onCloseModal }) => {
  const [cross, setCross] = useState(false);

  const { isSmallScreen } = useSelector((state) => state.layout);
  const { editable, storyId, setEditableState, setEditStoryId } =
    useEditableContext();
  // const { storyId } = useParams();
  // console.log(storyId);
  const initialSlide = {
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  };

  const [slides, setSlides] = useState([
    initialSlide,
    initialSlide,
    initialSlide,
  ]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [error, setError] = useState("");

  useEffect(() => {
    if (storyId) {
      const fetchStoryData = async () => {
        try {
          const fetchData = await getStoryById(storyId);
          if (fetchData && fetchData.slides) {
            setSlides(fetchData.slides);
            // console.log(slides)
          }
        } catch (error) {
          console.error("error fetching story by id", error);
        }
      };
      fetchStoryData();
    }
  }, [storyId]);
  useEffect(() => {
    setCurrentSlide(currentSlide);
  }, [currentSlide]);

  useEffect(() => {
    if (slides.length > 6) {
      alert("Please remove slides");
    }
    if (slides.length < 3) {
      alert("Please add slides");
    }
  }, [slides]);

  const handleValidate = (name, value) => {
    if (name === "category" && value === "") {
      setError("Please select a category");
    } else if (name === "imageUrl" && value == "") {
      setError("Please add an image url");
    } else if (name === "description" && value == "") {
      setError("Please add a description");
    } else if (name === "title" && value == "") {
      setError("Please add a title");
    } else {
      setError("");
    }
  };

  const handleChange = (e, index) => {
    const { name, value } = e.target;

    handleValidate(name, value);

    setSlides((prevSlides) =>
      prevSlides.map((slide, i) =>
        i === index ? { ...slide, [name]: value } : slide
      )
    );
  };

  const handleSubmit = async () => {
    try {
      // Check validation in the slides
      const isValid = slides.some((slide, index) => {
        if (
          Object.keys(slide).length === 0 ||
          slide.title?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        ) {
          setError(slide, index);
        }
        return (
          Object.keys(slide).length === 0 ||
          slide.title?.trim() === "" ||
          slide.description?.trim() === "" ||
          slide.imageUrl?.trim() === "" ||
          slide.category?.trim() === ""
        );
      });

      if (isValid) {
        setError("Please fill out all fields");
        return;
      }

      if (slides.length < 3) {
        setError("Please add at least 3 slides");
        return;
      } else if (slides.length > 6) {
        setError("Please remove slides");
        return;
      }

      if (storyId) {
        const responseData = await editStory(storyId, slides);
        console.log("story edited", responseData);
        if (responseData) {
          toast.success("Story edited successfully");
          onCloseModal();
          window.location.reload();
        } else {
          toast.error("error occurred while editing");
        }
      } else {
        const responseData = await createStory(slides);
        console.log(responseData);
        if (responseData) {
          toast.success("Story created successfully");
          onCloseModal();
          window.location.reload();
        } else {
          toast.error("error occurred while creating");
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("Error creating story");
      // setLoading(false);
    }
  };

  const handleAddSlide = () => {
    if (slides.length < 6) {
      setSlides((prevSlides) => [...prevSlides, {}]);
      setCurrentSlide(slides.length);
      setCross(true);
    }
  };

  const handleRemoveSlide = (index) => {
    if (slides && slides.length > 3) {
      setSlides((prevSlides) => prevSlides.filter((_, i) => i !== index));
      handlePrevClick();
    }
  };

  const handlePrevClick = () => {
    setCurrentSlide(currentSlide > 0 ? currentSlide - 1 : 0);
  };
  const handleNextClick = () => {
    setCurrentSlide(
      currentSlide < slides.length - 1 ? currentSlide + 1 : slides.length - 1
    );
  };
  return (
    <div className={isSmallScreen ? "story_form_mobile" : "story_form"}>
      {/* <div className={"storySlide__container"}>
        {slides.map((slide, index) => (
          <div
            key={index}
            className={"slide_box"}
            onClick={() => setCurrentSlide(index)}
          >
            slide {index + 1}
          </div>
        ))}
        <div
          className={"slide_box"}
          onClick={handleAddSlide}
          style={{ cursor: "pointer" }}
        >
          Add +
        </div>
      </div> */}
      <svg
        className={"story_close"}
        onClick={onCloseModal}
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 0C5.38341 0 0 5.38341 0 12C0 18.6166 5.38341 24 12 24C18.6166 24 24 18.6166 24 12C24 5.38341 18.6166 0 12 0ZM12 1.84615C17.6178 1.84615 22.1538 6.38221 22.1538 12C22.1538 17.6178 17.6178 22.1538 12 22.1538C6.38221 22.1538 1.84615 17.6178 1.84615 12C1.84615 6.38221 6.38221 1.84615 12 1.84615ZM8.50962 7.18269L7.18269 8.50962L10.6731 12L7.18269 15.4904L8.50962 16.8173L12 13.3269L15.4904 16.8173L16.8173 15.4904L13.3269 12L16.8173 8.50962L15.4904 7.18269L12 10.6731L8.50962 7.18269Z"
          fill="#FF0000"
        />
      </svg>
      <div className={"slideForm__container"}>
        {slides.map((slide, slideIndex) => (
          <>
            {slideIndex === currentSlide && (
              <StoryForm
                key={slideIndex}
                slide={slide}
                slideIndex={slideIndex}
                handleChange={(e) => handleChange(e, slideIndex)}
                handleRemoveSlide={() => handleRemoveSlide(slideIndex)}
              />
            )}
          </>
        ))}
      </div>

      <span className={"form_err"}>{error}</span>

      <div className={"buttons"}>
        <button
          onClick={handlePrevClick}
          style={{ backgroundColor: "#7eff73" }}
        >
          Previous
        </button>
        <button
          onClick={handleNextClick}
          style={{ backgroundColor: "#73abff" }}
        >
          Next
        </button>
        {slides.length > 3 ? (
          <button
            onClick={() => handleRemoveSlide(currentSlide)}
            style={{ backgroundColor: "#ff73b5" }}
          >
            Remove
          </button>
        ) : (
          <div style={{ width: "30%" }}></div>
        )}

        <button onClick={handleSubmit} style={{ backgroundColor: "#FF7373" }}>
          Post
        </button>
      </div>
    </div>
  );
};

export default StoryAdd;
