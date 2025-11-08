import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "axios";
//import { QRCodeSVG } from 'qrcode.react';
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const RESTAURANT_COORDS = { lat: 23.33880, lng: 76.83752 };

const toRad = (deg) => deg * (Math.PI / 180);
const getDistanceKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

function DraggableMarker({ coordinates, setCoordinates }) {
  const [position, setPosition] = useState(coordinates);

  useEffect(() => {
    setCoordinates(position);
  }, [position, setCoordinates]);

  useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  return (
    <Marker
      draggable
      position={position}
      eventHandlers={{
        dragend: (e) => {
          const latlng = e.target.getLatLng();
          setPosition(latlng);
        },
      }}
    />
  );
}

function Payment({ cart, setCart, total }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Cash on Delivery",
  });

  const [coordinates, setCoordinates] = useState({
    lat: 23.2599,
    lng: 77.4126,
  });
  const [deliveryCharge, setDeliveryCharge] = useState(null);
  const [finalTotal, setFinalTotal] = useState(total);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [placingOrder, ] = useState(false);
  const [calculating, setCalculating] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [upiPaid, ] = useState(false);
  const [, setManuallyTyped] = useState(false);

  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);

  const calculateDeliveryCharge = useCallback(async () => {
    setCalculating(true);

    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${coordinates.lat}&lon=${coordinates.lng}&format=json`
      );

      const result = res.data;
      if (!result?.address) {
        toast.error(
          "Unable to determine location. Please reposition the map pin."
        );
        return { charge: null };
      }

      const addressStr = result.display_name;
      setFormData((prev) => ({ ...prev, address: addressStr }));

      const distance = getDistanceKm(
        RESTAURANT_COORDS.lat,
        RESTAURANT_COORDS.lng,
        coordinates.lat,
        coordinates.lng
      );

      let charge = 0;
      if (distance <= 2) charge = 0;
      else if (distance <= 5) charge = 30;
      else if (distance <= 10) charge = 50;
      else charge = null;

      setDeliveryCharge(charge);
      return { charge, distance };
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch location. Check your internet connection.");
      return { charge: null };
    } finally {
      setCalculating(false);
    }
  }, [coordinates]);

  useEffect(() => {
    calculateDeliveryCharge();
  }, [coordinates, calculateDeliveryCharge]);

  useEffect(() => {
    if (deliveryCharge !== null) {
      setFinalTotal(total + deliveryCharge);
    } else {
      setFinalTotal(total);
    }
  }, [total, deliveryCharge]);

  const debounceRef = React.useRef(null);

const debounceGeocode = (address) => {
  if (debounceRef.current) {
    clearTimeout(debounceRef.current);
  }
  debounceRef.current = setTimeout(() => {
    geocodeAddress(address);
  }, 2000); 
};

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "address") {
      setManuallyTyped(true);
      debounceGeocode(value);
    }
  };

  const sendOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/send-email-otp`, {
        email: formData.email,
      });
      toast.success("OTP sent to your email");
      setOtpSent(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const verifyOtp = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_API_BASE_URL}/api/otp/verify-email-otp`, {
        email: formData.email,
        otp,
      });
      toast.success("Email verified");
      setEmailVerified(true);
    } catch (err) {
      toast.error("Invalid OTP");
    }
  };

  const handlePlaceOrder = async () => {
    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.address
    ) {
      toast.warning("Please fill in all required fields.");
      return;
    }

    if (!emailVerified) {
      toast.warning("Please verify your email using OTP.");
      return;
    }

    if (formData.paymentMethod === "UPI" && !upiPaid) {
      toast.warning("Please confirm UPI payment before proceeding.");
      return;
    }

    const { charge } = await calculateDeliveryCharge();
    if (charge === null) {
      toast.error("Sorry, delivery is only available within 10 km.");
      return;
    }

    const orderDetails = {
      items: cart,
      total: total + charge,
      deliveryCharge: charge,
      ...formData,
      location: coordinates,
      createdAt: new Date().toISOString(),
    };

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderDetails),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderPlaced(true);
        setCart([]);
        localStorage.removeItem("cart");
      } else {
        toast.error(data.message || "Failed to place order");
      }
    } catch (error) {
      toast.error("Error placing order");
      console.error(error);
    }
  };

  const geocodeAddress = async (address) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          address
        )}`
      );
      const data = res.data;
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        setCoordinates({ lat: parseFloat(lat), lng: parseFloat(lon) });
      } else {
        toast.error("Address not found. Please refine it or use the map pin.");
      }
    } catch (error) {
      console.error("Geocoding failed:", error);
      toast.error("Error while fetching address location.");
    }
  };

  if (orderPlaced) {
    return (
      <div className="bg cream py-5">
        <div className="container">
          <h2 className="text-success mb-4">Order Placed Successfully!</h2>
          <p>
            Thank you for ordering from us. You'll receive a confirmation email
            shortly.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-cream py-5">
      <div className="container mb-5 bg-cream">
        <h2 className="text-golden mb-4">Checkout</h2>
        <div className="row">
          <div className="col-md-6">
            <h5 className="mb-3">Delivery Details</h5>
            <form onSubmit={(e) => e.preventDefault()}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
                {!emailVerified && (
                  <>
                    <button
                      className="btn btn-warning mt-2"
                      onClick={sendOtp}
                      disabled={sendingOtp}
                    >
                      {sendingOtp ? "Sending OTP..." : "Send OTP"}
                    </button>

                    {otpSent && (
                      <>
                        <input
                          className="form-control mt-2"
                          type="text"
                          placeholder="Enter OTP"
                          value={otp}
                          onChange={(e) => setOtp(e.target.value)}
                        />
                        <button
                          className="btn btn-sm btn-success mt-2"
                          onClick={verifyOtp}
                        >
                          Verify OTP
                        </button>
                      </>
                    )}
                  </>
                )}
                {emailVerified && (
                  <span className="text-success small">Email verified ✅</span>
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                />
              </div>
              <h4 className="text-danger text-bold">Address should be within 10km.</h4>
              <div className="mb-3">
                <label className="form-label">House No. & Landmark</label>
                <input
                  type="text"
                  className="form-control"
                  name="HouseNo"
                  value={formData.HouseNo}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Address (auto-filled from map )
                </label>
                <textarea
                  className="form-control"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows="3"
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Pin Your Exact Location</label>
                <MapContainer
                  center={[coordinates.lat, coordinates.lng]}
                  zoom={13}
                  scrollWheelZoom={false}
                  style={{ height: "300px", width: "100%" }}
                >
                  <TileLayer
                    attribution="&copy; OpenStreetMap contributors"
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <DraggableMarker
                    coordinates={coordinates}
                    setCoordinates={setCoordinates}
                  />
                </MapContainer>
              </div>
              <div className="mb-3">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Cash on Delivery">Cash on Delivery</option>
                  <option value="UPI">UPI</option>
                </select>
              </div>

              {formData.paymentMethod === "UPI" && (
                <h2>Not Available! We will update it soon</h2>
                // <div className="mt-3 p-3 border rounded bg-light">
                //   <h6>Scan to Pay ₹{finalTotal}</h6>
                //   <QRCodeSVG value={`upi://pay?pa=9753600206@ybl&pn=Arjun&am=${finalTotal}&cu=INR`} size={150} />
                //   <p className="small mt-2 mb-0">UPI ID: <strong>9753600206@ybl</strong></p>
                //   <div className="form-check mt-2">
                //     <input
                //       className="form-check-input"
                //       type="checkbox"
                //       checked={upiPaid}
                //       onChange={(e) => setUpiPaid(e.target.checked)}
                //       id="upiPaidConfirm"
                //     />
                //     <label className="form-check-label" htmlFor="upiPaidConfirm">
                //       I have completed the UPI payment.
                //     </label>
                //   </div>
                // </div>
              )}
            </form>
          </div>

          <div className="col-md-6">
            <h5 className="mb-3">Order Summary</h5>
            <ul className="list-group mb-3">
              {cart.map((item, idx) => (
                <li
                  key={idx}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  {item.name} {item.variant ? `(${item.variant})` : ""} - ₹
                  {item.price}
                </li>
              ))}
            </ul>
            <p className="fw-bold">Items Total: ₹{total}</p>
            {deliveryCharge !== null && (
              <p className="fw-bold">Delivery Charge: ₹{deliveryCharge}</p>
            )}
            <p className="fw-bold">Final Total: ₹{finalTotal}</p>

            <button
              className="btn btn-success"
              onClick={handlePlaceOrder}
              disabled={calculating || deliveryCharge === null || placingOrder}
            >
              {placingOrder ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Payment;