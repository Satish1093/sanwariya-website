import React from 'react';
import AdminRoomBookings from './AdminRoomBookings';
import AdminMealBookings from './AdminMealBookings';
import AdminEventBookings from './AdminEventBookings';
import AdminContactMessages from './AdminContactMessages';
import AdminOrders from './AdminOrder';

function AdminBookings() {
  return (
    <div className="container mt-5 my-5">

      <section className="mb-5">
       
        <AdminRoomBookings />
      </section>

      <section className="mb-5">
        
        <AdminMealBookings />
      </section>

      <section className="mb-5">
        
        <AdminEventBookings />
      </section>

      <section className="mb-5">

        <AdminContactMessages />
      </section>
      <section className="mb-5">

        <AdminOrders />
      </section>

      <button
  className="btn btn-danger float-end"
  onClick={() => {
    localStorage.removeItem('isAdmin');
    window.location.href = '/admin-login';
  }}
>
  Logout
</button>

    </div>
  );
}

export default AdminBookings;