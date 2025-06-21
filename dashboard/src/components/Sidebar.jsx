import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

// ✅ Correct and valid icon imports
import { TiHome } from "react-icons/ti";
import { RiLogoutBoxFill } from "react-icons/ri";
import { AiFillMessage } from "react-icons/ai";
import { GiHamburgerMenu } from "react-icons/gi";
import { FaUserMd } from "react-icons/fa"; // ✅ Doctor icon
import { MdAddModerator } from "react-icons/md";
import { IoPersonAddSharp } from "react-icons/io5";

import { Context } from "../main";

const Sidebar = () => {
  const [show, setShow] = useState(false);
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/v1/user/admin/logout",
        { withCredentials: true }
      );
      toast.success(data.message);
      setIsAuthenticated(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Logout failed");
    }
  };

  const navigateAndClose = (path) => {
    navigate(path);
    setShow(false);
  };

  if (!isAuthenticated) return null;

  return (
    <>
      <nav className={`sidebar ${show ? "show" : ""}`}>
        <div className="links">
          <TiHome title="Home" onClick={() => navigateAndClose("/")} />
          <FaUserMd title="Doctors" onClick={() => navigateAndClose("/doctors")} />
          <MdAddModerator title="Add Admin" onClick={() => navigateAndClose("/admin/addnew")} />
          <IoPersonAddSharp title="Add Doctor" onClick={() => navigateAndClose("/doctor/addnew")} />
          <AiFillMessage title="Messages" onClick={() => navigateAndClose("/messages")} />
          <RiLogoutBoxFill title="Logout" onClick={handleLogout} />
        </div>
      </nav>

      <div className="wrapper">
        <GiHamburgerMenu
          className="hamburger"
          onClick={() => setShow((prev) => !prev)}
        />
      </div>
    </>
  );
};

export default Sidebar;
