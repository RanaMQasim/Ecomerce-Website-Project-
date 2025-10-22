import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ListProduct.css';
import cross_icon from '../../assets/cross_icon.png';

const ListProduct = () => {
  const [allproducts, setAllproducts] = useState([]);
  const navigate = useNavigate(); 

  // Fetch all products
  const fetchInfo = async () => {
    const res = await fetch('http://localhost:4000/api/products');
    const data = await res.json();
    if (data.success) setAllproducts(data.products);
  };

  useEffect(() => {
    fetchInfo();
  }, []);

  // Remove product
  const removeProduct = async (id) => {
    await fetch(`http://localhost:4000/api/products/${id}`, { method: 'DELETE' });
    fetchInfo();
  };

  // Edit product
  const editProduct = (id) => {
    navigate(`/admin/edit-product/${id}`); 
  };

  return (
    <div className='list-product'>
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Image</p>
        <p>Title</p>
        <p>Price</p>
        <p>Discount Price</p>
        <p>Category</p>
        <p>Actions</p>
      </div>
      <div className="listproduct-allproducts">
        <hr />
        {allproducts.map((product, index) => (
          <div key={index} className="listproduct-format-main listproduct-format">
            <img
              src={product.images?.[0]?.url || ''}
              alt={product.name}
              className='listproduct-product-icon'
            />
            <p>{product.name}</p>
            <p>${product.price}</p>
            <p>${product.discountPrice || '-'}</p>
            <p>{product.category}</p>
            <div className="actions">
              <button
                onClick={() => removeProduct(product._id)}
                className='listproduct-remove-btn'
              >
                Remove
              </button>
              <button
                onClick={() => editProduct(product._id)}
                className='listproduct-edit-btn'
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ListProduct;
