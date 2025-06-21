import React, { useContext, useState } from "react";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

const AddNewAdmin = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dob: "",
    gender: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => {
    const { firstName, lastName, email, phone, gender, password } = form;
    return firstName && lastName && email && phone && gender && password;
  };

  const handleAddNewAdmin = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fill all required fields.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:5000/api/v1/user/admin/addnew",
        form,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setIsAuthenticated(true);
      navigate("/");

      // Clear form
      setForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dob: "",
        gender: "",
        password: "",
      });
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to register admin";
      toast.error(message);
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="page">
      <section className="container form-component add-admin-form">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            marginBottom: "1rem",
          }}
        >
          <img
            src="/logo.png"
            alt="logo"
            className="logo"
            style={{ height: "200px", width: "auto" }}
          />
          <h1
            className="form-title"
            style={{
              margin: 0,
              fontSize: "30px",
              fontWeight: "bold",
              textAlign: "right",
            }}
          >
            REGISTER A NEW ADMIN
          </h1>
        </div>

        <form onSubmit={handleAddNewAdmin}>
          <div>
            <input
              type="text"
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
            <input
              type="tel"
              name="phone"
              placeholder="Mobile Number"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <select
              name="gender"
              value={form.gender}
              onChange={handleChange}
              required
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div>
            <input
              type="date"
              name="dob"
              placeholder="Date of Birth"
              value={form.dob}
              onChange={handleChange}
            />
          </div>
          <div style={{ justifyContent: "center", alignItems: "center" }}>
            <button type="submit">ADD NEW ADMIN</button>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewAdmin;
