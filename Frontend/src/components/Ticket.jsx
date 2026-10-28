import "../styles/Ticket.css";
import { useState, useEffect } from "react";
import axios from "axios";
import ApiEndpoints from "./endPoints";
function Ticket({employeeData}) {
  // for my ticket area
  const Endpoints = new ApiEndpoints();
  const [activeTab, setActiveTab] = useState("open");
  const [activeCategory, setActiveCategory] = useState("all");
  const [ticketcreatemsg, setTicketCreatemsg] = useState(null);
  const [Loading, setLoading] = useState(false);
  const [searchQueries, setSearchQueries] = useState({
    ticketNo: "",
    title: "",
    employeeName: "",
    createdDate: "",
    status: "",
    priority: "",
    agentAssigned: "",
  });
  // State for tickets
  const [tickets, setTickets] = useState([]);

  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [editFormData, setEditFormData] = useState({
    subject: "",
    priority: "",
    status: "",
    group: "",
    description: "",
    tags: "",
  });

  //  Add Form Api calling
  const [addFormData, setAddFormData] = useState({
    subject: "",
    priority: "",
    status: "",
    group: "",
    description: "",
    file: null,
    tags: "",
    employeeData: employeeData._id,
  });

  // Handle Edit Button Click
  const handleEditClick = (ticket) => {
    setEditingTicket(ticket);
    setEditFormData({
      subject: ticket.subject,
      priority: ticket.priority,
      status: ticket.status,
      group: ticket.groups,
      description: ticket.message,
      tags: ticket.tags,
    });
    setShowEditModal(true);
  };

  // Handle Edit Form Change
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle Edit Submit
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.put(`${Endpoints.EDIT_TICKET}/${editingTicket._id}`, editFormData);
      if (response.status === 200) {
        // Update the tickets state with the edited ticket
        setTickets(tickets.map(ticket => 
          ticket._id === editingTicket._id ? response.data.ticket : ticket
        ));
        setShowEditModal(false);
        setEditingTicket(null);
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };
  const assignedTicketsFetch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(Endpoints.FETCH_ASSIGNED_AGENT, {
        params: { employeeId: employeeData._id }
      });
      if (response.status === 200) {
        console.log(response);
        setTickets(response.data.ticket);
        setActiveCategory("assignedTickets");
      }
    } catch (error) {
      console.error("Error fetching assigned tickets", error);
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    fetchTickets();
  }, []);

  const myTicketsFetch=async()=>{
  setLoading(true);
try{
  const response=await axios.get(Endpoints.FETCH_MY_TICKETS,{params:{employeeId:employeeData._id}});
  if (response.status==200){
    setTickets(response.data.tickets)
    setActiveCategory("myTickets")
    setLoading(false);
  }

}catch(error){
  console.error("Error fetching my tickets", error);
  setLoading(false);
} 
}
  const fetchTickets = async () => {
    setLoading(true);
    try {
      setLoading(true);
      const response = await axios.get(Endpoints.FETCH_TICKETS);
      if (response.status == 200) {
      setTickets(response.data.tickets);
      setActiveCategory("all");
      setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching tickets", error);
      setLoading(false);
    }
  };

  async function CreateTicket() {
    try {
      const response = await axios.post(Endpoints.CREATE_TICKET, addFormData);
      fetchTickets();
    } catch (error) {
      console.log(error);
    }
  }

  const handleAddFormChange = (e) => {
    const { name, value, type, files } = e.target;
    setAddFormData((prevData) => ({
      ...prevData,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  // Delete Ticket API Calling
  const handleDelete = async (ticketId) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this ticket?"
    );
    if (!confirmDelete) return;

    try {
      const response = await fetch(
        `${Endpoints.DELETE_TICKET}/${ticketId}`,
        {
          method: "DELETE",
        }
      );
      // Check if the response is successful
      if (response.ok) {
        const updatedTickets = tickets.filter((ticket) => ticket._id !== ticketId);
        setTickets(updatedTickets);
        alert("Ticket deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting ticket:", error.message);
      alert("Failed to delete ticket. Please try again.");
    }
  };



  return (
    <>
      <div className="ticket-dashboard">
        <div className="ticket-title">
          <h1>
            {" "}
            <i className="fa-solid fa-ticket"></i>My Ticket
          </h1>
          <h2 className="ticket-profile">
            <i class="fa-solid fa-user-tie"></i> {employeeData? employeeData.firstName+" "+ employeeData.lastName : "Loading.."}
          </h2>
        </div>
        {/* Category Buttons */}
        <div className="category-btns">
          <button
            className={activeCategory === "all" ? "active" : ""}
            onClick={fetchTickets}
          >
            All Tickets
          </button>
          <button
            className={activeCategory === "myTickets" ? "active" : ""}
            onClick={myTicketsFetch}
          >
            My Tickets
          </button>
          <button
            className={activeCategory === "assignedTickets" ? "active" : ""}
            onClick={assignedTicketsFetch}
          >
            Assigned Tickets
          </button>
        </div>

        {/* Open & Close Buttons */}
        <div className="openclose-btns">
          <button className="status-btn" onClick={() => setActiveTab("open")}>
            <span
              className={`number-badge ${
                activeTab === "open" ? "orange-badge" : "grey-badge"
              }`}
            >
              {tickets? tickets.filter((ticket) => ticket.status === "Open").length : "0"}
            </span>{" "}
            Open
          </button>
          <button className="status-btn" onClick={() => setActiveTab("closed")}>
            <span
              className={`number-badge ${
                activeTab === "closed" ? "orange-badge" : "grey-badge"
              }`}
            >
              {tickets ? tickets.filter((ticket) => ticket.status === "Closed").length : "0"}
            </span>{" "}
            Closed
          </button>
        </div>
        {/* Table Section */}
        <div className="ticket-table">
        {Loading ? (
    <div className="loader-container">
      <p>Loading tickets...</p>
      {/* You can replace <p> with a spinner animation if you want */}
    </div>
  ) : (
    <div className="div-table">
    <table>
      <thead>
        <tr>
          {Object.keys(searchQueries).map((column) => (
            <th key={column}>
              {column.charAt(0).toUpperCase() + column.slice(1)}
              <div className="filter-container">
                <input
                  type="text"
                  className="filter-input"
                  placeholder={`Search ${column}...`} // ✅ Placeholder added
                  value={searchQueries[column]}
                  // onChange={(e) =>
                  //   handleFilterChange(column, e.target.value)
                  // }
                />
                {searchQueries[column] && (
                  <button
                    className="clear-button"
                    // onClick={() => clearFilter(column)}
                  >
                    ✖
                  </button>
                )}
              </div>
            </th>
          ))}
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {/* Render tickets based on active category and tab */}
        {Array.isArray(tickets) && tickets.length > 0 ? (
  tickets.reverse().slice().map((ticket, index) => (
    <tr key={index}>
      <td className={`left-border color-${index % 5}`}>
        &nbsp;{ticket.ticketId}
      </td>
      <td>{ticket.subject}</td>
      <td>{ticket.name}</td>
      <td>{formatDate(ticket.createdAt)}</td>
      <td>
        <span className="status-text">
          {ticket.status === "Open" ? (
            <span className="open-status">{ticket.status}</span>
          ) : (
            <span className="closed-status">{ticket.status}</span>
          )}
        </span>
      </td>
      <td className={`left-border color-${index % 5}`}>
        &nbsp;{ticket.priority}
      </td>
      <td>{ticket.assignedTo ? ticket.assignedToName : "Not Assigned"}</td>
      
      <td className="action-icons">
        {ticket.userId === employeeData._id ? (
          <>
        <button
          className="edit-btn"
          onClick={() => handleEditClick(ticket)}
        >
          <i className="fa-solid fa-pen-to-square"></i>
        </button>
  <button
    className="delete-btn"
    onClick={() => handleDelete(ticket._id)}
  >
    <i className="fa-solid fa-trash"></i>
  </button>
  </>
) : null}   </td>

    </tr>
  ))
) : (
  <tr>
    <td colSpan="8" style={{ textAlign: "center", padding: "10px" }}>
      No tickets found
    </td>
  </tr>
)}

      </tbody>
    </table>
  </div>
  )}
          
        </div>

        {/* Edit Modal */}
        {showEditModal && (
          <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <h2>Edit Ticket</h2>
              <form onSubmit={handleEditSubmit} className="edit-form">
                <div className="form-field">
                  <label htmlFor="subject">Subject:</label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={editFormData.subject}
                    onChange={handleEditFormChange}
                    required
                  />
                </div>

                <div className="form-field">
                  <label htmlFor="priority">Priority:</label>
                  <select
                    id="priority"
                    name="priority"
                    value={editFormData.priority}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select Priority</option>
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Critical">Critical</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={editFormData.status}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select Status</option>
                    <option value="Open">Open</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Closed">Closed</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="group">Group:</label>
                  <select
                    id="group"
                    name="group"
                    value={editFormData.group}
                    onChange={handleEditFormChange}
                    required
                  >
                    <option value="">Select Group</option>
                    <option value="Travel">Travel</option>
                    <option value="Payroll">Payroll</option>
                    <option value="Admin">Admin</option>
                    <option value="IT Supports">IT Support</option>
                    <option value="HR">HR</option>
                    <option value="Reimbursements">Reimbursement</option>
                    <option value="Pocket HRMS">Pocket HRMS</option>
                  </select>
                </div>

                <div className="form-field">
                  <label htmlFor="description">Description:</label>
                  <textarea
                    id="description"
                    name="description"
                    value={editFormData.description}
                    onChange={handleEditFormChange}
                    required
                    style={{ height: "80px" }}
                  ></textarea>
                </div>

                <div className="form-field">
                  <label htmlFor="tags">Tags:</label>
                  <select
                    id="tags"
                    name="tags"
                    value={editFormData.tags}
                    onChange={handleEditFormChange}
                  >
                    <option value="">Select Tag</option>
                    <option value="query">Tag Name - Query</option>
                    <option value="problem">Tag Name - Problem</option>
                  </select>
                </div>

                <div className="button-container">
                  <button type="submit" className="submit-btn" disabled={Loading}>
                    {Loading ? "Updating..." : "Update Ticket"}
                  </button>
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* add form  */}
        <div className="add-form-container">
          <h2>Add New Ticket</h2>
          <p>{ticketcreatemsg}</p>
          <form className="add-form">
            <div className="form-field">
              <label htmlFor="subject">Subject:</label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={addFormData.subject}
                onChange={handleAddFormChange}
                required
                placeholder="Enter subject"
              />
            </div>

            <div className="form-field">
              <label htmlFor="priority">Priority:</label>
              <select
                id="priority"
                name="priority"
                value={addFormData.priority}
                onChange={handleAddFormChange}
                required
              >
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
                <option value="Critical">Critical</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="status">Status:</label>
              <select
                id="status"
                name="status"
                value={addFormData.status}
                onChange={handleAddFormChange}
                required
              >
                <option value="">Select Status</option>
                <option value="Open">Open</option>
                <option value="Closed">Closed</option>
                <option value="Resolved">Resolved</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="group">Group:</label>
              <select
                id="group"
                name="group"
                value={addFormData.group}
                onChange={handleAddFormChange}
                required
              >
                <option value="">Select Group</option>
                <option value="Travel">Travel</option>
                <option value="Payroll">Payroll</option>
                <option value="Admin">Admin</option>
                <option value="IT Supports">IT Support</option>
                <option value="HR">HR</option>
                <option value="Reimbursements">Reimbursement</option>
                <option value="Pocket HRMS">Pocket HRMS</option>
              </select>
            </div>

            <div className="form-field">
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                name="description"
                value={addFormData.description}
                onChange={handleAddFormChange}
                required
                placeholder="Enter description..."
                style={{ height: "80px" }}
              ></textarea>
            </div>

            <div className="form-field file-upload">
              <label htmlFor="file">Attach File:</label>
              <div className="file-input">
                <input
                  type="file"
                  id="file"
                  name="file"
                  accept=".png,.jpg,.jpeg,.doc,.docx,.pdf"
                />
                <p className="file-warning">
                  Only PNG, JPG, JPEG, DOC, DOCX, PDF files are allowed to
                  upload
                </p>
              </div>
            </div>

            <div className="form-field">
              <label htmlFor="tags">Tags:</label>
              <select
                id="tags"
                name="tags"
                value={addFormData.tags}
                onChange={handleAddFormChange}
              >
                <option value="">Select Tag</option>
                <option value="query">Tag Name - Query</option>
                <option value="problem">Tag Name - Problem</option>
              </select>
            </div>

            <div className="button-container">
              <button
                type="submit"
                className="submit-btn"
                onClick={CreateTicket}
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Ticket;
