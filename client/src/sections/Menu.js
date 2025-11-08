import React, { useEffect, useState } from 'react';
import Payment from './Payment';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import Lightbox from 'yet-another-react-lightbox';
import 'yet-another-react-lightbox/styles.css';

const categories = [
  { name: 'Chinese', image: '/images/menu/chinese.webp' },
  { name: 'Sandwich', image: '/images/menu/sandwich.webp' },
  { name: 'Pasta', image: '/images/menu/pasta.webp' },
  { name: 'Pizza', image: '/images/menu/pizza.webp' },
  { name: 'Patties', image: '/images/menu/patties.webp' },
  { name: 'Shake', image: '/images/menu/shake.webp' },
  { name: 'Soup', image: '/images/menu/soup.webp' },
  { name: 'Salad', image: '/images/menu/salad.webp' },
  { name: 'Rice', image: '/images/menu/rice.webp' },
  { name: 'Indian Food', image: '/images/menu/indian fooods.webp' },
  { name: 'Sanwariya Veg Food', image: '/images/menu/veg-food.webp' },
  { name: 'Thali', image: '/images/menu/thali.webp' },
  { name: 'Paneer', image: '/images/menu/paneer.webp' },
  { name: 'Roti', image: '/images/menu/roti.webp' },
  { name: 'Dessert', image: '/images/menu/dessert.webp' },
];

