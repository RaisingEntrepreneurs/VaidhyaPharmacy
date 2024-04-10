import React, { useState, useEffect } from 'react';
import Adminheader from '../Admin/adminheader';
import axios from 'axios';
import { Button, Grid, Typography, Table, TableHead, TableBody, TableRow, TableCell, Select, MenuItem, TextField } from '@mui/material';
import SessionValidationHOC from "../Homepage/SessionValidationHOC";
import { useNavigate } from 'react-router-dom';
import { checkInactivity } from "../Homepage/sessionService";

const OrderManagement = () => {

  const [vendorOptions, setVendorOptions] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState('');
  const [productName, setProductName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [dosage,setDosage] = useState("")
  const [orders, setOrders] = useState([]);
  const [orderDetails, setOrderDetails] = useState([]);
  const apiurl=process.env.React_App_API_URL;
  const navigate = useNavigate();

    useEffect(() => {
        
        const intervalId = setInterval(() => {
            checkInactivity(navigate); // Pass navigate to the checkInactivity function
        }, 60 * 1000); // Check every minute

        return () => clearInterval(intervalId);
    }, [navigate]);

  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const response = await axios.get(`${apiurl}/api/vendors`);
        setVendorOptions(response.data);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      }
    };

    fetchVendors();
  }, [apiurl]);
  useEffect(() => {
    const fetchInventoryOrders = async () => {
      try {
        const inventoryResponse = await axios.get(`${apiurl}/api/inventory_order`);
        const inventoryOrders = inventoryResponse.data;
  
        const vendorResponse = await axios.get(`${apiurl}/api/vendors`);
        const vendors = vendorResponse.data;
        
        const updatedOrders = inventoryOrders.map(order => ({
          ...order,
          vendors
        }));
     console.log(updatedOrders);
        setOrders(updatedOrders);
  
        // Initialize order details state with default values for each order
        const initialOrderDetails = updatedOrders.map(vendors => ({
          quantity: '', // Initialize quantity to empty string
          selectedVendor: '' // Initialize selected vendor to empty string
        }));
       
        setOrderDetails(initialOrderDetails);
      } catch (error) {
        console.error('Error fetching inventory orders:', error);
      }
    };
  
    fetchInventoryOrders();
  }, [apiurl]);
     
  const handleAddOrder = async (index) => {
    try {
      if (orders[index] && orders[index].product_name && orderDetails[index]) {
        const response = await axios.post(`${apiurl}/api/orders`, {
          user_id: 'user123',
          order_product: orders[index].product_name,
          order_quantity: orderDetails[index].o_quantity,
          vendor: orderDetails[index].selectedVendor, 
          order_status: 'pending'
        });
        console.log('Order created:', response.data);
      } else {
        console.error('Error creating order: Invalid order data', index, orders, orderDetails);
      }
    } catch (error) {
      console.error('Error creating order:', error.message);
    }
  };
  

  const handleQuantityChange = (index, value) => {
    const updatedOrderDetails = [...orderDetails];
    updatedOrderDetails[index].o_quantity = value;
    setOrderDetails(updatedOrderDetails);
  };
  const handleVendorChange = (index, value) => {
    const updatedOrderDetails = [...orderDetails];
    updatedOrderDetails[index].selectedVendor = value;
    setOrderDetails(updatedOrderDetails);
  };
  

  const handleProductNameChange = (event) => {
    setProductName(event.target.value);
  };

  const handleCheckProduct = async () => {
    try {
      const response = await fetch(`${apiurl}/api/inventory/${productName}`);
      const data = await response.json();
      console.log('data', data);
      if (data && data.length > 0) {
        // Product found, set dosage and product name
        const { dosage, product_name } = data[0]; // Assuming data is an array with one element
        setDosage(dosage);
        setProductName(product_name);
        console.log('Product exists:', data);
      } else {
        // Product not found, you can add logic to add the new product here
        console.log('Product does not exist, adding...');
        // Add logic to add the new product
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Handle error, show error message, etc.
    }
  };
  

  const handleQuantityInputChange = (event) => {
    setQuantity(event.target.value);
  };
  const handleDosageInputChange = (event) => {
    setDosage(event.target.value);
  };

  const handleVendorSelectChange = (event) => {
    setSelectedVendor(event.target.value);
  };

  const handleAddClick = () => {
    if (selectedVendor && productName && quantity && dosage)  {
      // Create a new order detail object with the selectedVendor property
      const newOrderDetail = { quantity, selectedVendor ,dosage};
      // Add the new order detail to the orderDetails state
      setOrderDetails([...orderDetails, newOrderDetail]);
      // Create a new order object without the vendor property
      const newOrder = { product_name: productName };
      // Add the new order to the orders state
      setOrders([...orders, newOrder]);
      setProductName('');
      setQuantity('');
      setSelectedVendor('');
      setDosage('');
    } else {
      alert('Please select a vendor, enter a product name, and enter a quantity.');
    }
  };

  useEffect(() => {
    const fetchInventoryOrders = async () => {
      try {
        const inventoryResponse = await axios.get(`${apiurl}/api/inventory_order`);
        const inventoryOrders = inventoryResponse.data;
  
        const vendorResponse = await axios.get(`${apiurl}/api/vendors`);
        const vendors = vendorResponse.data;
  
        const updatedOrders = inventoryOrders.map(order => ({
          ...order,
          vendors
        }));
  
        setOrders(updatedOrders);
  
        // Initialize order details state with default values for each order
        const initialOrderDetails = updatedOrders.map(order => ({
          quantity: '', // Initialize quantity to empty string
          vendor: '' // Initialize selected vendor to empty string
        }));
        setOrderDetails(initialOrderDetails);
      } catch (error) {
        console.error('Error fetching inventory orders:', error);
      }
    };
  
    fetchInventoryOrders();
  }, [apiurl]);
  const handleReturnOrderClick = () => {
    // Redirect to the desired page
    window.location.href = '/return';
  };
 
  return (
    <div>
      <div>
        <Adminheader />
        <Grid container justifyContent="flex-end" alignItems="center" style={{marginTop:'2%'}}>
          <Grid item style={{marginRight:'2%'}}>
            <Button variant="contained" style={{backgroundColor: '#178CA4', color:'white'}} onClick={handleReturnOrderClick}>Return</Button>
          </Grid>
        </Grid>
      </div>
      <Typography style={{color:'#18B7BE'}} variant="h4">New Order</Typography>
      <div>
  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <div style={{ marginRight: '5%' }}>
      <label htmlFor="productName">Product Name:</label>
      <input
        type="text"
        id="productName"
        value={productName}
        onChange={handleProductNameChange}
        placeholder="Enter product name"
      />
    </div>
    <button onClick={handleCheckProduct}>Check Product</button>
  </div>

  <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
    <div style={{ marginRight: '5%' }}>
      <label htmlFor="quantity">Quantity:</label>
      <input
        type="number"
        id="quantity"
        value={quantity}
        onChange={handleQuantityInputChange}
        placeholder="Enter quantity"
      />
    </div>
    <div style={{ marginRight: '5%' }}>
      <label htmlFor="Dosage">Dosage:</label>
      <input
        type="number"
        id="Dosage"
        value={dosage}
        onChange={handleDosageInputChange}
        placeholder="Enter dosage"
      />
    </div>
    <div style={{ marginRight: '5%' }}>
      <label htmlFor="vendor">Vendor:</label>
      <select
        id="vendor"
        value={selectedVendor}
        onChange={handleVendorSelectChange}
      >
        <option value="">Select a vendor</option>
        {vendorOptions.map((vendor) => (
          <option key={vendor.vendor_id} value={vendor.vendor_name}>
            {vendor.vendor_name}
          </option>
        ))}
      </select>
    </div>
    <Button variant="contained" style={{ backgroundColor: '#178CA4', color: 'white' }} onClick={handleAddClick}>
      Order
    </Button>
  </div>
</div>

      <div>
        <Typography variant="h5" style={{ color:'#18B7BE', marginTop:'2%' }}>List Of Pending Orders</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product Name</TableCell>
              <TableCell>In stock</TableCell>
              <TableCell>Quantity</TableCell>
              <TableCell>Vendor</TableCell>
              <TableCell>Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orders.map((order, index) => (
              <TableRow key={index}>
                <TableCell>{order.item_name}</TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <TextField 
                    type="number" 
                    value={order.o_quantity} 
                    onChange={(e) => handleQuantityChange(index, e.target.value)} 
                  />
                </TableCell>
                <TableCell>
                  <Select
                    value={orderDetails[index] ? orderDetails[index].selectedVendor : ''}
                    onChange={(e) => handleVendorChange(index, e.target.value)}
                  >
                    <MenuItem value="">Select vendor</MenuItem>
                    {order.vendors.map((vendor, vendorIndex) => (
                      <MenuItem key={vendorIndex} value={vendor.vendor_name}>
                        {vendor.vendor_name}
                      </MenuItem>
                    ))}
                  </Select>
                </TableCell>
                <TableCell>
                  <Button variant="contained" style={{ backgroundColor: '#178CA4', color: 'white' }} onClick={() => handleAddOrder(order.product_name, order.quantity, order.vendor)}>Order</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
  
};

export default SessionValidationHOC(OrderManagement);
