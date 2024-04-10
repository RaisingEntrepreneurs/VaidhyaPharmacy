import React, { useState, useEffect,useCallback } from 'react';
import axios from 'axios';
import ProductTable from './ProductTable';
import ProductForm from './ProductForm';
import Adminheader from '../Admin/adminheader';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { checkInactivity } from '../Homepage/sessionService';
import SessionValidationHOC from '../Homepage/SessionValidationHOC';
import { useNavigate } from 'react-router-dom';

function Products() {
  const [products, setProducts] = useState([]);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const apiurl=process.env.React_App_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
      
      const intervalId = setInterval(() => {
          checkInactivity(navigate); // Pass navigate to the checkInactivity function
      }, 60 * 1000); // Check every minute

      return () => clearInterval(intervalId);
  }, [navigate]);

  const fetchProducts = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/api/inventory`);
      setProducts(response.data);
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }, [apiurl]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);



  const refreshTable = () => {
    fetchProducts();
  };

  const handleAddProduct = async (productData) => {
    try {
      const response = await axios.post(`${apiurl}/api/inventory`, productData);
      setProducts((prevProducts) => [...prevProducts, response.data]);
    } catch (error) {
      console.error('Error adding product:', error);
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      await axios.delete(`${apiurl}/api/inventory/${productId}`);
      setProducts((prevProducts) => prevProducts.filter((product) => product.Product_id !== productId));
      setShowConfirmation(true);
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleUpdateProduct = async (productId, updatedProductData) => {
    try {
      await axios.put(`${apiurl}/api/inventory/${productId}`, updatedProductData);
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.Product_id === productId ? { ...product, ...updatedProductData } : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  const handleConfirmDelete = () => {
    handleDeleteProduct();
    refreshTable(); // Example function to refresh the table
    setShowConfirmation(false);
  };

  const handleCancelDelete = () => {
    setShowConfirmation(false);
  };

  return (
    <div>
      <Adminheader />
      <div style={{ paddingLeft: '20px' }}>
        <ProductForm onSubmit={handleAddProduct} />
        <ProductTable products={products} onDelete={handleDeleteProduct} onUpdate={handleUpdateProduct} />
      </div>
      {/* Confirmation dialog */}
      <Dialog open={showConfirmation} onClose={handleCancelDelete}>
        <DialogTitle>Delete Product</DialogTitle>
        <DialogContent>
          <p>Are you sure you want to delete this product  "{products?.productName}"?</p>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCancelDelete} color="secondary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="primary">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default SessionValidationHOC(Products);
