import React from 'react';
import './Admin.css';
import Sidebar from '../../Components/Sidebar/Sidebar';
import AddProduct from '../../Components/AddProduct/AddProduct';
import ListProduct from '../../Components/ListProduct/ListProduct';
import EditProduct from '../../Components/EditProduct/EditProduct';
import { Routes, Route, Navigate } from 'react-router-dom';

const Admin = () => {
  return (
    <div className='admin'>
      <Sidebar />
      <div className="admin-content">
        <Routes>
          <Route index element={<AddProduct />} />
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="listproduct" element={<ListProduct />} /> 
          <Route path="edit-product/:id" element={<EditProduct />} />
          <Route path="*" element={<Navigate to="addproduct" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;