function Menu() {
  const [dishes, setDishes] = useState([]);
  const [index, setIndex] = useState(-1);
  const [cart, setCart] = useState([]);
  const [showCategories, setShowCategories] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showPaymentPage, setShowPaymentPage] = useState(false);

  useEffect(() => {
    const fetchDishes = async () => {
      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishes`);
        const data = await res.json();
        setDishes(data);
      } catch (err) {
        console.error('Error fetching dishes:', err);
      }
    };
    fetchDishes();
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (dish) => setCart((prev) => [...prev, dish]);

  const removeFromCart = (index) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const getTotal = () => cart.reduce((sum, item) => sum + item.price, 0);

  const filteredDishes = selectedCategory
    ? dishes.filter((dish) => dish.category === selectedCategory)
    : [];

  const handleCategorySelect = (cat) => {
    setSelectedCategory(cat);
    setShowCategories(false);
  };

  if (showPaymentPage) {
    return <Payment cart={cart} setCart={setCart} total={getTotal()} />;
  }

  return (
    <section id="menu" className="py-5 bg-cream">
      <div className="container">
        <h2 className="text-center text-golden elegant-title mb-4">Our Restaurant Menu</h2>
        <p className="text-center text-muted mb-5">
          Enjoy home-style vegetarian meals, snacks, and hot beverages — all freshly prepared with love at Shri Sanwariya Hotel.
        </p>

        {/* CATEGORIES */}
        {showCategories ? (
          <>
            {/* Desktop Grid View */}
            <div className="d-none d-md-flex flex-wrap justify-content-center gap-4">
              {categories.map((cat) => (
                <div
                  className="card shadow-sm text-center"
                  key={cat.name}
                  style={{ cursor: 'pointer', width: '220px' }}
                  onClick={() => handleCategorySelect(cat.name)}
                >
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="card-img-top"
                    style={{ height: '150px', objectFit: 'cover' }}
                  />
                  <div className="card-body">
                    <h6 className="text-golden fw-bold">{cat.name}</h6>
                  </div>
                </div>
              ))}
            </div>

            {/* Mobile Swiper View */}
            <div className="d-md-none">
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={15}
                slidesPerView={2.2}
              >
                {categories.map((cat) => (
                  <SwiperSlide key={cat.name}>
                    <div
                      className="card shadow-sm"
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleCategorySelect(cat.name)}
                    >
                      <img
                        src={cat.image}
                        className="card-img-top"
                        alt={cat.name}
                        style={{ height: '160px', objectFit: 'cover' }}
                      />
                      <div className="card-body p-2">
                        <h6 className="text-center text-golden fw-bold mb-0" style={{ fontSize: '0.9rem' }}>
                          {cat.name}
                        </h6>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </>
        ) : (
          <>
            <button
              className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill mb-4"
              onClick={() => setShowCategories(true)}
            >
              ← Back to Categories
            </button>

            <div className="d-none d-md-flex flex-wrap justify-content-center gap-4">
              {filteredDishes.map((dish, idx) => (
                <div key={dish._id} className="card shadow-sm animate-fade" style={{ width: '300px' }}>
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    className="card-img-top"
                    style={{ height: '220px', objectFit: 'cover', cursor: 'pointer' }}
                    onClick={() => setIndex(idx)}
                  />
                  <div className="card-body">
                    <h6 className="text-golden fw-bold mb-1">{dish.name}</h6>
                    <p className="text-muted small mb-2">{dish.category}</p>
                    {typeof dish.price === 'object' ? (
                      <>
                        <p className="text-muted">Half: ₹{dish.price.half} | Full: ₹{dish.price.full}</p>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => addToCart({ ...dish, price: Number(dish.price.half), variant: 'Half' })}
                          >
                            Half
                          </button>
                          <button
                            className="btn btn-sm btn-outline-warning"
                            onClick={() => addToCart({ ...dish, price: Number(dish.price.full), variant: 'Full' })}
                          >
                            Full
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-muted">₹{dish.price}</p>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => addToCart(dish)}>
                          Add to Cart
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="d-md-none">
              <Swiper
                modules={[Navigation, Pagination]}
                pagination={{ clickable: true }}
                spaceBetween={15}
                slidesPerView={1.2}
              >
                {filteredDishes.map((dish, idx) => (
                  <SwiperSlide key={dish._id}>
                    <div className="card shadow-sm animate-fade">
                      <img
                        src={dish.imageUrl}
                        alt={dish.name}
                        className="card-img-top"
                        style={{ height: '220px', objectFit: 'cover', cursor: 'pointer' }}
                        onClick={() => setIndex(idx)}
                      />
                      <div className="card-body">
                        <h6 className="text-golden fw-bold mb-1">{dish.name}</h6>
                        <p className="text-muted small mb-2">{dish.category}</p>
                        {typeof dish.price === 'object' ? (
                          <div className="d-flex gap-2">
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => addToCart({ ...dish, price: Number(dish.price.half), variant: 'Half' })}
                            >
                              Half
                            </button>
                            <button
                              className="btn btn-sm btn-outline-warning"
                              onClick={() => addToCart({ ...dish, price: Number(dish.price.full), variant: 'Full' })}
                            >
                              Full
                            </button>
                          </div>
                        ) : (
                          <button className="btn btn-sm btn-outline-warning" onClick={() => addToCart(dish)}>
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            {index >= 0 && (
              <Lightbox
                open={index >= 0}
                close={() => setIndex(-1)}
                slides={filteredDishes.map((dish) => ({ src: dish.imageUrl, title: dish.name }))}
                index={index}
              />
            )}
          </>
        )}

        <div className="mt-5 p-4 bg-light rounded shadow-sm">
          <h4 className="text-golden mb-3">Your Cart</h4>
          {cart.length === 0 ? (
            <p className="text-muted">Cart is empty.</p>
          ) : (
            <>
              <ul className="list-group mb-3">
                {cart.map((item, idx) => (
                  <li key={idx} className="list-group-item d-flex justify-content-between align-items-center">
                    {item.name} {item.variant ? `(${item.variant})` : ''} - ₹{item.price}
                    <button className="btn btn-sm btn-danger" onClick={() => removeFromCart(idx)}>
                      Remove
                    </button>
                  </li>
                ))}
              </ul>
              <p className="fw-bold">Total: ₹{getTotal()}</p>
              <button className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill" onClick={() => setShowPaymentPage(true)}>
                Proceed to Checkout
              </button>
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Menu;