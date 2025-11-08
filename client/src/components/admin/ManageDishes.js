import React, { useEffect, useState } from 'react';

function ManageDishes() {
  const [dishes, setDishes] = useState([]);
  const [editingDish, setEditingDish] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    imageUrl: '',
    publicId: '',
  });

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

  const deleteDish = async (id) => {
    if (!window.confirm('Are you sure you want to delete this dish?')) return;
    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishes/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      alert('✅ ' + data.message);
      setDishes((prev) => prev.filter((dish) => dish._id !== id));
    } catch (err) {
      console.error('Error deleting dish:', err);
      alert('❌ Failed to delete dish.');
    }
  };

  const handleEditClick = (dish) => {
    setEditingDish(dish._id);
    setFormData({
      name: dish.name,
      category: dish.category,
      price: typeof dish.price === 'object' ? JSON.stringify(dish.price) : dish.price,
      imageUrl: dish.imageUrl,
      publicId: dish.publicId,
    });
  };

  const handleInputChange = async (e) => {
    const { name, value, files } = e.target;

    if (name === 'image') {
      const file = files[0];
      if (!file) return;

      const formDataImage = new FormData();
      formDataImage.append('dishImage', file);
      formDataImage.append('oldPublicId', formData.publicId);

      try {
        const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/upload`, {
          method: 'POST',
          body: formDataImage,
        });

        const data = await res.json();
        setFormData((prev) => ({
          ...prev,
          imageUrl: data.imageUrl,
          publicId: data.publicId,
        }));
      } catch (err) {
        console.error('Image upload failed:', err);
        alert('❌ Image upload failed.');
      }
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    let updatedPrice;
    try {
      updatedPrice = JSON.parse(formData.price);
    } catch {
      updatedPrice = formData.price;
    }

    try {
      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}/api/dishes/${editingDish}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          price: updatedPrice,
        }),
      });

      const result = await res.json();
      alert('✅ ' + result.message);

      setDishes((prev) =>
        prev.map((dish) =>
          dish._id === editingDish ? { ...dish, ...formData, price: updatedPrice } : dish
        )
      );

      setEditingDish(null);
      setFormData({
        name: '',
        category: '',
        price: '',
        imageUrl: '',
        publicId: '',
      });
    } catch (err) {
      console.error('Error updating dish:', err);
      alert(' Failed to update dish.');
    }
  };

  return (
    <div className="container mt-5">
      <h3 className="text-golden elegant-title mb-4">Manage Dishes</h3>
      <div className="table-responsive">
        <table className="table table-bordered text-center">
          <thead className="table-light">
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Edit Image</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {dishes.map((dish) => (
              <tr key={dish._id}>
                <td>
                  <img
                    src={dish.imageUrl}
                    alt={dish.name}
                    style={{ width: '80px', borderRadius: '5px' }}
                  />
                </td>
                <td>
                  {editingDish === dish._id ? (
                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    dish.name
                  )}
                </td>
                <td>
                  {editingDish === dish._id ? (
                    <input
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : (
                    dish.category
                  )}
                </td>
                <td>
                  {editingDish === dish._id ? (
                    <input
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      className="form-control"
                    />
                  ) : typeof dish.price === 'object' ? (
                    <>
                      Half: ₹{dish.price.half || '-'} <br />
                      Full: ₹{dish.price.full || '-'}
                    </>
                  ) : (
                    <>₹{dish.price}</>
                  )}
                </td>
                <td>
                  {editingDish === dish._id ? (
                    <>
                      <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="form-control"
                      />
                      {formData.imageUrl && (
                        <img
                          src={formData.imageUrl}
                          alt="Preview"
                          style={{ width: '60px', marginTop: '5px' }}
                        />
                      )}
                    </>
                  ) : (
                    '—'
                  )}
                </td>
                <td>
                  {editingDish === dish._id ? (
                    <>
                      <button
                        className="btn btn-success btn-sm me-2"
                        onClick={handleEditSubmit}
                      >
                        Save
                      </button>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setEditingDish(null)}
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="btn btn-primary btn-sm me-2"
                        onClick={() => handleEditClick(dish)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => deleteDish(dish._id)}
                      >
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ManageDishes;