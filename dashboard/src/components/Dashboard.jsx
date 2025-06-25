import React, { useContext, useEffect, useState } from "react";
import { Context } from "../main";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { GoCheckCircleFill } from "react-icons/go";
import { AiFillCloseCircle } from "react-icons/ai";

const Dashboard = () => {
  const { isAuthenticated, admin } = useContext(Context);
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) return;

    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "https://aroyalcoder.onrender.com/api/v1/appointment/getall",
          { withCredentials: true }
        );

        if (Array.isArray(data?.appointments)) {
          setAppointments(data.appointments);
        } else {
          throw new Error("Invalid appointments data");
        }
      } catch (error) {
        console.error("Fetch Error:", error);
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Failed to load appointments"
        );
        setAppointments([]);
      }
    };

    fetchAppointments();
  }, [isAuthenticated]);

  const handleUpdateStatus = async (id, status) => {
    try {
      const { data } = await axios.put(
        `http://localhost:5000/api/v1/appointment/update/${id}`,
        { status },
        { withCredentials: true }
      );

      setAppointments((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status } : a))
      );
      toast.success(data.message || "Status updated");
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed");
    }
  };

  if (!isAuthenticated) return <Navigate to="/login" />;

  const fullName = `${admin?.firstName || "Doctor"} ${admin?.lastName || ""}`.trim();

  const getStatusClass = (status) => {
    switch (status) {
      case "Accepted":
        return "value-accepted";
      case "Rejected":
        return "value-rejected";
      default:
        return "value-pending";
    }
  };

  return (
    <section className="dashboard page">
      {/* Banner Section */}
      <div className="banner">
        <div className="firstBox">
          <img src="/doc.png" alt="Doctor" />
          <div className="content">
            <div>
              <p>Hello,</p>
              <h5>{fullName}</h5>
            </div>
            <p>
              Welcome to your dashboard. You can manage appointments and monitor your clinic's performance.
            </p>
          </div>
        </div>

        <div className="secondBox">
          <p>Total Appointments</p>
          <h3>{appointments.length}</h3>
        </div>

        <div className="thirdBox">
          <p>Registered Doctors</p>
          <h3>1</h3>
        </div>
      </div>

      {/* Appointment Table */}
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
            {[...appointments]
              .sort((a, b) => {
                const priority = { Pending: 0, Accepted: 1, Rejected: 2 };
                return (priority[a.status] ?? 3) - (priority[b.status] ?? 3);
              })
              .map((a) => (
                <tr key={a._id}>
                  <td>{`${a.firstName || ""} ${a.lastName || ""}`}</td>
                  <td>
                    {a.appointment_date
                      ? new Date(a.appointment_date).toLocaleString()
                      : "N/A"}
                  </td>
                  <td>{a.phone || "N/A"}</td>
                  <td>{a.symptoms || "N/A"}</td>
                  <td>
                    <select
                      value={a.status || "Pending"}
                      onChange={(e) => handleUpdateStatus(a._id, e.target.value)}
                      className={getStatusClass(a.status)}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Rejected">Rejected</option>
                    </select>
                  </td>
                  <td>
                    {a.status === "Accepted" ? (
                      <GoCheckCircleFill className="green" />
                    ) : (
                      <AiFillCloseCircle className="red" />
                    )}
                  </td>
                </tr>
              ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No Appointments Found
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
