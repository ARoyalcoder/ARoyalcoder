import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Context } from "../main";
import { Navigate } from "react-router-dom";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const { isAuthenticated } = useContext(Context);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/v1/message/getall",
          { withCredentials: true }
        );
        setMessages(data?.messages || []);
      } catch (error) {
        const msg =
          error?.response?.data?.message || "Failed to fetch messages";
        console.error("Fetch Error:", msg);
        toast.error(msg);
        setMessages([]);
      }
    };

    fetchMessages();
  }, []);

  if (!isAuthenticated) return <Navigate to="/login" />;

  return (
    <section className="page messages">
      <h1>MESSAGES</h1>

      <div className="banner">
        {messages.length > 0 ? (
          messages.map(({ _id, firstName, lastName, email, phone, message }) => (
            <div className="card" key={_id}>
              <div className="details">
                <p>
                  First Name: <span>{firstName}</span>
                </p>
                <p>
                  Last Name: <span>{lastName}</span>
                </p>
                <p>
                  Email: <span>{email}</span>
                </p>
                <p>
                  Phone: <span>{phone}</span>
                </p>
                <p>
                  Message: <span>{message}</span>
                </p>
              </div>
            </div>
          ))
        ) : (
          <h2>No Messages Found!</h2>
        )}
      </div>
    </section>
  );
};

export default Messages;
