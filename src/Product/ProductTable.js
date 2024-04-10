import React, { useState, useEffect,useCallback  } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import axios from 'axios';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Paper,
  TextField,
  InputAdornment
} from '@mui/material';

function ProductTable({ products, onDelete, onUpdate }) {
  const [searchResults, setSearchResults] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({
    product_id: '',
    product_name: '',
    category: '',
    manufacturer: '',
    batch_number: '',
    expiration_date: '',
    purchase_price: '',
    selling_price: '',
    stock_quantity: '',
    minimum_stock_level: '',
    maximum_stock_level: '',
    reorder_level: '',
    location: '',
    gst_rate: '',
    package_type: '',
    units_per_package: '',
    schedule_category: '',
    creat_tmst: ''
  });
  const apiurl=process.env.React_App_API_URL;
  

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/api/inventory`);
      setSearchResults(response.data);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [apiurl]);
  
  useEffect(() => {
    // Fetch initial inventory data
    fetchInventory();
  }, [fetchInventory]);


  const handleSearchChange = async (event) => {
    setSearchTerm(event.target.value);
    try {
      const response = await axios.get(`${apiurl}/api/inventory/${event.target.value}`);
      setSearchResults(response.data);
      // If no results found, enable adding new drug
      if (response.data.length === 0) {
        setShowUpdateModal(true);
        setSelectedProduct(null);
        setUpdatedProductData({
          product_name: event.target.value,
          category: '',
          manufacturer: '',
          batch_number: '',
          expiration_date: '',
          purchase_price: '',
          selling_price: '',
          stock_quantity: '',
          minimum_stock_level: '',
          maximum_stock_level: '',
          reorder_level: '',
          location: '',
          gst_rate: '',
          package_type: '',
          units_per_package: '',
          schedule_category: '',
          creat_tmst: ''
        });
      }
    } catch (error) {
      console.error('Error searching products:', error);
    }
  };

  const handleUpdateClick = (product) => {
    setSelectedProduct(product);
    setUpdatedProductData({ ...product });
    setShowUpdateModal(true);
  };

  const handleSaveUpdate = () => {
    onUpdate(selectedProduct.product_id, updatedProductData);
    setShowUpdateModal(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUpdatedProductData({ ...updatedProductData, [name]: value });
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  return (
    <div style={{ marginBottom: '250px' }}>
      <h3 style={{ color: '#18B7BE', fontSize: '24px', marginBottom: '10px' }}>Search Medicine</h3>
      <TextField
        fullWidth
        placeholder="Search by Medicine Name"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: '#18B7BE' }}>Product ID</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Product Name</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Dosage</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Category</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Manufacturer</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Batch Number</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Expiration Date</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Purchase Price</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Selling Price</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Stock Quantity</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Minimum Stock Level</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Maximum Stock Level</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Reorder Level</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Location</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>GST Rate</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Package Type</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Units per Package</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Schedule Category</TableCell>
              <TableCell sx={{ color: '#18B7BE' }}>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {searchTerm
              ? searchResults.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.dosage}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.manufacturer}</TableCell>
                  <TableCell>{product.batch_number}</TableCell>
                  <TableCell>{product.expiration_date ? formatDate(product.expiration_date) : ''}</TableCell>
                  <TableCell>{product.purchase_price}</TableCell>
                  <TableCell>{product.selling_price}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>{product.minimum_stock_level}</TableCell>
                  <TableCell>{product.maximum_stock_level}</TableCell>
                  <TableCell>{product.reorder_level}</TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>{product.gst_rate}</TableCell>
                  <TableCell>{product.package_type}</TableCell>
                  <TableCell>{product.units_per_package}</TableCell>
                  <TableCell>{product.schedule_category}</TableCell>

                  <TableCell>
                    <Button onClick={() => handleUpdateClick(product)} style={{ backgroundColor: '#178CA4', color: 'white' }}>Update</Button>
                    <Button onClick={() => onDelete(product.product_id)} style={{ backgroundColor: '#178CA4', color: 'white' }}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))
              : products.map((product) => (
                <TableRow key={product.product_id}>
                  <TableCell>{product.product_id}</TableCell>
                  <TableCell>{product.product_name}</TableCell>
                  <TableCell>{product.dosage}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell>{product.manufacturer}</TableCell>
                  <TableCell>{product.batch_number}</TableCell>
                  <TableCell>{product.expiration_date ? formatDate(product.expiration_date) : ''}</TableCell>
                  <TableCell>{product.purchase_price}</TableCell>
                  <TableCell>{product.selling_price}</TableCell>
                  <TableCell>{product.stock_quantity}</TableCell>
                  <TableCell>{product.minimum_stock_level}</TableCell>
                  <TableCell>{product.maximum_stock_level}</TableCell>
                  <TableCell>{product.reorder_level}</TableCell>
                  <TableCell>{product.location}</TableCell>
                  <TableCell>{product.gst_rate}</TableCell>
                  <TableCell>{product.package_type}</TableCell>
                  <TableCell>{product.units_per_package}</TableCell>
                  <TableCell>{product.schedule_category}</TableCell>

                  <TableCell>
                    <Button variant="contained" color="primary" className="add-button" style={{ backgroundColor: '#55c2da', marginRight: '10px' }} onClick={() => handleUpdateClick(product)}>Update</Button>
                    <Button variant="contained" color="primary" className="add-button" style={{ backgroundColor: '#55c2da' }} onClick={() => onDelete(product.product_id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      
    </div>
  );
}

export default ProductTable;
