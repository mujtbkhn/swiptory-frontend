import axios from "axios";
import toast from "react-hot-toast";

const BACKEND_URL = "https://swiptory-backend-q19a.onrender.com";
// const BACKEND_URL = "http://localhost:3000";

const handleAuthApiCall = async (apiCall) => {
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
      return toast.promise(
        apiCall(),
        {
          loading: 'Server is waking up. This may take up to 50 seconds...',
          success: 'Server is ready!',
          error: 'An error occurred while connecting to the server.'
        }
      );
    } else {
      toast.dismiss(loadingToast);
      throw error;
    }
  }
};

export const registerUser = async (username, password) => {
  try {
    const response = await handleAuthApiCall(async () => {
      const res = await axios.post(`${BACKEND_URL}/api/v1/auth/register`, {
        username,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      return res.data;
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      console.error(error);
      toast.error("An error occurred while registering.");
      throw new Error("An error occurred while registering.");
    }
  }
};

export const loginUser = async (username, password) => {
  try {
    const response = await handleAuthApiCall(async () => {
      const res = await axios.post(`${BACKEND_URL}/api/v1/auth/login`, {
        username,
        password,
      });
      const { token } = res.data;
      localStorage.setItem("token", token);
      return res.data;
    });
    return response;
  } catch (error) {
    if (error.response && error.response.status === 400) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    }
    if (error.response && error.response.status === 401) {
      toast.error(error.response.data.message);
      throw new Error(error.response.data.message);
    } else {
      console.error(error);
      toast.error("An error occurred while logging in.");
      throw new Error("An error occurred while logging in.");
    }
  }
};