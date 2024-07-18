import React, { useState, useEffect,useRef } from "react";
import axios from 'axios';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions,Paper,TableContainer, Table, TableHead, TableBody, TableRow, TableCell, Typography,TextField } from '@mui/material';
// import { style } from "@mui/system";
import Cookies from 'js-cookie';
import ReactToPrint from 'react-to-print';
function VoidBill() {
    const [prescriptionId, setPrescriptionId] = useState('');
    const [voided, setVoided] = useState(false);
    const [voidedData, setVoidedData] = useState(null);
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedPrescription, setSelectedPrescription] = useState(null);
    const [transactions, setTransactions] = useState([]);
    const [selectedDrugs, setSelectedDrugs] = useState([]);
    const [selectedMedicines, setSelectedMedicines] =  useState([  { product_name: '', purchase_price: 0, quantity: 0, stock_quantity: 0, expiration_date: '',location:'' }
  ]);
  const PrintableContent = React.forwardRef(({ selectedPrescription }, ref) => (
      <div ref={ref}>
         <Typography>Vaidhya Pharmacy</Typography>
            <Typography>Sanjay Gandhi Nagar, Bonthapalle, Domadugu,</Typography>
            <Typography>Telangana, 500043</Typography>
            <Typography>Tel:</Typography>
            <Typography>Gstin:</Typography>
        <Typography>Prescription ID: {selectedPrescription.Prescription_id}</Typography>
        <Typography>Patient ID: {selectedPrescription.Patient_id}</Typography>
        <Typography>Patient Name: {selectedPrescription.Patient_name}</Typography>
        <Typography>Date of Sale: {new Date(selectedPrescription.Date_sale).toLocaleDateString()}</Typography>
        <Typography>Total Amount: {typeof selectedPrescription.Total_amount === 'number' ? selectedPrescription.Total_amount.toFixed(2) : selectedPrescription.Total_amount}</Typography>
        <Typography>Payment Type: {selectedPrescription.payment_type}</Typography>
        <Typography>Status: {selectedPrescription.status}</Typography>
        <Typography>Transaction ID: {selectedPrescription.transaction_id}</Typography>
        <Typography>Created Timestamp: {new Date(selectedPrescription.creat_tmst).toLocaleDateString()}</Typography>
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
                    <TableRow key={idx}>
                        <TableCell>{drug}</TableCell>
                        <TableCell>
                            <TextField
                                value={selectedPrescription.Drug_quantity[idx]}
                                onChange={() => {}}
                                disabled
                            />
                        </TableCell>
                        <TableCell>{selectedPrescription.per_unit_price[idx]}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    </div>

));

  
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
  const handleDeleteTransactionAndClose = async () => {
     try {
        await handleDeleteTransaction();
        await handleCloseDialog();
    } catch (error) {
        console.error('Error deleting transaction:', error);
    }
};

