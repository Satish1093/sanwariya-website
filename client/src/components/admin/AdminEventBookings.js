import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminEventBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/event-bookings`)
      .then((res) => setBookings(res.data))
      .catch((err) => console.error('Failed to fetch event bookings:', err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this booking?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/event-bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error('Failed to delete event booking:', err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center elegant-title text-golden mb-4">Event Bookings</h2>

      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-warning">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Occasion</th>
              <th>Guests</th>
              <th>Date</th>
              <th>Time</th>
              <th>Special Requests</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center text-muted">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking, idx) => (
                <tr key={idx}>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.occasion}</td>
                  <td>{booking.guests}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.specialRequests || '-'}</td>
                  <td>{new Date(booking.createdAt).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(booking._id)}
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
    </div>
  );
}

export default AdminEventBookings;