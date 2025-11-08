import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminRoomBookings() {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = () => {
    axios
      .get(`${process.env.REACT_APP_API_BASE_URL}/api/bookings`)
      .then(res => setBookings(res.data))
      .catch(err => console.error('Failed to fetch room bookings', err));
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this booking?")) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/bookings/${id}`);
      fetchBookings();
    } catch (err) {
      console.error("Failed to delete room booking:", err);
    }
  };

  return (
    <div className="container my-5">
      <h2 className="text-center elegant-title text-golden mb-4">Room Bookings</h2>
      <div className="table-responsive shadow-sm rounded">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-success">
            <tr>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Room Type</th>
              <th>Guests</th>
              <th>Check-In</th>
              <th>Check-Out</th>
              <th>Submitted At</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bookings.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-muted text-center">No bookings found</td>
              </tr>
            ) : (
              bookings.map((booking, index) => (
                <tr key={index}>
                  <td>{booking.name}</td>
                  <td>{booking.phone}</td>
                  <td>{booking.email}</td>
                  <td>{booking.roomType}</td>
                  <td>{booking.guests}</td>
                  <td>{booking.checkIn}</td>
                  <td>{booking.checkOut}</td>
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

export default AdminRoomBookings;