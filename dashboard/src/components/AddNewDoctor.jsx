import React, { useContext, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Context } from "../main";

const departments = [
  "Pediatrics", "Homeopathy", "Orthopedics", "Cardiology",
  "Neurology", "Oncology", "Radiology", "Physical Therapy",
  "Dermatology", "ENT"
];

const AddNewDoctor = () => {
  const { isAuthenticated, setIsAuthenticated } = useContext(Context);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    dob: "", gender: "", password: "", doctorDepartment: ""
  });

  const [docAvatar, setDocAvatar] = useState(null);
  const [preview, setPreview] = useState("");

  // Redirect unauthenticated user
  if (!isAuthenticated) return <Navigate to="/login" />;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleAvatar = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result);
      setDocAvatar(file);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        data.append(key, value);
      });
      data.append("docAvatar", docAvatar);

      const res = await axios.post(
        "http://localhost:5000/api/v1/user/doctor/addnew",
        data,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      toast.success(res.data.message);
      setIsAuthenticated(true);
      navigate("/");

      // Reset form
      setFormData({
        firstName: "", lastName: "", email: "", phone: "",
        dob: "", gender: "", password: "", doctorDepartment: ""
      });
      setDocAvatar(null);
      setPreview("");
    } catch (err) {
      toast.error(err.response?.data?.message || "something went wrong");
    }
  };

  return (
    <section className="page">
      <section className="container add-doctor-form">
        <div className="header" style={{ display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', marginBottom: '1rem' }}>
          <img src="/logo.png" alt="logo" className="logo" style={{ height: '200px' }} />
          <h1 className="form-title" style={{ fontSize: '30px', fontWeight: 'bold', textAlign: 'right' }}>
            REGISTER A NEW DOCTOR
          </h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="first-wrapper">
            <div>
              <img src={preview || "/docHolder.jpg"} alt="Doctor Avatar" />
              <input type="file" accept="image/*" onChange={handleAvatar} />
            </div>

            <div>
              <input type="text" name="firstName" placeholder="First Name" value={formData.firstName} onChange={handleChange} />
              <input type="text" name="lastName" placeholder="Last Name" value={formData.lastName} onChange={handleChange} />
              <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} />
              <input type="tel" name="phone" placeholder="Mobile Number" value={formData.phone} onChange={handleChange} />
              <input type="date" name="dob" value={formData.dob} onChange={handleChange} />

              <select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="">Select Gender</option>
                <option>Male</option>
                <option>Female</option>
              </select>

              <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} />

              <select name="doctorDepartment" value={formData.doctorDepartment} onChange={handleChange}>
                <option value="">Select Department</option>
                {departments.map((dept, i) => (
                  <option key={i} value={dept}>{dept}</option>
                ))}
              </select>

              <button type="submit">Register New Doctor</button>
            </div>
          </div>
        </form>
      </section>
    </section>
  );
};

export default AddNewDoctor;
