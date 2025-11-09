import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminMealBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/meals`)
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to fetch meal bookings', err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/meals/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to delete meal booking:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center elegant-title text-golden mb-4">Table Reservations</h2>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-dark">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Date</th>
              <th>Time</th>
              <th>Guests</th>
              <th>Special Requests</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-muted text-center">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.date}</td>
                  <td>{booking.time}</td>
                  <td>{booking.guests}</td>
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

export default AdminMealBookings;