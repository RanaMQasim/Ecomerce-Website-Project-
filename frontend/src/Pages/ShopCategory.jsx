import React, { useContext, useEffect, useState } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../context/ShopContext";
import dropdown_icon from "../components/Assets/dropdown_icon.png";
import Item from "../components/Item/Item";

export default function ShopCategory({ banner, category }) {
  const { all_product } = useContext(ShopContext);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    if (all_product?.length) {
      const filtered = all_product.filter(
        (item) => item.category?.toLowerCase() === category?.toLowerCase()
      );
      setFilteredProducts(filtered);
    }
  }, [all_product, category]);

  return (
    <div className="shop-category">
      <img className="shopcategory-banner" src={banner} alt="Category banner" />

      <div className="shopcategory-indexSort">
        <p>
          Showing <span>{filteredProducts.length}</span> product
          {filteredProducts.length !== 1 && "s"}
        </p>
        <div className="shopcategory-sort">
          Sort by <img src={dropdown_icon} alt="Sort dropdown" />
        </div>
      </div>

      <div className="shopcategory-products">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((item) => (
            <Item key={item._id || item.id} item={item} />
          ))
        ) : (
          <p className="no-products">No products found in this category.</p>
        )}
      </div>

      <div className="shopcategory-loadmore">Explore More</div>
    </div>
  );
}
