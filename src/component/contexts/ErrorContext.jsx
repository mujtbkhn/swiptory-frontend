import React, { createContext, useContext, useState } from "react";

const ErrorContext = createContext();

export const useErrorContext = () => useContext(ErrorContext);

export const ErrorProvider = ({ children }) => {
  const [errorState, setErrorState] = useState(false);

  return (
    <ErrorContext.Provider value={{ errorState, setErrorState }}>
      {children}
    </ErrorContext.Provider>
  );
};
