import { createContext, useContext, useState } from "react";

const EditableContext = createContext();

export const useEditableContext = () => {
  return useContext(EditableContext);
};

export const EditableProvider = ({ children }) => {
  const [editable, setEditable] = useState(false);
  const [storyId, setStoryId] = useState(null);
  const [errorState, setErrorState] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("all");

  const setEditableState = (state) => {
    setEditable(state);
  };
  const setEditStoryId = (id) => {
    setStoryId(id);
  };
  return (
    <EditableContext.Provider
      value={{
        editable,
        storyId,
        setEditableState,
        setEditStoryId,
        errorState,
        setErrorState,
        selectedCategory,
        setSelectedCategory,
      }}
    >
      {children}
    </EditableContext.Provider>
  );
};
