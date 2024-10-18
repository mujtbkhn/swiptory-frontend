import React, { Suspense, lazy } from "react";
import Loader from "../../utils/Loader";

const Form = lazy(() => import("../../component/Form/Form"));
const Stories = lazy(() => import("../../component/Story/Stories/Stories"));
const Categories = lazy(() => import("../../component/Categories/Categories"));

const Homepage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Suspense fallback={<div className="flex items-center justify-center flex-grow"><Loader /></div>}>
        <div className="z-20">
          <Form />
        </div>
        <main className="z-10 flex-grow bg-gray-100 ">
          <div className="container px-4 py-8 mx-auto space-y-8">
            <Categories />
            <Stories />
          </div>
        </main>
      </Suspense>
    </div>
  );
};

export default Homepage;