import React, { useState, useEffect } from "react";
import "./AddProduct.css";
import upload_area from "../../assets/upload_area.svg";

const AddProduct = () => {
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  const [productDetails, setProductDetails] = useState({
    name: "",
    category: "women",
    price: "", 
    discountPrice: "",
  });
  useEffect(() => {
    if (!image) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(image);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);
  const changeHandler = (e) => {
    setProductDetails({
      ...productDetails,
      [e.target.name]: e.target.value,
    });
  };
  const imageHandler = (e) => {
    const file = e.target.files[0];
    if (file) setImage(file);
  };
  const addProduct = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { name, category, price, discountPrice } = productDetails;
      if (!name || !price) {
        alert("Product name and original price are required.");
        setLoading(false);
        return;
      }
      if (discountPrice && Number(discountPrice) >= Number(price)) {
        alert("Offer price must be less than original price.");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("discountPrice", discountPrice);
      formData.append("category", category);
      if (image) formData.append("images", image);

      const res = await fetch("http://localhost:4000/api/products", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Upload failed");

      alert("Product added successfully!");
      setProductDetails({ name: "", category: "women", price: "", discountPrice: "" });
      setImage(null);
    } catch (err) {
      alert("Failed to add product: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-product-container">
      <form className="add-product-form" onSubmit={addProduct}>
        <h2 className="form-title">Add New Product</h2>
        <div className="form-group">
          <label>Product Title</label>
          <input
            type="text"
            name="name"
            value={productDetails.name}
            onChange={changeHandler}
            placeholder="Enter product name"
            required
          />
        </div>
        <div className="form-group prices">
          <div>
            <label>Original Price ($)</label>
            <input
              type="number"
              name="price"
              value={productDetails.price}
              onChange={changeHandler}
              placeholder="Enter original price"
              required
            />
          </div>
          <div>
            <label>Offer Price ($)</label>
            <input
              type="number"
              name="discountPrice"
              value={productDetails.discountPrice}
              onChange={changeHandler}
              placeholder="Enter discounted price (optional)"
            />
          </div>
        </div>
        <div className="form-group">
          <label>Category</label>
          <select
            name="category"
            value={productDetails.category}
            onChange={changeHandler}
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="kid">Kid</option>
          </select>
        </div>
        <div className="form-group">
          <label>Product Image</label>
          <div className="image-upload">
            <label htmlFor="file-input">
              <img
                src={previewUrl || upload_area}
                alt="Upload"
                className="thumbnail"
              />
              <span className="upload-text">
                {image ? "Change Image" : "Click to upload image"}
              </span>
            </label>
            <input
              type="file"
              id="file-input"
              accept="image/*"
              onChange={imageHandler}
              hidden
            />
          </div>
        </div>
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Uploading..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};
export default AddProduct;