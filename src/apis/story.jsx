import axios from "axios";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";
import Timer from "../utils/Timer";

const BACKEND_URL = "https://swiptory-backend-q19a.onrender.com";
// const BACKEND_URL = "http://localhost:3000";

const token = localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token);
    return decodedToken.userId;
  }
  return null;
};

const handleApiCall = async (apiCall) => {
  const loadingToast = toast.loading("Connecting to server...");
  
  try {
    const response = await Promise.race([
      apiCall(),
      new Promise((_, reject) =>
        setTimeout(() => reject(new Error("Server wake-up")), 5000)
      )
    ]);
    toast.dismiss(loadingToast);
    return response;
  } catch (error) {
    if (error.message === "Server wake-up") {
      toast.dismiss(loadingToast);
      
      return new Promise((resolve, reject) => {
        const toastId = toast.loading(
          (t) => (
            <span>
              Server is waking up. This may take up to 50 seconds...
              <Timer onTimeout={() => toast.dismiss(t.id)} />
            </span>
          ),
          { duration: Infinity }
        );

        apiCall()
          .then((response) => {
            toast.success('Server is ready!', { id: toastId });
            resolve(response);
          })
          .catch((err) => {
            toast.error('An error occurred while connecting to the server.', { id: toastId });
            reject(err);
          });
      });
    } else {
      toast.dismiss(loadingToast);
      toast.error("An error occurred while connecting to the server.");
      throw error;
    }
  }
};

export const createStory = async (slidesData) => {
  return handleApiCall(async () => {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/create`,
      { slides: slidesData },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.Story.slides;
  });
};

export const fetchStory = async () => {
  return handleApiCall(async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?category=all`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.stories;
  });
};

export const fetchStoryByCategory = async (category) => {
  return handleApiCall(async () => {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?category=${category}`,
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data.stories;
  });
};

export const fetchUserStories = async (userId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get?userId=${userId}`
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
export const getAllBookmarks = async () => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/getBookmarks`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const bookmark = async (slideId) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/bookmark/${slideId}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const like = async (slideId) => {
  try {
    const response = await axios.post(
      `${BACKEND_URL}/api/v1/stories/like/${slideId}`,
      {},
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const viewStoryByUserId = async (slideId, userId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}?userId=${userId}`
    );

    return response.data;
  } catch (error) {
    console.error("error fetching stories", error);
    throw error;
  }
};

export const viewStory = async (slideId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}`
    );

    return response.data;
  } catch (error) {
    console.error("error fetching stories", error);
    throw error;
  }
};

export const getStoryById = async (slideId) => {
  try {
    const response = await axios.get(
      `${BACKEND_URL}/api/v1/stories/get/${slideId}`
    );
    return response.data.story;
  } catch (error) {
    console.error("error fetching stories by Id", error);
  }
};

export const editStory = async (storyId, slides) => {
  try {
    const response = await axios.put(
      `${BACKEND_URL}/api/v1/stories/edit/${storyId}`,
      { slides: slides },
      {
        headers: {
          Authorization: `${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error Editing Stories", error);
  }
};
