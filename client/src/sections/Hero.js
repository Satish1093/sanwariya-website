import React from 'react';

function Hero() {
  return (
    <section
      id="hero"
      className="hero-section d-flex align-items-center justify-content-center text-center text-light"
      style={{
        backgroundImage: `url('/images/hero.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        minHeight: '100vh',
        position: 'relative',
      }}
    >
      <div
        className="bg-black bg-opacity-50 p-5 rounded shadow-lg"
        style={{ maxWidth: '700px' }}
      >
        <h1 className="display-3 fw-bold text-warning mb-3" style={{ fontFamily: 'Georgia, serif' }}>
          Welcome to <span className="text-light">Shri Sanwariya Palace & Restaurant</span>
        </h1>
        <p className="lead text-white-50 mb-4" style={{ fontSize: '1.2rem' }}>
          Comfortable Rooms. Delicious Food. Peaceful Stays.
        </p>
        <a href="#bookings" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill">
          Book Now
        </a>
      </div>
    </section>
  );
}

export default Hero;