const handleCloseDialogWithLog = () => {
    handleCloseDialog();
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

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const fetchTransactions = async () => {
    try {
        const response = await axios.get(`${apiurl}/api/pharmacy_billing`);
        let transactions = response.data;
        
        // Filter out voided and deleted transactions
        transactions = transactions.filter(transaction => transaction.status !== 'void' && transaction.status !== 'void updated');
        
        setTransactions(transactions); // Update state with filtered transactions
    } catch (error) {
        console.error('Error fetching transactions:', error);
        // Handle error, show error message, etc.
    }
};

useEffect(() => {
    fetchTransactions();
}, []);

const handleDeleteTransaction = async () => {
    try {
        // Fetch the current inventory data from the API
        const inventoryResponse = await axios.get(`${apiurl}/api/inventory`);
        const inventoryItems = inventoryResponse.data;

        // Check if inventory data was fetched correctly
        if (!inventoryItems || inventoryItems.length === 0) {
            throw new Error('Failed to fetch inventory data or inventory is empty');
        }

        // Assuming you have a way to identify the drugs that were part of the deleted transaction
        const drugsToDelete = selectedPrescription.Drug_name;

        // Log drugs to be deleted
        console.log('Drugs to delete:', drugsToDelete);

        // Iterate over each drug to be deleted and update its quantity in the inventory
        drugsToDelete.forEach((drug, index) => {
            const foundItem = inventoryItems.find(item => item.product_name === drug);
            if (foundItem) {
                // Find the corresponding quantity of the drug in the prescription
                const quantityToDelete = selectedPrescription.Drug_quantity[index];

                // Log the found item and the quantity to delete
                console.log('Found item:', foundItem);
                console.log('Quantity to delete:', quantityToDelete);

                // Update the stock quantity by adding back the quantity deleted
                foundItem.stock_quantity += quantityToDelete;
            } else {
                console.warn(`Drug ${drug} not found in inventory`);
            }
        });

        // Update the inventory with the new quantities
        await Promise.all(inventoryItems.map(async (item) => {
            if (item.product_id) {
                try {
                    // Log the item being updated
                    console.log('Updating item:', item.product_id, 'with new quantity:', item.stock_quantity);

                    const response = await axios.put(`${apiurl}/api/inventorystock/${item.product_id}`, {
                        stock_quantity: item.stock_quantity
                    });

                    console.log('Update response:', response.data);
                } catch (error) {
                    console.error(`Error updating item ${item.product_id}:`, error.response ? error.response.data : error.message);
                    throw error;  // Re-throw the error to stop the process if any update fails
                }
            } else {
                console.warn(`Skipping item with undefined product_id:`, item);
            }
            
        }));

        // Mark the transaction as void and specify the user who voided it
        const voidResponse = await axios.put(`${apiurl}/api/pharmacy_billing_void/${selectedPrescription.Prescription_id}`, {
            status: 'void',
            void_by: Cookies.get('userID')
        });

        // Handle success response and update state accordingly
        alert.log('Transaction deleted successfully:', voidResponse.data);

        // Re-fetch the list of transactions to update the state
        await fetchTransactions();

        setVoidedData(null);
    } catch (error) {
        console.error('Error deleting transaction:', error.response ? error.response.data : error.message);
        // Handle error, show error message, etc.
    }
};
const calculateDiscountPercentage = () => {
  if (selectedPrescription && selectedPrescription.Total_amount && selectedPrescription.Discount_amount) {
      const totalAmount = parseFloat(selectedPrescription.Total_amount);
      const discountAmount = parseFloat(selectedPrescription.Discount_amount);
      return ((discountAmount / totalAmount) * 100).toFixed(0);
  }
  return 0;
};
const handleDeleteMedicine = async (idx) => {
  try {
      // Remove the medicine at the specified index from the prescription
      const updatedDrugs = selectedPrescription.Drug_name.filter((_, index) => index !== idx);
      const updatedQuantities = selectedPrescription.Drug_quantity.filter((_, index) => index !== idx);
      const updatedPrices = selectedPrescription.per_unit_price.filter((_, index) => index !== idx);
      // Fetch the current quantity of each medicine from the inventory API
      const inventoryResponse = await axios.get(`${apiurl}/api/inventory`);
      const inventoryItems = inventoryResponse.data;
      // Update the quantity of the specific medicine being deleted
      const drugToDelete = selectedPrescription.Drug_name[idx];
      const deletedQuantity = selectedPrescription.Drug_quantity[idx];
      const updatedInventoryItems = inventoryItems.map(item => {
          if (item.product_name === drugToDelete) {
              const updatedQuantity = item.stock_quantity + deletedQuantity;
              return { ...item, stock_quantity: updatedQuantity };
          }
          return item;
      });
      // Update the quantity of each medicine in the inventory
      await Promise.all(updatedInventoryItems.map(item => {
          if (item.product_name === drugToDelete) {
              return axios.put(`${apiurl}/api/inventorystock/${item.product_id}`, {
                  stock_quantity: item.stock_quantity
              });
          }
          return null;
      }));
        // Recalculate the total amount based on the updated medicines
        const totalAmount = updatedPrices.reduce((acc, price, index) => acc + price * updatedQuantities[index], 0);
        // Generate a new record with the updated medicines and create a new bill
        const newRecord = {
            Patient_id: selectedPrescription.Patient_Id,
            Prescription_id: selectedPrescription.Prescription_id,
            Prescription: selectedPrescription.prescription,
            Patient_name: selectedPrescription.Patient_name,
            Doctor_name: selectedPrescription.doctorName,
            Drug_name: updatedDrugs,
            per_unit_price: updatedPrices,
            Date_sale: new Date().toISOString().split('T')[0],
            Drug_quantity: updatedQuantities,
            Total_amount: totalAmount,
            creat_tmst: new Date().toISOString().split('T')[0],
            payment_type: 'CASH',
            status: 'VOID_Successful',
            transaction_id: 'NULL',
            userID: Cookies.get('userID')
        };

        // Call the API to create a new billing record with the updated medicines
        const response = await axios.post(`${apiurl}/api/pharmacy_billing`, newRecord);

        // Update the previous record as "Void updated"
        const voidResponse = await axios.put(`${apiurl}/api/pharmacy_billing_void/${selectedPrescription.prescription_id}`, {
            status: 'void updated'
        });

        // Update state with the updated drug details
        setSelectedPrescription({
            ...selectedPrescription,
            Drug_name: updatedDrugs,
            Drug_quantity: updatedQuantities,
            per_unit_price: updatedPrices,
            Total_amount: totalAmount // Update total amount in state
        });
    } catch (error) {
        console.error('Error deleting medicine:', error);
        // Handle error, show error message, etc.
    }
};
const printRef = useRef();
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
      <Dialog  open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="md">
            <DialogTitle>Prescription Details</DialogTitle>
            <DialogContent>
                {selectedPrescription && (
                    <div ref={printRef} >
                        <Typography>Prescription ID: {selectedPrescription.Prescription_id}</Typography>
                        <Typography>Patient ID: {selectedPrescription.Patient_id}</Typography>
                        <Typography>Patient Name: {selectedPrescription.Patient_name}</Typography>
                        <Typography>Date of Sale: {new Date(selectedPrescription.Date_sale).toLocaleDateString()}</Typography>
                        <Typography>Total Amount: {typeof selectedPrescription.Total_amount === 'number' ? selectedPrescription.Total_amount.toFixed(2) : selectedPrescription.Total_amount}</Typography>
                        <Typography>Net Bill: {typeof selectedPrescription.Net_bill === 'number' ? selectedPrescription.Net_bill.toFixed(2) : selectedPrescription.Net_bill}</Typography>
                        <Typography>Discount Amount: {typeof selectedPrescription.Discount_amount === 'number' ? selectedPrescription.Discount_amount.toFixed(2) : selectedPrescription.Discount_amount}</Typography>
                        <Typography>Discount Percentage: {calculateDiscountPercentage()}%</Typography>
                       <Typography>Payment Type: {selectedPrescription.payment_type}</Typography>
                        <Typography>Status: {selectedPrescription.status}</Typography>
                        <Typography>Transaction ID: {selectedPrescription.transaction_id}</Typography>
                        <Typography>Created Timestamp: {new Date(selectedPrescription.creat_tmst).toLocaleDateString()}</Typography>
                        <Typography>Drug Details:</Typography>                           
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell>Drug Name</TableCell>
                                    <TableCell>Quantity</TableCell>
                                    <TableCell>Price per unit</TableCell>
                                    <TableCell>Select</TableCell>
                                    <TableCell>Action</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {selectedPrescription.Drug_name.map((drug, idx) => (
                                    <TableRow key={idx}>
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
                                            <Button
                                                variant="contained"
                                                style={{ backgroundColor: '#178CA4', color: 'white', marginTop: '5%' }}
                                                onClick={() => handleDeleteMedicine(idx)}
                                            >
                                                Delete Medicine
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>                      
                    </div>
                )}
                <div style={{ display: 'none' }}>
                            <PrintableContent ref={printRef} selectedPrescription={selectedPrescription} />
                        </div>
            </DialogContent>
                        <DialogActions>
                <ReactToPrint
                    trigger={() => <Button variant="contained" style={{ backgroundColor: '#178CA4', color: 'white' }}>Print</Button>}
                    content={() => printRef.current}
                />
                </DialogActions>
                <DialogActions  >
                <Button onClick={handleDeleteTransactionAndClose} variant="contained" style={{ backgroundColor: '#178CA4', color: 'white' }}>Delete Transaction</Button>
                <Button  onClick={handleCloseDialog} variant="contained" style={{ backgroundColor: '#178CA4', color: 'white' }} >Close</Button>
            </DialogActions>
        </Dialog>
      {voidedData && (
          <TableContainer component={Paper} style={{ width: '100%', overflowX: 'auto' }}>
         <Table style={{ maxWidth: '100%' }}>
          <TableHead>
            <TableRow>
              <TableCell>Prescription ID</TableCell>
              <TableCell>Patient ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Date of Sale</TableCell>
              <TableCell>Total Amount</TableCell>
              <TableCell>Net Bill</TableCell>
              <TableCell>View Details</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {voidedData
        .slice()
        .sort((a, b) => new Date(b.Date_sale) - new Date(a.Date_sale)) // Sort by date from latest to oldest
        .map((prescription, index) => (
              <TableRow key={index}>
                <TableCell>{prescription.Prescription_id}</TableCell>
                <TableCell>{prescription.Patient_id}</TableCell>
                <TableCell>{prescription.Patient_name}</TableCell>
                <TableCell>{new Date(prescription.Date_sale).toLocaleString()}</TableCell>
                <TableCell>{typeof prescription.Total_amount === 'number' ? prescription.Total_amount.toFixed(2) : prescription.Total_amount}</TableCell>
                <TableCell>{typeof prescription.Net_bill === 'number' ? prescription.Net_bill.toFixed(2) : prescription.Net_bill}</TableCell>
                <TableCell>
                  <Button variant="contained" style={{ backgroundColor: '#178CA4' }} onClick={() => handleViewDetails(prescription)}>View Details</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        </TableContainer>
      )}
    </div>
  );
}
export default VoidBill;

