import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import { Navigation, Pagination } from 'swiper/modules';

const galleryImages = [
  '/images/gallery/img1.jpg',
  '/images/gallery/img2.jpg',
  '/images/gallery/img3.jpg',
  '/images/gallery/img4.jpg',
  '/images/gallery/img5.jpg',
  '/images/gallery/img6.jpg',
  '/images/gallery/img7.jpg'
];

function Gallery() {
  return (
    <section id="gallery" className="py-5 bg-light">
      <div className="container">
        <h2 className="text-center section-title mb-4 text-golden">Our Gallery</h2>
        <Swiper
          modules={[Navigation, Pagination]}
          spaceBetween={20}
          slidesPerView={3}
          navigation
          pagination={{ clickable: true }}
          breakpoints={{
            320: { slidesPerView: 1 },
            576: { slidesPerView: 2 },
            768: { slidesPerView: 3 },
            992: { slidesPerView: 4 }
          }}
        >
          {galleryImages.map((src, index) => (
            <SwiperSlide key={index}>
              <div className="gallery-image-wrapper">
                <img src={src} alt={`Gallery ${index + 1}`} className="img-fluid rounded shadow" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}

export default Gallery;