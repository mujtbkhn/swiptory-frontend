import { useEffect, useState } from "react";

const ProgressBar = ({ slides, iteration }) => {
  const [width, setWidth] = useState(100);

  useEffect(() => {
    if (slides === 1) {
      setWidth(100);
    } else if (slides > 1) {
      setWidth(100 / slides);
    }
  }, [slides]);

  return (
    <div className="absolute top-0 left-0 z-10 flex w-full justify-evenly gap-2 px-1">
      {Array.from({ length: slides }, (_, index) => (
        <div
          key={index}
          className="h-2 flex-grow rounded-full bg-white bg-opacity-65"
          style={{ width: `${width}%` }}
        >
          <div
            className={`h-full rounded-full ${
              index === iteration
                ? "bg-black bg-opacity-80 animate-progress"
                : ""
            }`}
          ></div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
