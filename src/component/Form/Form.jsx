import React, { useEffect, useState } from "react";
import "./Form.css";
import { USER_AVATAR } from "../../utils/constants";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../../apis/auth";
import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import StoryAdd from "../Story/StoryForm/StoryAdd";
import { useEditableContext } from "../contexts/EditableContext";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

const Form = () => {
  const token = localStorage.getItem("token");
  const [register, setRegister] = useState(false);
  const [signIn, setSignIn] = useState(false);
  const [username, setUsername] = useState(
    localStorage.getItem("username") || ""
  );
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);
  const [hamburger, setHamburger] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [isError, setIsError] = useState("");

  const [isAddStoryClicked, setIsAddStoryClicked] = useState(false);
  const { isSmallScreen } = useSelector((state) => state.layout);
  const { errorState, setErrorState, setModal, editable, setEditableState } = useEditableContext();

  const navigate = useNavigate();

  useEffect(() => {
    if (errorState) {
      console.log("errorState is true", errorState);
      setSignIn(true);
    }
  }, [errorState]);

  useEffect(() => {
    if (editable) {
      console.log("editable is true", editable);
      setIsAddStoryClicked(true);
    }
  }, [editable]);

  const handleCross = () => {
    setIsAddStoryClicked(false);
    setErrorState(false);
    setEditableState(false)
    // setModal(true);
    console.log("errorState after setting to false:", errorState); // Debugging statement
    setRegister(false);
    setUsername("");
    setPassword("");
    setIsError("");
    setSignIn(false);
    console.log("errorState after all state updates:", errorState); // Debugging statement
  };

  const handleCrossBig = () => {
    setShowMobileMenu(false);
    setIsAddStoryClicked(false);
    setRegister(false);
    setPassword("");
    setIsError("");
    setSignIn(false);
  };

  const handleRegister = () => {
    setRegister(true);
  };
  const handleRegisterUser = async (event) => {
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
  const handleSignIn = () => {
    setSignIn(true);
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
      setIsError(error);
    }
  };

  const handleShowBookmark = () => {
    navigate("/bookmarks");
  };
  const handleAddStory = () => {
    setIsAddStoryClicked(true);
    setShowMobileMenu(false);
  };
  const handleHamburger = () => {
    setHamburger((prev) => !prev);
  };
  const handleMobileHamburger = () => {
    setShowMobileMenu(true);
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    toast.success("Successfully logout");
    setUsername("");
    setHamburger(false);
    setShowMobileMenu(false);
    window.location.reload();
  };

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const handleHome = () => {
    navigate("/");
  };

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  return (
    <div>
      <div className="navbar__main">
        <div className="navbar__left">
          <h1 style={{ cursor: "pointer" }} onClick={handleHome}>
            SwipTory
          </h1>
        </div>
        {isSmallScreen ? (
          <>
            {token ? (
              <>
                <img
                  src="https://img.icons8.com/ios-filled/50/1A1A1A/menu--v6.png"
                  alt=""
                  className="hamburger"
                  onClick={handleMobileHamburger}
                />
                {showMobileMenu && (
                  <div className="mobile__menu">
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        gap: "2rem",
                      }}
                    >
                      <div style={{ display: "flex", gap: "1rem" }}>
                        <img
                          className="user__avatar"
                          src={USER_AVATAR}
                          alt=""
                        />
                        <h1>{username}</h1>
                      </div>
                      <div className="crossContainer">
                        <img
                          src="https://img.icons8.com/ios-filled/50/multiply.png"
                          alt=""
                          className="cross__big"
                          onClick={handleCrossBig}
                        />
                      </div>
                    </div>
                    <button
                      className="btn__add__story"
                      onClick={() => navigate("/your-story")}
                    >
                      Your Story
                    </button>
                    <button
                      className="btn__add__story"
                      onClick={handleAddStory}
                    >
                      Add Story
                    </button>
                    <button
                      className="btn__bookmark"
                      onClick={handleShowBookmark}
                    >
                      <img
                        width="30px"
                        src="https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
                        alt=""
                      />
                      Bookmarks
                    </button>
                    <button className="btn__add__story" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                )}
              </>
            ) : (
              <>
                <img
                  src="https://img.icons8.com/ios-filled/50/1A1A1A/menu--v6.png"
                  alt=""
                  className="hamburger"
                  onClick={handleMobileHamburger}
                />

                {showMobileMenu && (
                  <div className="mobile__menu">
                    <div className="crossContainer">
                      <img
                        src="https://img.icons8.com/ios-filled/50/multiply.png"
                        alt=""
                        className="cross__big"
                        onClick={handleCrossBig}
                      />
                    </div>
                    <button className="btn__register" onClick={handleSignIn}>
                      Login
                    </button>
                    <button className="btn__register" onClick={handleRegister}>
                      Register
                    </button>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            {token ? (
              <div className="navbar__right">
                <button className="btn__bookmark" onClick={handleShowBookmark}>
                  <img
                    width="30px"
                    src="https://img.icons8.com/ios-filled/50/FFFFFF/bookmark-ribbon.png"
                    alt=""
                  />
                  Bookmarks
                </button>
                <button className="btn__add__story" onClick={handleAddStory}>
                  Add Story
                </button>
                <img className="user__avatar" src={USER_AVATAR} alt="" />
                <img
                  src="https://img.icons8.com/ios-filled/50/1A1A1A/menu--v6.png"
                  alt=""
                  className="hamburger"
                  onClick={handleHamburger}
                />
                <div className={hamburger ? "logOut" : "hidden"}>
                  <h1>{username}</h1>
                  <button onClick={handleLogout}>Logout</button>
                </div>
              </div>
            ) : (
              <div className="navbar__right">
                <button className="btn__register" onClick={handleRegister}>
                  Register Now
                </button>
                <button className="btn__signIn" onClick={handleSignIn}>
                  Sign In
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {register && (
        <div className="modal-container">
          <form className={isSmallScreen ? "form__mobile" : "form"}>
            <div>
              <div className="crossContainer">
                <img
                  src="https://img.icons8.com/ios/50/FA5252/circled-x.png"
                  alt=""
                  className="cross"
                  onClick={handleCross}
                />
              </div>
              <h1>Register to SwipTory</h1>
            </div>
            <div className="form__fields">
              <h1>Username</h1>
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form__fields">
              <h1>Password</h1>
              <input
                type={type}
                name="password"
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="eye-span" onClick={handleToggle}>
                <Icon className="eye-icon" icon={icon} size={25} />
              </span>
            </div>
            {isError && <p style={{ color: "black" }}>{isError}</p>}
            <div className="form__btn">
              <button onClick={handleRegisterUser}>Register</button>
            </div>
          </form>
        </div>
      )}
      {signIn && (
        <div className="modal-container">
          <form className={isSmallScreen ? "form__mobile" : "form"}>
            <div>
              <div className="crossContainer">
                <img
                  src="https://img.icons8.com/ios/50/FA5252/circled-x.png"
                  alt=""
                  className="cross"
                  onClick={handleCross}
                />
              </div>
              <h1>Login to SwipTory</h1>
            </div>
            <div className="form__fields">
              <h1>Username</h1>
              <input
                type="text"
                placeholder="Enter your Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="form__fields">
              <h1>Password</h1>
              <input
                type={type}
                placeholder="Enter your Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <span className="eye-span" onClick={handleToggle}>
                <Icon className="eye-icon" icon={icon} size={25} />
              </span>
            </div>
            {isError && <p style={{ color: "black" }}>{isError}</p>}
            <div className="form__btn">
              <button onClick={handleSignInUser}>Log In</button>
            </div>
          </form>
        </div>
      )}
      {isAddStoryClicked && <StoryAdd onCloseModal={handleCross} />}
    </div>
  );
};

export default Form;
