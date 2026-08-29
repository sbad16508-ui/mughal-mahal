import "bootstrap/dist/css/bootstrap.min.css";
import "./Navbar.css";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginModal from "../LoginModal";
import { MdKingBed, MdRestaurant, MdMovie, MdMeetingRoom, MdCake, MdContactMail, MdBookOnline } from "react-icons/md";
import logo from "../../assets/Mediacenter/ItemsImages/logo.png";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api";

function Navbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [redirectAfterLogin, setRedirectAfterLogin] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profileOpen, setProfileOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const nav = document.querySelector(".animated-navbar");

    const handleScroll = () => {
      if (window.scrollY > 40) {
        nav.classList.add("navbar-scrolled");
      } else {
        nav.classList.remove("navbar-scrolled");
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedProfile = localStorage.getItem("bookingUserProfile");
    if (storedProfile) {
      setProfile(JSON.parse(storedProfile));
    }

    const handleProfileChange = (event) => {
      setProfile(event.detail || null);
    };

    const handleStorage = (event) => {
      if (event.key === "bookingUserProfile") {
        setProfile(event.newValue ? JSON.parse(event.newValue) : null);
      }
      if (event.key === "bookingUser" && !event.newValue) {
        setProfile(null);
      }
    };

    const handleOpenLoginModal = () => {
      setRedirectAfterLogin(false);
      setShowLogin(true);
    };

    window.addEventListener("bookingUserProfileChanged", handleProfileChange);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("openLoginModal", handleOpenLoginModal);

    return () => {
      window.removeEventListener("bookingUserProfileChanged", handleProfileChange);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("openLoginModal", handleOpenLoginModal);
    };
  }, []);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!profileOpen) return;
      const wrapper = document.querySelector(".profile-menu-wrapper");
      if (wrapper && !wrapper.contains(event.target)) {
        setProfileOpen(false);
      }
    };

    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, [profileOpen]);

  const handleBookNowClick = () => {
    if (profile) {
      navigate("/book-now");
      return;
    }
    setRedirectAfterLogin(true);
    setShowLogin(true);
  };

  const handleLoginSuccess = (user) => {
    setShowLogin(false);
    setProfile(user || JSON.parse(localStorage.getItem("bookingUserProfile") || "null"));
    if (redirectAfterLogin) {
      navigate("/book-now");
      setRedirectAfterLogin(false);
    }
  };

  const handleLoginClick = () => {
    setRedirectAfterLogin(false);
    setShowLogin(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("bookingUser");
    localStorage.removeItem("bookingUserProfile");
    window.dispatchEvent(new CustomEvent("bookingUserProfileChanged", { detail: null }));
    setProfile(null);
    setProfileOpen(false);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg bg-white py-3 shadow-sm animated-navbar">
      <div className="container">
        <a href="/" className="hotel-logo">
          <img src={logo} alt="Mughal Mahal Logo" />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navMenu"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            {[
              { name: "Rooms", link: "/rooms", icon: MdKingBed },
              { name: "Dining", link: "/dining", icon: MdRestaurant },
              { name: "Redbox", link: "/redbox", icon: MdMovie },
              { name: "Conference Room", link: "/conferenceRoom", icon: MdMeetingRoom },
              { name: "Banquet", link: "/banquet", icon: MdCake },
              { name: "Contact", link: "/contact", icon: MdContactMail },
            ].map((item, index) => {
              const IconComponent = item.icon;
              if (item.name === "Dining") {
                return (
                  <li
                    className="nav-item dropdown nav-animate nav-icon-item"
                    style={{ animationDelay: `${index * 0.1}s` }}
                    key={item.name}
                  >
                    <a
                      className="nav-link nav-icon-link dropdown-toggle"
                      href={item.link}
                      id="diningDropdown"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      <IconComponent className="nav-icon" />
                      <span className="nav-text">{item.name}</span>
                    </a>
                    <ul className="dropdown-menu" aria-labelledby="diningDropdown">
                      <li><a className="dropdown-item" href="/dining/anarkali">Anarkali</a></li>
                      <li><a className="dropdown-item" href="/dining/koh-i-noor">Koh-i-Noor</a></li>
                      <li><a className="dropdown-item" href="/dining/diwan-e-khas">Diwan-e-Khas</a></li>
                      <li><a className="dropdown-item" href="/dining/little-china">Little China</a></li>
                      <li><a className="dropdown-item" href="/dining/wild-safar">Wild Safar</a></li>
                      <li><a className="dropdown-item" href="/dining/rooftop-buffet">Rooftop Buffet</a></li>
                    </ul>
                  </li>
                );
              }

              return (
                <li
                  className="nav-item nav-animate nav-icon-item"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  key={item.name}
                >
                  <a className="nav-link nav-icon-link" href={item.link} title={item.name}>
                    <IconComponent className="nav-icon" />
                    <span className="nav-text">{item.name}</span>
                  </a>
                </li>
              );
            })}

            <li
              className="nav-item ms-lg-3 nav-animate book-item"
              style={{ animationDelay: "0.7s" }}
            >
              <button
                type="button"
                className="btn book-btn px-4"
                id="bookNowButton"
                onClick={handleBookNowClick}
              >
                Book Now
              </button>
            </li>
            <li
              className="nav-item ms-lg-3 nav-animate login-item"
              style={{ animationDelay: "0.8s" }}
            >
              {profile ? (
                <div className="profile-menu-wrapper">
                  <button
                    type="button"
                    className="btn book-btn px-4 profile-menu-button"
                    onClick={() => setProfileOpen((prev) => !prev)}
                  >
                    {profile.profileImage ? (
                      <img
                        src={`${(import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/api$/, "")}/uploads/profile/${profile.profileImage}`}
                        alt="Profile"
                        className="profile-menu-avatar"
                      />
                    ) : null}
                    <span>{profile.firstName || profile.username}</span>
                  </button>
                  {profileOpen && (
                    <div className="profile-dropdown-menu">
                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={() => {
                          setProfileOpen(false);
                          navigate("/profile");
                        }}
                      >
                        View profile
                      </button>
                      <button
                        type="button"
                        className="profile-dropdown-item"
                        onClick={handleLogout}
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  className="btn book-btn px-4"
                  id="loginButton"
                  onClick={handleLoginClick}
                >
                  Login
                </button>
              )}
            </li>
            <LoginModal
              show={showLogin}
              onClose={() => setShowLogin(false)}
              onLogin={handleLoginSuccess}
            />
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
