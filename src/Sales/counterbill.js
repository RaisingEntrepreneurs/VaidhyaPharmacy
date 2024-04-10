import React, { useState } from 'react';
import { Button, Grid } from '@mui/material';
import { QrReader } from 'react-qr-reader';

function OverTheCounterSale() {
  const [scannedProduct, setScannedProduct] = useState(null);
  const [totalAmount, setTotalAmount] = useState(0);

  // Function to handle product scanning
  const handleScan = (scannedData) => {
    if (scannedData) {
      // Use scannedData to look up product information from the database
      const productInfo = lookupProduct(scannedData);
      setScannedProduct(productInfo);

      // Update total amount
      setTotalAmount(totalAmount + productInfo.price);
    }
  };

  // Function to handle scan errors
  const handleError = (error) => {
    console.error(error);
  };

  // Function to look up product information
  const lookupProduct = (scannedData) => {
    // Implement logic to fetch product information from the database based on scannedData
    // Example:
    return {
      name: 'Product Name',
      price: 10.99, // Sample price
    };
  };

  // Function to handle sale completion
  const handleCompleteSale = () => {
    // Implement logic to complete the sale, e.g., payment processing
    // Reset scannedProduct and totalAmount for the next sale
    setScannedProduct(null);
    setTotalAmount(0);
  };

  return (
    <div>
      {/* Scanner integration */}
      <QrReader
        delay={300}
        onError={handleError}
        onScan={handleScan}
        style={{ width: '100%' }}
      />

      {/* Display scanned product information */}
      {scannedProduct && (
        <div>
          <h3>Scanned Product</h3>
          <p>Name: {scannedProduct.name}</p>
          <p>Price: ${scannedProduct.price}</p>
        </div>
      )}

      {/* Total amount */}
      <h3>Total: ${totalAmount}</h3>

      {/* Buttons for actions */}
      <Grid container spacing={2}>
        <Grid item>
          <Button variant="contained" color="primary" onClick={handleCompleteSale}>
            Complete Sale
          </Button>
        </Grid>
      </Grid>
    </div>
  );
}

export default OverTheCounterSale;

