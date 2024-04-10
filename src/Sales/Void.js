import React, { useState } from "react";
import axios from 'axios';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Table, TableHead, TableBody, TableRow, TableCell, Typography,TextField } from '@mui/material';
// import { style } from "@mui/system";

function VoidBill() {
    const [prescriptionId, setPrescriptionId] = useState('');
    const [voided, setVoided] = useState(false);
    const [voidedData, setVoidedData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const apiurl=process.env.React_App_API_URL;

  const isSelected = (idx) => selectedDrugs.indexOf(idx) !== -1;

  const handleToggleDrug = (idx) => {
    const selectedIndex = selectedDrugs.indexOf(idx);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selectedDrugs, idx);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selectedDrugs.slice(1));
    } else if (selectedIndex === selectedDrugs.length - 1) {
      newSelected = newSelected.concat(selectedDrugs.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selectedDrugs.slice(0, selectedIndex),
        selectedDrugs.slice(selectedIndex + 1)
      );
    }

    setSelectedDrugs(newSelected);
  };
  const handleDeleteSelectedDrugs = () => {
    // Filter out the drugs that are not selected
    const updatedVoidedData = voidedData.map((prescription, idx) => {
      if (isSelected(idx)) {
        return {
          ...prescription,
          Drug_name: prescription.Drug_name.filter((drug, i) => !isSelected(i)),
          per_unit_price: prescription.per_unit_price.filter((price, i) => !isSelected(i)),
          Drug_quantity: prescription.Drug_quantity.filter((quantity, i) => !isSelected(i))
        };
      }
      return prescription;
    });
  
    // Update the state with the filtered data
    setVoidedData(updatedVoidedData);
  };
  
  const handleQuantityChange = (value, idx) => {
    // Update the quantity of the drug at the specified index
    const updatedVoidedData = voidedData.map((prescription, i) => {
      if (i === idx) {
        return {
          ...prescription,
          Drug_quantity: prescription.Drug_quantity.map((quantity, j) => (j === idx ? value : quantity))
        };
      }
      return prescription;
    });
  
    // Update the state with the updated data
    setVoidedData(updatedVoidedData);
  };
  
  const handlePriceChange = (value, idx) => {
    // Update the price of the drug at the specified index
    const updatedVoidedData = voidedData.map((prescription, i) => {
      if (i === idx) {
        return {
          ...prescription,
          per_unit_price: prescription.per_unit_price.map((price, j) => (j === idx ? value : price))
        };
      }
      return prescription;
    });
  
    // Update the state with the updated data
    setVoidedData(updatedVoidedData);
  };
 
  const handleVoidBill = async () => {
    try {
      const response = await axios.get(`${apiurl}/api/pharmacy_billing/:${prescriptionId}`);
      setVoidedData(response.data);
      setVoided(true);
    } catch (error) {
      console.error('Error voiding bill:', error);
      // Handle error, show error message, etc.
    }
  };

  const handleViewDetails = (prescription) => {
    setSelectedPrescription(prescription);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };
  const handleDeleteTransaction = async () => {
    try {
      // Add logic here to delete the entire transaction
      // For example:
      // const response = await axios.delete(`${apiurl}/api/transactions/${selectedPrescription.transaction_id}`);
      // Handle success response and update state accordingly
      // setSuccessMessage('Transaction deleted successfully');
      // Update state to reflect the deletion
      // setVoidedData(null);
    } catch (error) {
      console.error('Error deleting transaction:', error);
      // Handle error, show error message, etc.
    }
  };
  
  const handleDeleteMedicine = async (idx) => {
    try {
      // Add logic here to delete the individual medicine
      // For example:
      // const updatedDrugs = selectedPrescription.Drug_name.filter((_, index) => index !== idx);
      // const updatedQuantities = selectedPrescription.Drug_quantity.filter((_, index) => index !== idx);
      // const updatedPrices = selectedPrescription.per_unit_price.filter((_, index) => index !== idx);
      // Update state with the updated drug details
      // setSelectedPrescription({
      //   ...selectedPrescription,
      //   Drug_name: updatedDrugs,
      //   Drug_quantity: updatedQuantities,
      //   per_unit_price: updatedPrices
      // });
      // Handle success response and update state accordingly
      // setSuccessMessage('Medicine deleted successfully');
    } catch (error) {
      console.error('Error deleting medicine:', error);
      // Handle error, show error message, etc.
    }
  };
  

  return (
    <div>
      <TextField
        label="Prescription ID"
        value={prescriptionId}
        onChange={(e) => setPrescriptionId(e.target.value)}
        variant="outlined"
        style={{ marginRight: '10px', marginTop: '10px' }}
      />
      <Button variant="contained" style={{ backgroundColor: '#178CA4', marginTop: '20px' }} onClick={handleVoidBill}>Search</Button>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>Prescription Details</DialogTitle>
        <DialogContent>
          {selectedPrescription && (
            <div>
            <Typography>Prescription ID: {selectedPrescription.Prescription_id}</Typography>
            <Typography>Patient ID: {selectedPrescription.Patient_id}</Typography>
            <Typography>Patient Name: {selectedPrescription.Patient_name}</Typography>
            <Typography>Date of Sale: {new Date(selectedPrescription.Date_sale).toLocaleString()}</Typography>
            <Typography>Total Amount: {typeof selectedPrescription.Total_amount === 'number' ? selectedPrescription.Total_amount.toFixed(2) : selectedPrescription.Total_amount}</Typography>
            <Typography>Payment Type: {selectedPrescription.payment_type}</Typography>
            <Typography>Status: {selectedPrescription.status}</Typography>
            <Typography>Transaction ID: {selectedPrescription.transaction_id}</Typography>
            <Typography>Created Timestamp: {new Date(selectedPrescription.creat_tmst).toLocaleString()}</Typography>
            <Typography>Drug Details:</Typography>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Drug Name</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Price per unit</TableCell>
                    </TableRow>
              </TableHead>
              <TableBody>
  {selectedPrescription.Drug_name.map((drug, idx) => (
    <TableRow key={idx}  >
      <TableCell>{drug}</TableCell>
      <TableCell>
        <TextField
          value={selectedPrescription.Drug_quantity[idx]}
          onChange={(e) => handleQuantityChange(e.target.value, idx)}
        />
      </TableCell>
      <TableCell>{selectedPrescription.per_unit_price[idx]}</TableCell>
      <TableCell>
        <Checkbox
          checked={isSelected(idx)}
          onChange={() => handleToggleDrug(idx)}
        />
      </TableCell>
      <TableCell>
         <Button variant="contained" style ={{backgroundColor: '#178CA4', color:'white', marginTop:'5%'}}  onClick={() => handleDeleteMedicine(idx)}>Delete Medicine</Button>
      </TableCell>
    </TableRow>
  ))}
</TableBody>
            </Table>
            <Button variant="contained" style ={{backgroundColor: '#178CA4', color:'white'}}  onClick={handleDeleteTransaction}>Delete Transaction</Button>
          </div>
          )}
          
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {voidedData && (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Prescription ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Date of Sale</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {voidedData.map((prescription, index) => (
              <TableRow key={index}>
                <TableCell>{prescription.Prescription_id}</TableCell>
                <TableCell>{prescription.Patient_id}</TableCell>
                <TableCell>{prescription.Patient_name}</TableCell>
                <TableCell>{new Date(prescription.Date_sale).toLocaleString()}</TableCell>
                <TableCell>{typeof prescription.Total_amount === 'number' ? prescription.Total_amount.toFixed(2) : prescription.Total_amount}</TableCell>
                <TableCell>
                  <Button variant="contained" style={{ backgroundColor: '#178CA4' }} onClick={() => handleViewDetails(prescription)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

export default VoidBill;
