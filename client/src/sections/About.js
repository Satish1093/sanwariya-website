import React from 'react';
import { FaBed, FaUtensils, FaConciergeBell, FaWifi } from 'react-icons/fa';

function About() {
  return (
    <section id="about" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden mb-4 elegant-title">
          About Shri Sanwariya Hotel & Restaurant
        </h2>

        <p className="lead text-center text-muted mb-5" style={{ maxWidth: '850px', margin: '0 auto' }}>
          Shri Sanwariya welcomes you to comfort, flavor, and tranquility. Located in the heart of town,
          our hotel offers AC/Non-AC rooms and a pure vegetarian restaurant with warmth and care.
        </p>

        <div className="row gy-4 mb-5">
          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm h-100 animate-fade">
              <h4 className="text-golden mb-3">Our Vision</h4>
              <p className="text-muted">
                We aim to blend traditional hospitality with modern comfort, creating a home-away-from-home experience.
                Our commitment is to cleanliness, peaceful ambiance, and heartfelt service.
              </p>
            </div>
          </div>

          <div className="col-md-6">
            <div className="p-4 bg-white rounded shadow-sm h-100 animate-fade">
              <h4 className="text-golden mb-3">What We Offer</h4>
              <ul className="list-unstyled text-muted">
                <li><FaBed className="me-2 text-golden" /> Clean AC & Non-AC Rooms</li>
                <li><FaUtensils className="me-2 text-golden" /> Traditional Thali & Snacks</li>
                <li><FaConciergeBell className="me-2 text-golden" /> Daily Room Service</li>
                <li><FaWifi className="me-2 text-golden" /> Free Wi-Fi & Parking</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="text-center text-muted small fst-italic">
          A peaceful stay, a delicious plate, and a memorable experience — every time.
        </div>
      </div>
    </section>
  );
}

export default About;