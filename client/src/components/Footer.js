import React from 'react';

function Footer() {
  return (
    <footer className="footer-section text-light">
      <div className="container py-2 text-center">
        <p className="mb-1 footer-title">
          &copy; {new Date().getFullYear()} Shree Sanwariya Hotel.<br/> All rights reserved.
        </p>
        <p className="mb-0 small">
          <a href="tel:+919753600206" className="footer-link">Contact us: +91 97536 00206</a> 
          <br/> <a href="mailto:info@sanwariyahotel.com" className="footer-link">info@sanwariyahotel.com</a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;