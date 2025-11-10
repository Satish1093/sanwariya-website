import React, { useState } from "react";

const AddDish = () => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [halfPrice, setHalfPrice] = useState("");
  const [fullPrice, setFullPrice] = useState("");
  const [singlePrice, setSinglePrice] = useState("");
  const [image, setImage] = useState("");
  const [preview, setPreview] = useState("");

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));

    const formData = new FormData();
    formData.append("dishImage", file);

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/images/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setImage(data.imageUrl);
      
    } catch (err) {
      console.error("Image upload failed:", err);
      alert("❌ Image upload failed.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !category || !image) {
      //alert("Please fill Dish Name, Category, and upload an Image.");
      return;
    }

    let price = null;

    if (halfPrice || fullPrice) {
      price = {
        half: halfPrice || null,
        full: fullPrice || null,
      };
    } else if (singlePrice) {
      price = parseFloat(singlePrice);
    } else {
      alert("Please provide either Half/Full Price or Single Price.");
      return;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          category,
          price,
          imageUrl: image,
          publicId: "not-used-in-frontend",
        }),
      });

      const data = await res.json();
      //alert(" Dish added successfully!");
      console.log(data);

      setName("");
      setCategory("");
      setHalfPrice("");
      setFullPrice("");
      setSinglePrice("");
      setImage("");
      setPreview("");
    } catch (err) {
      console.error("Error adding dish:", err);
      alert(" Failed to add dish.");
    }
  };

  const categories = [
    'Chinese',
    'Sandwich',
    'Pasta',
    'Pizza',
    'Patties',
    'Shake',
    'Soup',
    'Salad',
    'Rice',
    'Indian Food',
    'Sanwariya Veg Food',
    'Thali',
    'Paneer',
    'Roti',
    'Dessert',
  ];

  return (
    <div className="container mt-5 my-5">
      <h3 className="text-gold elegant-title mb-4">Add New Dish</h3>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="row g-3 align-items-end">
          <div className="col-md-3">
            <label className="form-label">Dish Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="e.g. Paneer Butter Masala"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Category</label>
            <select
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-2">
            <label className="form-label">Half Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={halfPrice}
              onChange={(e) => setHalfPrice(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Full Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={fullPrice}
              onChange={(e) => setFullPrice(e.target.value)}
              placeholder="Optional"
            />
          </div>

          <div className="col-md-2">
            <label className="form-label">Single Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={singlePrice}
              onChange={(e) => setSinglePrice(e.target.value)}
              placeholder="If no half/full"
            />
          </div>

          <div className="col-md-3">
            <label className="form-label">Dish Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={handleUpload}
              required
            />
          </div>
        </div>

        {preview && (
          <div className="text-center mt-4">
            <img
              src={preview}
              alt="Preview"
              style={{ maxWidth: "150px", borderRadius: "8px" }}
            />
          </div>
        )}

        <div className="text-center mt-4">
          <button
            type="submit"
            className="btn btn-outline-warning btn-lg px-4 py-2 rounded-pill"
          >
            Save Dish
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddDish;