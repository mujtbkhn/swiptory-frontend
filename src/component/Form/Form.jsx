import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../apis/auth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { USER_AVATAR } from "../../utils/constants";
import StoryAdd from "../Story/StoryForm/StoryAdd";
import { useEditableContext } from "../contexts/EditableContext";
import { Eye, EyeOff, Menu, X, Bookmark, LogOut, UserPlus, LogIn } from "lucide-react";

const Form = () => {
  const token = localStorage.getItem("token");
  const [register, setRegister] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isError, setIsError] = useState("");

  const [isAddStoryClicked, setIsAddStoryClicked] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const { errorState, setErrorState, setModal, editable, setEditableState } = useEditableContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (errorState) {
      setSignIn(true);
    }
  }, [errorState]);

  useEffect(() => {
    if (editable) {
      setIsAddStoryClicked(true);
    }
  }, [editable]);

  const handleCross = () => {
    setIsAddStoryClicked(false);
    setErrorState(false);
    setEditableState(false);
    setRegister(false);
    setUsername("");
    setPassword("");
    setIsError("");
    setSignIn(false);
  };

  const handleRegisterUser = async (event) => {
    event.preventDefault();
    try {
      if (!username) {
        setIsError("Username is missing");
        return;
      }
      if (username.trim().length < 5) {
        setIsError("Username must be greater than 5 letters");
        return;
      }
      if (!password) {
        setIsError("Password is missing");
        return;
      }

      setIsError("");

      const data = await registerUser(username, password);
      if (data.error) {
        setIsError(data.error);
        toast.error(data.error.message);
        return;
      }
      setRegister(false);
      setUsername(username);
      toast.success("Successfully Registered");
      localStorage.setItem("username", username);
      setShowMobileMenu(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };

  const handleSignInUser = async (event) => {
    event.preventDefault();

    try {
      if (!username) {
        setIsError("Username is missing");
        return;
      }
      if (!password) {
        setIsError("Password is missing");
        return;
      }

      setIsError("");

      const data = await loginUser(username, password);
      if (data.error) {
        setIsError(data.error);
        toast.error(data.error.message);
        return;
      }
      setSignIn(false);
      setUsername(username);
      toast.success("Successfully Logged In");
      localStorage.setItem("username", username);
      setShowMobileMenu(false);
      window.location.reload();
    } catch (error) {
      console.error(error);
      setIsError(error.message);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Successfully logged out");
    setUsername("");
    setShowMobileMenu(false);
    window.location.reload();
  };

  return (
    <div className="bg-white">
      <nav className="container flex items-center justify-between px-4 py-4 mx-auto">
        <h1 className="text-2xl font-bold cursor-pointer" onClick={() => navigate("/")}>
          SwipTory
        </h1>
        {isSmallScreen ? (
          <>
            <Menu className="cursor-pointer" onClick={() => setShowMobileMenu(true)} />
            {showMobileMenu && (
              <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                <div className="flex flex-col w-64 h-full p-4 bg-white">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-bold">{token ? username : "Menu"}</h2>
                    <X className="cursor-pointer" onClick={() => setShowMobileMenu(false)} />
                  </div>
                  {token ? (
                    <>
                      <button
                        className="px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => navigate("/your-story")}
                      >
                        Your Story
                      </button>
                      <button
                        className="px-4 py-2 mb-4 text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => setIsAddStoryClicked(true)}
                      >
                        Add Story
                      </button>
                      <button
                        className="flex items-center px-4 py-2 mb-4 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                        onClick={() => navigate("/bookmarks")}
                      >
                        <Bookmark className="mr-2" /> Bookmarks
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                        onClick={handleLogout}
                      >
                        <LogOut className="mr-2" /> Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="flex items-center px-4 py-2 mb-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                        onClick={() => setSignIn(true)}
                      >
                        <LogIn className="mr-2" /> Login
                      </button>
                      <button
                        className="flex items-center px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                        onClick={() => setRegister(true)}
                      >
                        <UserPlus className="mr-2" /> Register
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex items-center">
            {token ? (
              <>
                <button
                  className="flex items-center px-4 py-2 mr-4 text-white bg-yellow-500 rounded hover:bg-yellow-600"
                  onClick={() => navigate("/bookmarks")}
                >
                  <Bookmark className="mr-2" /> Bookmarks
                </button>
                <button
                  className="px-4 py-2 mr-4 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={() => setIsAddStoryClicked(true)}
                >
                  Add Story
                </button>
                <div className="relative group">
                  <img
                    src={USER_AVATAR}
                    alt="User Avatar"
                    className="w-10 h-10 rounded-full cursor-pointer"
                  />
                  <div className="absolute right-0 hidden w-48 mt-0 bg-white rounded-md shadow-lg group-hover:block">
                    <div className="py-1">
                      <h1 className="px-4 py-2 mx-auto text-3xl text-red-700">{username}</h1>
                      <button
                        onClick={handleLogout}
                        className="block w-full px-4 py-2 text-xl text-left text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  className="px-4 py-2 mr-4 text-white bg-blue-500 rounded hover:bg-blue-600"
                  onClick={() => setRegister(true)}
                >
                  Register Now
                </button>
                <button
                  className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  onClick={() => setSignIn(true)}
                >
                  Sign In
                </button>
              </>
            )}
          </div>
        )}
      </nav>

      {(register || signIn) && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md p-8 bg-white rounded-lg">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">
                {register ? "Register to SwipTory" : "Login to SwipTory"}
              </h2>
              <X className="cursor-pointer" onClick={handleCross} />
            </div>
            <form onSubmit={register ? handleRegisterUser : handleSignInUser}>
              <div className="mb-4">
                <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter your Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </div>
              <div className="relative mb-4">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                  placeholder="Enter your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-sm leading-5"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-6 h-6 text-gray-500" /> : <Eye className="w-6 h-6 text-gray-500" />}
                </button>
              </div>
              {isError && <p className="mb-4 text-sm text-red-500">{isError}</p>}
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                {register ? "Register" : "Log In"}
              </button>
            </form>
          </div>
        </div>
      )}

      {isAddStoryClicked && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <StoryAdd onCloseModal={handleCross} />
        </div>
      )}
    </div>
  );
};

export default Form;