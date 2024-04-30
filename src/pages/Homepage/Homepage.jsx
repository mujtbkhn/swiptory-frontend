import React from "react";
import Form from "../../component/Form/Form";
import Stories from "../../component/Story/Stories/Stories";
import Categories from "../../component/Categories/Categories";

const Homepage = () => {
  return (
    <>
      <div>
        <Form />
        <Categories />
        <Stories />
      </div>
    </>
  );
};

export default Homepage;
