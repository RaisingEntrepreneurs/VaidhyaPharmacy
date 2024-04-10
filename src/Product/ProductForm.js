import React, { useState,useRef } from 'react';
import axios from 'axios';
import { TextField, Button, Grid,InputLabel } from '@mui/material';

function ProductForm({ onSubmit }) {
  const [inventory, setInventory] = useState([]);
const fileInputRef = useRef(null);
const apiurl=process.env.React_App_API_URL;
  /////CSV handling /////
const handleFileUpload = async event => {
  const file = event.target.files[0];
  if (file) {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${apiurl}/api/uploadinventory`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      // Refresh inventory data after uploading
      fetchInventory();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

const fetchInventory = async () => {
  try {
    const response = await axios.get(`${apiurl}/api/inventory`);
    setInventory(response.data);
  } catch (error) {
    console.error('Error fetching inventory:', error);
  }
};


const handleImportInventory = () => {
  fileInputRef.current.click(); // Trigger file input click event
};

const handleExportInventory = () => {
  fetchInventory();
  const inventoryCSV = convertInventoryToCSV(inventory);

  // Create a Blob object containing the CSV data
  const blob = new Blob([inventoryCSV], { type: 'text/csv' });

  // Create a link element to trigger the download
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'inventory.csv';

  // Simulate a click on the link to start the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
};

const convertInventoryToCSV = (data) => {
  // Your CSV conversion logic
  let csv = 'inventory_id,product_id,product_name,category,manufacturer,batch_number,expiration_date,purchase_price,selling_price,stock_quantity,minimum_stock_level,maximum_stock_level,reorder_level,location,gst_rate,package_type,units_per_package,schedule_category,creat_tmst,remainder,dosage\n';
  data.forEach(item => {
    csv += `${item.inventory_id},${item.product_id},${item.product_name},${item.category},${item.manufacturer},${item.batch_number},${item.expiration_date},${item.purchase_price},${item.selling_price},${item.stock_quantity},${item.minimum_stock_level},${item.maximum_stock_level},${item.reorder_level},${item.location},${item.gst_rate},${item.package_type},${item.units_per_package},${item.schedule_category},${item.creat_tmst},${item.remainder},${item.dosage}\n`;
  });

  return csv;
};

  
  const initialState = {
    Product_id: '',
    Product_name: '',
    Generic_name: '',
    Manufacturer: '',
    Dosage_form: '',
    Expiry_date: '',
    Price_per_unit: '',
    Category: '',
    Batch_number: '',
    Selling_price: '',
    Stock_quantity: '',
    Minimum_stock_level: '',
    Maximum_stock_level: '',
    Reorder_level: '',
    Location: '',
    Gst_rate: '',
    Package_type: '',
    Units_per_package: '',
    Schedule_category: '',
    Remainder: '',
  };
 
    const [productData, setProductData] = useState(initialState);
    const [emptyFields, setEmptyFields] = useState([]);
    const [successMessage, setSuccessMessage] = useState('');
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      console.log('Changing:', name, value);
      setProductData({ ...productData, [name]: value });
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      const emptyFields = Object.entries(productData)
        .filter(([key, value]) => value.trim() === '')
        .map(([key, value]) => key);
      console.log('Empty fields:', emptyFields);
      if (emptyFields.length > 0) {
        setEmptyFields(emptyFields);
        return;
      }
    
      try {
        console.log('Submitting form:', productData);
        const response = await axios.post(`${apiurl}/api/inventory/`, productData);
        console.log('Response:', response.data);
        setSuccessMessage(response.data.message);
        setProductData(initialState);
      } catch (error) {
        console.error('Error submitting form:', error);
        // Handle error, show error message, etc.
      }
    };
    
  return (
    <form onSubmit={handleSubmit} className="product-form">
  <div style={{ display: 'flex', alignItems: 'center' }}>
    <h3 style={{ color: '#18B7BE', fontSize: '24px', marginBottom: '10px' }}>Add Product</h3>
    <div style={{ flexGrow: 1 }}></div> {/* Spacer to push buttons to the right */}
    <div style={{ display: 'flex', marginTop: '10px' , marginBottom:'30px'}}>
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: '#178CA4', marginRight: '20px' }}
        onClick={handleImportInventory}
      >
        Import Inventory
      </Button>
      <input
        type="file"
        accept=".csv"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />
      <Button
        variant="contained"
        color="primary"
        style={{ backgroundColor: '#178CA4', marginLeft: '10px' }}
        onClick={handleExportInventory}
      >
        Export Inventory
      </Button>
    </div>
    </div>
    <Grid container spacing={3}>
        {Object.entries(productData).map(([key, value]) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={key}>
            <InputLabel htmlFor={key} style={{ color: emptyFields.includes(key) ? 'red' : 'inherit' }}>{`${key.replace(/_/g, ' ')}${emptyFields.includes(key) ? '*' : ''}`}</InputLabel>
            {key === 'Expiry_date' ? (
              <TextField
                id={key}
                name={key}
                type="date"
                value={value}
                onChange={handleChange}
                variant="outlined"
                fullWidth
                InputLabelProps={{ shrink: true }}
              />
            ) : (
              <TextField
                id={key}
                name={key}
                value={value}
                onChange={handleChange}
                variant="outlined"
                fullWidth
              />
            )}
          </Grid>
        ))}
      </Grid>
              {/* End of New Fields */}
        <Grid item sm={2}>
        {emptyFields.length > 0 && (
        <p style={{ color: 'red' }}>Please fill in the required fields.</p>
      )}
      {successMessage && <p>{successMessage}</p>}
      <Button type="submit" variant="contained" color="primary" style={{ backgroundColor: '#178CA4',marginTop:'4%' }}>Add</Button>
        </Grid>
      
      <hr style={{ width: '100%', color: '#18B7BE', backgroundColor: '#18B7BE', height: '1px', border: 'none' }} />
    </form>
  );
}

export default ProductForm;
