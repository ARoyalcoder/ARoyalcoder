import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";

const AppointmentForm = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [symptoms, setSymptoms] = useState("");
  const [hasVisited, setHasVisited] = useState(false);

  const resetForm = () => {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPhone("");
    setAge("");
    setGender("");
    setAppointmentDate("");
    setSymptoms("");
    setHasVisited(false);
  };

  const handleAppointment = async (e) => {
    e.preventDefault();

    try {
      const { data } = await axios.post(
        "https://aroyalcoder.onrender.com/api/v1/appointment/post",
        {
          firstName,
          lastName,
          email,
          phone,
          age,
          gender,
          appointment_date: appointmentDate,
          hasVisited,
          symptoms,
        },
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );

      toast.success(data.message || "Appointment booked successfully!");
      resetForm();
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Failed to book appointment"
      );
    }
  };

  return (
    <div className="container form-component appointment-form">
      <h2>Appointment</h2>
      <form onSubmit={handleAppointment}>
        <div>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="tel"
            placeholder="Mobile Number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="number"
            placeholder="Your age in Years"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            required
          />
        </div>
        <div>
          <select value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
          <input
            type="date"
            placeholder="Appointment Date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
          />
        </div>
        <textarea
          rows="7"
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          placeholder="Symptoms"
          required
        />
        <div
          style={{
            gap: "9px",
            justifyContent: "flex-end",
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          <p style={{ marginBottom: 0 }}>Have you visited before?</p>
          <input
            type="checkbox"
            checked={hasVisited}
            onChange={(e) => setHasVisited(e.target.checked)}
            style={{ flex: "none", width: "25px" }}
          />
        </div>
        <button type="submit" style={{ margin: "0 auto" }}>
          GET APPOINTMENT
        </button>
      </form>
    </div>
  );
};

export default AppointmentForm;
