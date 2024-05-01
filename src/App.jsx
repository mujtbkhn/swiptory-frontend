import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Bookmark from "./pages/Bookmark/Bookmark";
import Homepage from "./pages/Homepage/Homepage";
import StoryPage from "./component/Story/StoryPage/StoryPage";
import { Toaster } from "react-hot-toast";
import { EditableProvider } from "./component/contexts/EditableContext.jsx";
import YourStoryMob from "../src/component/Story/YourStoryMob.jsx";
import { useSelector } from "react-redux";
import NotFound from "./pages/NotFound.jsx";

function App() {
  const { isSmallScreen } = useSelector((state) => state.layout);

  return (
    <EditableProvider>
      <BrowserRouter>
        <Toaster position="top-center" />
        <Routes>
          <Route path="/" element={<Homepage />} />
          <Route path="/bookmarks" element={<Bookmark />} />
          {isSmallScreen && (
            <Route path="/your-story" element={<YourStoryMob />} />
          )}
          <Route path="/view/:slideId" element={<StoryPageWrapper />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </EditableProvider>
  );
}

export default App;

const StoryPageWrapper = () => {
  const { slideId } = useParams();
  return <StoryPage slideId={slideId} />;
};
