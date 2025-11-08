import React from 'react';
import RoomBooking from './RoomBooking';
import MealBooking from './MealBooking';
import EventBooking from './EventBooking';

function Bookings() {
  return (
    <section id="bookings" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden elegant-title mb-4">Book with Shri Sanwariya</h2>
        <p className="text-center text-muted mb-5">
          Secure your room, meal, or event effortlessly through our easy-to-use booking forms.
        </p>

        <div className="mb-5 animate-fade">
          <h4 className="text-center text-golden mb-3">Room Booking</h4>
          <RoomBooking />
        </div>

        <div className="mb-5 animate-fade">
          <h4 className="text-center text-golden mb-3">Table Reservation</h4>
          <MealBooking />
        </div>

        <div className="mb-5 animate-fade">
          <h4 className="text-center text-golden mb-3">Event Reservation</h4>
          <EventBooking />
        </div>
      </div>
    </section>
  );
}

export default Bookings;