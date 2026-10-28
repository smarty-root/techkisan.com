import React, { useState, useEffect } from "react";
import "../styles/AllTickets.css";
import axios from "axios";
import APIEndpoints from "./endPoints.jsx";

const AllTickets = ({ employee = [] }) => {
  const Endpoints = new APIEndpoints();
  const [tickets, setTickets] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedDescription, setSelectedDescription] = useState("");

  const handleAgentChange = async (ticketId, newAgentId) => {
    setTickets((prevTickets) =>
      prevTickets.map((ticket) =>
        ticket.ticketId === ticketId
          ? { ...ticket, assignedTo: newAgentId }
          : ticket
      )
    );
    try {
      await axios.put(`${Endpoints.ASSIGNED_AGENT}`, {
        ticketNo: ticketId,
        agentAssigned: newAgentId,
      });
      console.log("Agent assignment updated for ticket:", ticketId);
    } catch (error) {
      console.error("Error assigning agent:", error);
    }
  };

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get(Endpoints.FETCH_TICKETS);
        if (response.status === 200) {
          setTickets(response.data.tickets);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const handleDelete = async (ticketNo) => {
    try {
      await axios.delete(`https://your-api.com/tickets/${ticketNo}`);
      const updatedTickets = tickets.filter(
        (ticket) => ticket.ticketNo !== ticketNo
      );
      setTickets(updatedTickets);
    } catch (error) {
      console.error("Error deleting ticket:", error);
      alert("Failed to delete the ticket.");
    }
  };

  const handleViewDescription = (description) => {
    setSelectedDescription(description);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedDescription("");
  };

  return (
    <div className="all-ticket-table">
      <h1 className="ticket-heading">All Tickets</h1>
      <div className="ticket-list-wrapper" style={{ position: "relative" }}>
        <div className="div-table">
          <table>
            <thead>
              <tr>
                <th>Ticket No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Files</th>
                <th>Created Date</th>
                <th>Status</th>
                <th>Priority</th>
                <th>Agent Assigned</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {tickets.length > 0 &&
                tickets.slice().reverse().map((ticket, index) => (
                  <tr key={ticket.ticketId}>
                    <td className={`left-border color-${index % 5}`}>
                      &nbsp;{ticket.ticketId}
                    </td>
                    <td>{ticket.subject}</td>
                    <td>
                      <button
                        className="view-btn"
                        onClick={() => handleViewDescription(ticket.message)}
                      >
                        View <i className="fa-solid fa-eye"></i>
                      </button>
                    </td>
                    <td>
                      {ticket.fileUrl ? (
                        <a href={ticket.fileUrl} download>
                          <i className="fa-solid fa-download download-icon"></i>
                        </a>
                      ) : (
                        "No File"
                      )}
                    </td>
                    <td>{formatDate(ticket.createdAt)}</td>
                    <td>
                      <span className="status-text">{ticket.status}</span>
                    </td>
                    <td className={`left-border color-${index % 5}`}>
                      &nbsp;{ticket.priority}
                    </td>
                    <td>
                      <select
                        className="agent-dropdown"
                        value={ticket.assignedTo || ""}
                        onChange={(e) =>
                          handleAgentChange(ticket.ticketId, e.target.value)
                        }
                      >
                        <option value="">--Select--</option>
                        {employee.map((agent) => (
                          <option key={agent._id} value={agent._id}>
                            {agent.firstName} {agent.lastName}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="action-icons">
                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(ticket.ticketId)}
                      >
                        <i className="fa-solid fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))}
              {tickets.length === 0 && (
                <tr>
                  <td colSpan="9" style={{ textAlign: "center" }}>
                    No tickets available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <span className="close-view-btn" onClick={closeModal}>
              &times;
            </span>
            <h2>Description</h2>
            <p>{selectedDescription}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllTickets;
