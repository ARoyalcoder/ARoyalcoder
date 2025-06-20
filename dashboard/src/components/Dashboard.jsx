import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const { isAuthenticated, admin } = useContext(Context);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://clinic-hkjx.vercel.app/api/v1/appointment/getall",
          { withCredentials: true }
        );
        console.log("Fetched data:", data); // Debug line to check response shape

        const appointments = data?.appointments;
        if (Array.isArray(appointments)) {
          setAppointments(appointments);
        } else {
          throw new Error("Invalid format: appointments not found or not an array");
        }
      } catch (error) {
        console.error("Appointment Fetch Error:", error);
        setAppointments([]);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to fetch appointments"
        );
      }
    };

    fetchAppointments();
  }, []);

  const handleUpdateStatus = async (appointmentId, status) => {
    try {
      const { data } = await axios.put(
        `https://clinic-hkjx.vercel.app/api/v1/appointment/update/${appointmentId}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((appointment) =>
          appointment._id === appointmentId
            ? { ...appointment, status }
            : appointment
        )
      );
      toast.success(data.message || "Status updated successfully");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Error updating appointment status"
      );
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  const fullName = admin
    ? `${admin.firstName || "Doctor"} ${admin.lastName || ""}`.trim()
    : "Doctor";

  return (
    <section className="dashboard page">
      {/* Top Banner */}
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="Doctor Illustration" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{fullName}</h5>
            </div>
            <p>
              Welcome to your dashboard. Here you can manage appointments and
              monitor your clinic's operations.
            </p>
          </div>
        </div>

        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments?.length || 0}</h3>
        </div>

        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>1</h3>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="banner">
        <h5>Appointments</h5>
        <table>
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date</th>
              <th>Phone No</th>
              <th>Symptoms</th>
              <th>Status</th>
              <th>Visited</th>
            </tr>
          </thead>
          <tbody>
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>
                    {appointment.firstName || ""} {appointment.lastName || ""}
                  </td>
                  <td>
                    {appointment.appointment_date
                      ? new Date(appointment.appointment_date).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{appointment.phone || "N/A"}</td>
                  <td>{appointment.symptoms || "N/A"}</td>
                  <td>
                    <select
                      value={appointment.status || "Pending"}
                      onChange={(e) =>
                        handleUpdateStatus(appointment._id, e.target.value)
                      }
                      className={
                        appointment.status === "Accepted"
                          ? "value-accepted"
                          : appointment.status === "Rejected"
                          ? "value-rejected"
                          : "value-pending"
                      }
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {appointment.status === "Accepted" ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Appointments Found!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Dashboard;
