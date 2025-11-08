import React from 'react';
import Hero from '../sections/Hero';
import About from '../sections/About';
import Rooms from '../sections/Rooms';
import Menu from '../sections/Menu';
import Bookings from '../sections/Bookings';
import Contact from '../sections/Contact';

function Home() {
  return (
    <>
      <Hero />
      <About />
      <Rooms />
      <Menu />
      <Bookings />
      <Contact />
    </>
  );
}

export default Home;