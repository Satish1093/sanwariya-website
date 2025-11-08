import React, { useEffect, useState } from 'react';
import axios from 'axios';

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/api/orders`);
      setOrders(res.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!id || id.length !== 24) {
      alert('Invalid Order ID');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/api/orders/${id}`);
      setOrders((prev) => prev.filter(order => order._id !== id));
    } catch (error) {
      console.error('Error deleting order:', error);
      alert('Failed to delete order');
    }
  };

  return (
    <div className="container py-5">
      <h2 className="mb-4">All Orders</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Address + Map</th>
              <th>Payment</th>
              <th>Items</th>
              <th>Delivery Charge</th>
              <th>Total</th>
              <th>Placed At</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, idx) => (
              <tr key={order._id || idx}>
                <td>{idx + 1}</td>
                <td>{order.name}</td>
                <td>{order.phone}</td>
                <td>{order.email}</td>
                <td>
                  <div>{order.address}</div>
                  {order.location?.lat && order.location?.lng && (
                    <div className="mt-1">
                      <a
                        href={`https://www.google.com/maps?q=${order.location.lat},${order.location.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-sm btn-outline-primary mt-1"
                      >
                      View on Map
                      </a>
                    </div>
                  )}
                </td>
                <td>{order.paymentMethod?.toUpperCase()}</td>
                <td>
                  <ul className="mb-0 ps-3">
                    {order.items.map((item, i) => (
                      <li key={i}>
                        {item.name} {item.variant ? `(${item.variant})` : ''} - ₹{item.price}
                      </li>
                    ))}
                  </ul>
                </td>
                <td>₹{order.deliveryCharge}</td>
                <td>₹{order.total}</td>
                <td>{new Date(order.createdAt).toLocaleString()}</td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(order._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminOrders;