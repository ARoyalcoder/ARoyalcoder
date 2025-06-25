import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GiHamburgerMenu } from "react-icons/gi";
import axios from "axios";
import { toast } from "react-toastify";
import { Context } from "../main";

const Navbar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "https://aroyalcoder.onrender.com/api/v1/user/patient/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthenticated(false);
      setShowMenu(false);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const handleNavigateLogin = () => {
    navigate("/login");
    setShowMenu(false);
  };

  const toggleMenu = () => setShowMenu((prev) => !prev);

  return (
    <nav className="container">
      <div className="logo">
        <img src="/logo.png" alt="Logo" className="logo-img" />
      </div>

      <div className={`navLinks ${showMenu ? "showmenu" : ""}`}>
        <div className="links">
          <Link to="/" className="navbarLink" onClick={toggleMenu}>Home</Link>
          <Link to="/appointment" className="navbarLink" onClick={toggleMenu}>Appointment</Link>
          <Link to="/about" className="navbarLink" onClick={toggleMenu}>About Us</Link>
        </div>

        {isAuthenticated ? (
          <button className="logoutBtn btn" onClick={handleLogout}>
            LOGOUT
          </button>
        ) : (
          <button className="loginBtn btn" onClick={handleNavigateLogin}>
            LOGIN
          </button>
        )}
      </div>

      <div className="hamburger" onClick={toggleMenu}>
        <GiHamburgerMenu />
      </div>
    </nav>
  );
};

export default Navbar;
