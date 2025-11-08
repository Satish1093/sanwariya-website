 import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminContactMessages() {
  const [messages, setMessages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesPerPage = 5;

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = () => {
    axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/contact`)
      .then(res => setMessages(res.data))
      .catch(err => console.error('Failed to fetch contact messages:', err));
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/contact/${id}`);
      fetchMessages();
    } catch (error) {
      console.error("Delete error:", error.message);
      console.error("Failed to delete message:", error);
    }
  };

  const filteredMessages = messages.filter(msg =>
    msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    msg.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLast = currentPage * messagesPerPage;
  const indexOfFirst = indexOfLast - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  return (
    <div className="container my-5">
      <h2 className="text-center elegant-title text-golden mb-4">Contact Messages</h2>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
        />
      </div>

      <div className="table-responsive">
        <table className="table table-bordered table-striped align-middle text-nowrap">
          <thead className="table-info">
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Received At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {currentMessages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center text-muted">No matching messages</td>
              </tr>
            ) : (
              currentMessages.map((msg) => (
                <tr key={msg._id}>
                  <td style={{ minWidth: '120px' }}>{msg.name}</td>
                  <td style={{ minWidth: '150px' }}>{msg.email}</td>
                  <td style={{ minWidth: '200px' }}>{msg.message}</td>
                  <td style={{ minWidth: '160px' }}>{new Date(msg.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      style={{ whiteSpace: 'nowrap' }}
                      onClick={() => handleDelete(msg._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="d-flex justify-content-center mt-3">
        <ul className="pagination flex-wrap">
          {[...Array(totalPages)].map((_, i) => (
<li key={i} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setCurrentPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AdminContactMessages;