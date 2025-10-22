import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./EditProduct.css";

const EditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [images, setImages] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);

  const fetchProduct = async () => {
    const res = await fetch(`http://localhost:4000/api/products/${id}`);
    const data = await res.json();
    if (data.success) {
      setProduct(data.product);
      setPreviewImages(data.product.images?.map(img => img.url) || []);
    }
  };

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages(files);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviewImages(urls);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", product.name);
    formData.append("category", product.category);
    formData.append("price", product.price);
    formData.append("discountPrice", product.discountPrice || 0);

    images.forEach(img => formData.append("images", img));

    const res = await fetch(`http://localhost:4000/api/products/${id}`, {
      method: "PUT",
      body: formData
    });
    const data = await res.json();
    if (data.success) {
      alert("Product updated successfully!");
      navigate("/admin/products");
    } else {
      alert("Error updating product: " + data.message);
    }
  };

  if (!product) return <p>Loading product...</p>;

  return (
    <div className="edit-product">
      <h1>Edit Product</h1>
      <form onSubmit={handleSubmit} className="edit-product-form">
        <label>
          Name:
          <input type="text" name="name" value={product.name} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input type="text" name="category" value={product.category} onChange={handleChange} required />
        </label>
        <label>
          Price:
          <input type="number" name="price" value={product.price} onChange={handleChange} required />
        </label>
        <label>
          Discount Price:
          <input type="number" name="discountPrice" value={product.discountPrice || ""} onChange={handleChange} />
        </label>
        <label>
          Images:
          <input type="file" multiple onChange={handleImageChange} />
        </label>
        <div className="edit-product-preview">
          {previewImages.map((url, index) => (
            <img key={index} src={url} alt="preview" />
          ))}
        </div>
        <button type="submit">Update Product</button>
      </form>
    </div>
  );
};

export default EditProduct;
