// App.js
import React from "react";
import { BrowserRouter, Routes, Route, useParams } from "react-router-dom";
import Bookmark from "./pages/Bookmark/Bookmark";
import Homepage from "./pages/Homepage/Homepage";
import StoryPage from "./component/Story/StoryPage/StoryPage";
import { Toaster } from "react-hot-toast";
import StoryAdd from "./component/Story/StoryForm/StoryAdd";
import { ErrorProvider } from "./component/contexts/ErrorContext.jsx";
import { EditableProvider } from "./component/contexts/EditableContext.jsx";

function App() {
  return (
    <EditableProvider>
      <ErrorProvider>
        <BrowserRouter>
          <Toaster position="top-center" />
          <Routes>
            <Route path="/" element={<Homepage />} />
            <Route path="/test/:storyId" element={<StoryAdd />} />
            <Route path="/bookmarks" element={<Bookmark />} />
            <Route path="/view/:slideId" element={<StoryPageWrapper />} />
          </Routes>
        </BrowserRouter>
      </ErrorProvider>
    </EditableProvider>
  );
}

export default App;

const StoryPageWrapper = () => {
  const { slideId } = useParams();
  return <StoryPage slideId={slideId} />;
};
