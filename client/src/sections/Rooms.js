import React from 'react';

function Rooms() {
  const rooms = [
    {
      src: '/images/rooms/ac-room.png',
      label: 'AC Room',
      price: '₹1300/night'
    },
    {
      src: '/images/rooms/nonac-room.png',
      label: 'Non-AC Room',
      price: '₹700/night'
    }
  ];

  return (
    <section id="rooms" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden elegant-title mb-4">Our Rooms</h2>

        <div className="mb-4 text-center">
          <img
            src="/images/rooms/roomPoster.jpg"
            alt="Room Poster"
            className="img-fluid rounded shadow-sm"
            style={{ maxHeight: '400px', objectFit: 'cover' }}
          />
        </div>

        <p className="text-center text-muted mb-5">
          We offer both <strong>AC</strong> and <strong>Non-AC</strong> rooms that are hygienic, peaceful, and budget-friendly.
        </p>

        <div className="row justify-content-center">
          {rooms.map((room, idx) => (
            <div className="col-md-6 mb-4 text-center" key={idx}>
              <div className="card shadow-sm bg-white rounded animate-fade" style={{ maxWidth: '320px', margin: '0 auto' }}>
                <img
                  src={room.src}
                  alt={room.label}
                  className="card-img-top rounded-top"
                  style={{ height: '300px', objectFit: 'cover' }}
                />
                <div className="card-body">
                  <h5 className="text-golden fw-bold mb-2">{room.label}</h5>
                  <p className="text-muted small">{room.price}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-4">
          <a href="#bookings" className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill shadow">
            Book Now
          </a>
        </div>
      </div>
    </section>
  );
}

export default Rooms;