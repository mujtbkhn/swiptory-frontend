import React from "react";
import Form from "../../component/Form/Form";
import StoryMainCard from "../../component/Story/StoryMainCard/StoryMainCard";
import Categories from "../../component/Categories/Categories";

const Homepage = () => {
  return (
    <>
      <div>
        <Form />
        <Categories />
        <StoryMainCard />

      </div>
    </>
  );
};

export default Homepage;
