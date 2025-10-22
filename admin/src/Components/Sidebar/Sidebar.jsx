import React from 'react';
import './Sidebar.css';
import { NavLink } from 'react-router-dom';
import add_product_icon from '../../assets/Product_Cart.svg';
import list_product_icon from '../../assets/Product_list_icon.svg';

const Sidebar = () => {
  return (
    <div className='sidebar'>
      <NavLink
        to="/admin/addproduct"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        style={{ textDecoration: 'none' }}
      >
        <div className='sidebar-item'>
          <img src={add_product_icon} alt='Add product' />
          <p>Add Product</p>
        </div>
      </NavLink>

      <NavLink
        to="/admin/listproduct"
        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
        style={{ textDecoration: 'none' }}
      >
        <div className='sidebar-item'>
          <img src={list_product_icon} alt='Product list' />
          <p>Product List</p>
        </div>
      </NavLink>
    </div>
  );
};

export default Sidebar;
