import React, { useState } from 'react';
import { Link } from 'react-scroll';

function Navbar() {
  const [active, setActive] = useState('hero');

  const handleNavClick = (section) => {
    setActive(section);
    setTimeout(() => {
      const navbarCollapse = document.querySelector('.navbar-collapse');
      if (navbarCollapse && navbarCollapse.classList.contains('show')) {
        navbarCollapse.classList.remove('show');
      }
    }, 1000); 
  };


  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark shadow fixed-top">
      <div className="container">
        <Link
          to="hero"
          smooth={true}
          duration={500}
          offset={-70}
          className="navbar-brand fw-bold"
          style={{ cursor: 'pointer' }}
          onClick={() => handleNavClick('hero')}
        >
          Shri Sanwariya
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon custom-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav gap-3">
            {[
              { to: 'hero', label: 'Home' },
              { to: 'about', label: 'About' },
              { to: 'rooms', label: 'Rooms' },
              { to: 'menu', label: 'Menu' },
              { to: 'bookings', label: 'Bookings' },
              { to: 'contact', label: 'Contact' }
            ].map((item, idx) => (
              <li className="nav-item" key={idx}>
                <Link
                  to={item.to}
                  smooth={true}
                  duration={500}
                  spy={true}
                  offset={-70}
                  onSetActive={() => setActive(item.to)}
                  onClick={() => handleNavClick(item.to)} 
                  className={`nav-link text-uppercase fw-semibold ${active === item.to ? 'active-link' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;