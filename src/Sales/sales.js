import React, { useState, useEffect,useRef,useCallback } from 'react';
import axios from 'axios';
import { Link} from 'react-router-dom';
import {  List, ListItem, TextField, Button, Table, TableContainer, TableHead, TableBody, TableRow, TableCell, Grid, MenuItem,Paper,Typography} from '@mui/material';
import DateRangeIcon from '@mui/icons-material/DateRange'
import 'jspdf-autotable';
import { Autocomplete } from '@mui/material';
import ShortNotesTable from './shortnotes';
import VoidBill from './Void';
import Modal from '@mui/material/Modal';
import SearchIcon from '@mui/icons-material/Search';
///import PharmaHeader from '../Homepage/pharmaheader';
import InputAdornment from '@mui/material/InputAdornment';
///import PhoneIcon from '@mui/icons-material/Phone';
////import vaidhyalogo from '../images/vaidhya_header_img.jpg';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
////import OverTheCounterSale from './counterbill';
////import { AdapterDayjs as AdapterDateFns } from '@mui/x-date-pickers/AdapterDayjs'; //latest calendar libraries
import DialogContentText from '@mui/material/DialogContentText';
///import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'; //latest calendar libraries
////import {DatePicker} from '@mui/x-date-pickers/DatePicker'; //latest calendar libraries
import GooglePayButton from '../Payments/Gpay';
import Cookies from 'js-cookie';

function SalesAndBilling() {
  const [patients, setPatients] = useState([]);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [prescription, setPrescription] = useState('');
  const [patientName, setPatientName] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [selectedMedicines, setSelectedMedicines] =  useState([  { product_name: '', purchase_price: 0, quantity: 0, stock_quantity: 0, expiration_date: '',location:'' }
]);
  const [inventory, setInventory] = useState([]);
  const [surName, setSurName] = useState('');
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [DateOfBirth, setDateOfBirth] = useState('');
  const [Age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [pinCode, setPinCode] = useState('');
  const [state, setState] = useState('');
  const [patientSearchTerm, setPatientSearchTerm] = useState('');
  // const [inventorySearchTerm, setInventorySearchTerm] = useState('');
  const [open, setOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [newPatientDialogOpen, setNewPatientDialogOpen] = useState(false);
  // const [patientPhoneNumber, setPatientPhoneNumber] = useState('');
  const [medicineOptions, setMedicineOptions] = useState([]);
  const [GivenName, setGivenName] = useState('');
   const [patientDob, setPatientDob] = useState('');
  const [PrescriptionId, setPrescriptionId]= useState('');
  const [emptyFields, setEmptyFields] = useState(false);
  const [emptyFieldsList, setEmptyFieldsList] = useState([]);
  const [paymentType, setPaymentType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
   const [status, setStatus] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [cashAmountProvided, setCashAmountProvided] = useState(0);
  const [changeToCustomer, setChangeToCustomer] = useState(0);
  const [editedPatient, setEditedPatient] = useState(null);
  const [successMessageOpen, setSuccessMessageOpen] = useState(false);
  const [showDeleteSuccessMessage,setshowDeleteSuccessMessage] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [openShortNotesDialog, setOpenShortNotesDialog] = useState(false); // State for Short Notes dialog
  const [openVoidDialog, setOpenVoidDialog] = useState(false); // State for Void dialog
  const apiurl=process.env.React_App_API_URL;

  const fetchPatients = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/api/patients`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error fetching patients:', error);
      console.log(`Inside the Billing `);

    }
  }, [apiurl]);

  const fetchInventory = useCallback(async () => {
    try {
      const response = await axios.get(`${apiurl}/api/inventory`);
      setInventory(response.data);
      // Extracting medicine options from inventory data
      const options = response.data.map(item => ({
        product_id: item.product_id,
        product_name: item.product_name,
      }));
      setMedicineOptions(options);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  }, [apiurl]);
  
const handleDiscountChange = (event) => {
  setDiscount(event.target.value);
};

  const handleAddDialog = () => {
    setOpen(true);
  };
  
   const handleSuccessfulCardPayment = () => {
    // Handle successful card payment
    setStatus('successful');
    setTransactionId('123444Sample');
    handleAddBilling();
  };

  const handleFailedCardPayment = () => {
    // Handle failed card payment
    setStatus('failure');
    setTransactionId('');
    setOpen(false); // Close the dialog
  };
  const handleEdit = () => {
    // Initialize the editedPatient state with the current selectedPatient data
    setEditedPatient({ ...selectedPatient });
  };
  
  const handleCancel = () => {
    // Reset the editedPatient state when canceling
    setEditedPatient(null);
  };

     const handleClose = () => {
    setOpen(false);
  };

  const handlePaymentTypeSelect = (type) => {
    setPaymentType(type);
    handleClose();

    if (type === 'CASH') {
      

      handleAddBillingCash();
    } else if (type === 'CARD') {
      
      handleAddBillingCard();
    }
    
  };

  const handleAddBillingCash = async () => {
    // Prompt for cash amount from the user
    const cashAmount = parseFloat(prompt('Enter cash amount provided by the customer:'));
  
    // Check if cash amount is valid
    if (!isNaN(cashAmount)) {
      // Calculate total bill amount
      const totalAmount = selectedMedicines.reduce((total, medicine) => total + (medicine.selling_price * medicine.quantity), 0);
  
      // Calculate change
      const change = cashAmount - totalAmount;
      const changeMessage = `Change to Customer: ${change.toFixed(2)}`;
      const userInput = prompt(`Enter cash amount provided by the customer (Total: ${totalAmount}, ${changeMessage}):`);
      // Update state with total amount and change
      setCashAmountProvided(cashAmount);
      setTotalAmount(totalAmount);
      setChangeToCustomer(change);
      setStatus('successful');
      setTransactionId('99999999');
      
      // Call handleAddBilling function with provided cash amount
      await handleAddBilling();
          } else {
      alert('Invalid cash amount. Please enter a valid number.');
    }
  };
  

  const handleAddBillingCard = () => {
    // Execute the handleAddBilling logic for card payment
  
  };

      const handleItemClick = (item) => {
      setSelectedItem(item);
    };
  
    const handleRemoveItem = (productId) => {
      // Implement remove item logic here
      console.log(`Removing product with ID ${productId}`);
    };
const fileInputRef = useRef(null);
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
            // Refresh inventory data after uploading
      fetchInventory();
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  }
};

const convertInventoryToCSV = (data) => {
  // Your CSV conversion logic
  // You need to convert your inventory data array to a CSV string
  // For example, iterate over the inventory array and construct the CSV string
  // Each row of the CSV should represent an item in the inventory

  let csv = 'inventory_id,product_id,product_name,category,manufacturer,batch_number,expiration_date,purchase_price,selling_price,stock_quantity,minimum_stock_level,maximum_stock_level,reorder_level,location,gst_rate,package_type,units_per_package,schedule_category,creat_tmst\n';
  data.forEach(item => {
    csv += `${item.inventory_id},${item.product_id},${item.product_name},${item.category},${item.manufacturer},${item.batch_number},${item.expiration_date},${item.purchase_price},${item.selling_price},${item.stock_quantity},${item.minimum_stock_level},${item.maximum_stock_level},${item.reorder_level},${item.location},${item.gst_rate},${item.package_type},${item.units_per_package},${item.schedule_category},${item.creat_tmst}\n`;
  });

  return csv;
};
   // Function to close the modal
    useEffect(() => {
    fetchPatients();
    fetchInventory();
  }, [fetchPatients,fetchInventory]);

  
  const handleAddPatient = async () => {
    // Reset error state for empty fields
    setEmptyFields(false);
    setEmptyFieldsList([]);
  
    // Validation and submission logic for the new patient
    const emptyFieldsList = [];
    if (!surName) emptyFieldsList.push("SurName");
    if (!name) emptyFieldsList.push("Given Name");
    if (!phoneNumber) emptyFieldsList.push("Phone Number");
    if (!DateOfBirth) emptyFieldsList.push("Date of Birth");
    if (!gender) emptyFieldsList.push("Gender");
    if (!address) emptyFieldsList.push("Address");
    if (!city) emptyFieldsList.push("City");
    if (!pinCode) emptyFieldsList.push("Pin code");
    if (!state) emptyFieldsList.push("State");
  
    if (emptyFieldsList.length > 0) {
      setEmptyFields(true);
      setEmptyFieldsList(emptyFieldsList);
      return;
    }
  
    try {
      // If all fields are filled, proceed with adding the patient
      const response = await axios.post(`${apiurl}/api/patients`, {
        surName,
        name,
        phoneNumber,
        DateOfBirth,
        Age,
        gender,
        address,
        city,
        pinCode,
        state
      });
         setSuccessMessageOpen(true);
  
      // Reset input fields after successful addition
      setSurName('');
      setName('');
      setPhoneNumber('');
      setDateOfBirth('');
      setAge('');
      setGender('');
      setAddress('');
      setCity('');
      setPinCode('');
      setState('');
    } catch (error) {
      setSuccessMessageOpen(false);
      console.error('Error adding new patient:', error);
    }
  };
  
    const handleAddPatients = async () => {
    try {
     const totalAmount = selectedMedicines.reduce((total, medicine) => total + (medicine.Price_per_unit * medicine.quantity), 0);
      const response = await axios.post(`${apiurl}/api/patients`, {
        "Patient_id": patientName,
        "Prescription_id": prescription,
        "Prescription": doctorName,
        "Patient_name": selectedMedicines.map(medicine => medicine.product_name).join(','),
        "Doctor_name": selectedMedicines.map(medicine => medicine.Price_per_unit).join(','),
        "Drug_name": selectedMedicines.map(medicine => medicine.Dosage_form).join(','),
        "per_unit_price": selectedMedicines.reduce((total, medicine) => total + (medicine.Price_per_unit * medicine.quantity), 0),
        "Date_sale": new Date().toISOString(),
        "Drug_quantity": selectedMedicines.map(medicine => medicine.quantity).join(','),
        "Total_amount": selectedMedicines.reduce((total, medicine) => total + (medicine.Price_per_unit * medicine.quantity), 0),
        "creat_tmst": new Date().toISOString()
            

      });
         } catch (error) {
      console.error('Error adding new patient:', error);
    }
  };

  const handlePatientSelect = patient => {
    setSelectedPatient(patient);
    setPatientName(patient.surname);
    setGivenName (patient.given_name);
   setDateOfBirth (patient.dateofbirth );
   setAge (patient.age);
    // Clear search data
  setPatientSearchTerm('');
  setPatients([]);
};

const handleMedicineSelect = (medicine) => {
  if (medicine) {
    const existingMedicineIndex = selectedMedicines.findIndex((item) => item.product_id === medicine.product_id);
    if (existingMedicineIndex !== -1) {
      const updatedMedicines = [...selectedMedicines];
      updatedMedicines[existingMedicineIndex].quantity += 1;
      setSelectedMedicines(updatedMedicines);
    } else {
      // Here, include the price per unit along with the medicine details
      const newMedicine = { ...medicine, quantity: 1, pricePerUnit: medicine.selling_price }; // Include price per unit
      setSelectedMedicines((prevMedicines) => [...prevMedicines, newMedicine]);
    }
  }
};

const generatePrescriptionId = () => {
  const moment = require('moment');

  const date = moment().format('YYYYMMDDHHmmss');
  return `VP43${date}`;
};
useEffect(() => {
  setPrescriptionId(generatePrescriptionId());
}, []);
  
const handleAddBilling = async () => {
  try {
    const userId = Cookies.get('userID'); // Get the userID from the cookie
    const Prescriptionids = PrescriptionId;
    const drugNames = selectedMedicines.map(medicine => medicine.product_name);
    const drugPrices = selectedMedicines.map(medicine => medicine.selling_price);
    const drugQuantities = selectedMedicines.map(medicine => medicine.quantity);
     const response = await axios.post(`${apiurl}/api/pharmacy_billing`, {
      Patient_id: selectedPatient ? selectedPatient.Patient_Id : null,
      Prescription_id: Prescriptionids,
      Prescription: prescription,
      Patient_name: selectedPatient ? selectedPatient.given_name : GivenName,
      Doctor_name: doctorName,
      Drug_name: drugNames,
      per_unit_price: drugPrices,
      Date_sale: new Date().toISOString(),
      Drug_quantity: drugQuantities,
      Total_amount: totalAmount,
      creat_tmst: new Date().toISOString(),
      payment_type: paymentType,
      status: status,
      transaction_id: transactionId,
      userID: userId,
    });

    for (let i = 0; i < selectedMedicines.length; i++) {
      const product = selectedMedicines[i];
      const updatedStockQuantity = product.stock_quantity - product.quantity;
      await axios.put(`${apiurl}/api/inventorystock/${product.product_id}`, {
        Stock_Quantity: updatedStockQuantity
      });
    }

    // Show success message
   alert("Successfully added billing!");

    // Print the bill
    handlePrintBill();
  } catch (error) {
    console.error('Error adding billing record:', error);
    // Show error message if adding billing record fails
    alert('Error adding billing record. Please try again.');
  }
};

  const handleCloseModal = () => {
    setOpenModal(false);
  };
  
  const handlePatientSearchChange = async event => {
    setPatientSearchTerm(event.target.value);
    try {
      const response = await axios.get(`${apiurl}/api/patients?search=${event.target.value}`);
      if (response.data.length === 1) {
      // If only one patient is found, update the state with the details of that patient
      setSelectedPatient(response.data[0]);
      setPatientName(response.data[0].Patient_name);
      setGivenName (response.data[0].given_name);
      setDateOfBirth (response.data[0].dateofbirth );
      setAge (response.data[0].age);
      setPrescription(response.data[0].Prescription);
      setDoctorName(response.data[0].Doctor_name);
      // Set other details of the patient here
    } else {
      // If multiple patients are found or no patient is found, reset the selected patient state
      setSelectedPatient(null);
      setPatientName('');
      setPatientName('');
      setGivenName ('');
      setDateOfBirth ('');
      setAge ('');
      setPrescription('');
      setDoctorName('');
      // Reset other details of the patient here
    }
      setPatients(response.data);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  };

  // const handleInventorySearchChange = async event => {
  //   setInventorySearchTerm(event.target.value);
  //   try {
  //     const response = await axios.get(`${apiurl}api/inventory/${event.target.value}`);
  //     setInventory(response.data);
  //   } catch (error) {
  //     console.error('Error searching inventory:', error);
  //   }
  // };

  const handleChangeQuantity = (index, quantity) => {
    // Update the quantity of the selected medicine at the specified index
    const updatedMedicines = selectedMedicines.map((medicine, i) =>
      i === index ? { ...medicine, quantity: quantity } : medicine
    );
    setSelectedMedicines(updatedMedicines);
  };

  const Amount = selectedMedicines.reduce((total, medicine) => {
    return total + (medicine.selling_price * medicine.quantity);
  }, 0);
  
  const handlePrintBill = (Prescriptionids, userId) => {
    const date = new Date().toLocaleDateString();
    const totalAmount = selectedMedicines.reduce((total, medicine) => total + (parseFloat(medicine.selling_price) * medicine.quantity), 0).toFixed(2);
  
    // Create the receipt layout
    let receipt = "";
    receipt += "Vaidhya Pharmacy\n";
    receipt += `PrescriptionID: ${Prescriptionids}\n`;
    receipt += `Bill Created By : ${userId}\n`;
    receipt += `Sanjay Gandhi Nagar,Bonthapalle,Domadugu, \n`
    receipt += `Telangana,500043 \n`
    receipt +=`Tel:\n`
    receipt +=`Gstin: \n`;
    receipt += `Date: ${date}\n\n`;
  
    // Add each medicine detail to the receipt
    selectedMedicines.forEach((medicine, index) => {
      const total = (parseFloat(medicine.selling_price) * medicine.quantity).toFixed(2);
      receipt += `${index + 1}. ${medicine.product_name}\n`;
      receipt += `   Price: $${medicine.selling_price}\n`;
      receipt += `   Quantity: ${medicine.quantity}\n`;
      receipt += `   Total: $${total}\n\n`;
    });
  
    // Add the total amount to the receipt
    receipt += `Total Amount: $${totalAmount}\n`;
  
    // Create a hidden div to hold the receipt content
    const printWindow = window.open('', '_blank');
    printWindow.document.write('<html><head><title>Print Receipt</title></head><body>');
    printWindow.document.write('<pre>' + receipt + '</pre>');
    printWindow.document.write('</body></html>');
    printWindow.document.close();
  
    // Print the receipt
    printWindow.print();
    printWindow.close();
  };
  const handleDelete = async () => {
    try {
      await axios.delete(`${apiurl}/api/patientsph/${selectedPatient.Patient_Id}`);
            // Show success message
      setshowDeleteSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setshowDeleteSuccessMessage(false);
      }, 3000);
      window.location.reload();
      // Optionally perform any action after successful delete
    } catch (error) {
      console.error('Error deleting patient:', error);
      // Handle error, show error message, etc.
    }
  };
    const handleChange = (field, value) => {
        setEditedPatient({ ...editedPatient, [field]: value });
    };
    const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const handleSave = async () => {
    try {
      const response = await axios.put(`${apiurl}/api/patientsph/${selectedPatient.Patient_Id}`, editedPatient);
          setSelectedPatient(response.data);
          // Show success message
      setShowSuccessMessage(true);

      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 3000);
    } catch (error) {
      console.error('Error updating patient:', error);
      // Handle error, show error message, etc.
    }
  };
  const handleNewPatientDialogOpen = () => {
    // Reset error fields state when opening the dialog
    setEmptyFields(false);
    setEmptyFieldsList([]);
  
    // Open the dialog
    setNewPatientDialogOpen(true);
  };

  const handleNewPatientDialogClose = () => {
    setNewPatientDialogOpen(false);
  };

  const handleDOBChange = (event) => {
    const dob = event.target.value;
    setDateOfBirth(dob);
    calculateAge(dob);
  };

  const calculateAge = (dob) => {
    // Calculate age based on the new date of birth
    // Here you need to implement the logic to calculate the age
    // This is just a simple example, you might need to refine it
    const dobDate = new Date(dob);
    const today = new Date();
    const ageDiff = today.getFullYear() - dobDate.getFullYear();
    const monthDiff = today.getMonth() - dobDate.getMonth();
    let age = ageDiff;
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dobDate.getDate())) {
      age--;
    }
    setAge(age);
  };
  // const handlePatientPhoneNumberChange =  async  event => {
  //   setPatientPhoneNumber(event.target.value);
  
  //   try {
  //     const response = await axios.get(`${apiurl}/api/patientsph?search=${event.target.value}`);
  //     setPatients(response.data);
  //   } catch (error) {
  //     console.error('Error searching patients:', error);
  //   }
  // }

  const handlePatientdobChange =  async  event => {
    setPatientDob(event.target.value);
  
    try {
      const response = await axios.get(`${apiurl}/api/patientsdob?search=${event.target.value}`);
      setPatients(response.data);
    } catch (error) {
      console.error('Error searching patients:', error);
    }
  }
   
  const [values, setValues] = useState({
    discount: 0, // Default discount value
  });

  const handleAddMedicine = () => {
    setSelectedMedicines([...selectedMedicines, { product_name: '', selling_price: 0, quantity: 0 }]);
  };

  const handleRemoveMedicine = (index) => {
    const updatedMedicines = [...selectedMedicines];
    updatedMedicines.splice(index, 1);
    setSelectedMedicines(updatedMedicines);
  };
  const handleQuantityChange = (index, event) => {
    const quantity = parseInt(event.target.value);
    if (!isNaN(quantity) && quantity >= 0) {
      const updatedMedicines = [...selectedMedicines];
      updatedMedicines[index].quantity = quantity;
      setSelectedMedicines(updatedMedicines);
    }
  };
  const handleMedicineSearch = async (index, event) => {
    const searchQuery = event.target.value;
    try {
      const response = await axios.get(`${apiurl}/api/medicines?search=${searchQuery}`);
      const selectedMedicine = response.data[0];
      const updatedMedicines = [...selectedMedicines];
      updatedMedicines[index] = { ...selectedMedicine, quantity: 1 };
      setSelectedMedicines(updatedMedicines);
    } catch (error) {
      console.error('Error searching medicines:', error);
    }
  };
  const handleProductNameChange = (newValue, index) => {
    if (newValue) {
      // Find the selected medicine from the inventory
      const selectedMedicine = inventory.find(medicine => medicine.product_name === newValue.product_name);

      // Update the selected medicine in the state
      setSelectedMedicines(prevState => {
        const updatedMedicines = [...prevState];
        updatedMedicines[index] = {
          ...selectedMedicine,
          quantity: updatedMedicines[index] ? updatedMedicines[index].quantity : 0
        };
        return updatedMedicines;
      });
    }
  };
  const formatDateOfBirth = (dateOfBirth) => {
    const date = new Date(dateOfBirth);
    return date.toLocaleDateString(); // Format the date to display without the time
};
const handleOpenShortNotesDialog = () => {
  setOpenShortNotesDialog(true);
};
const handleCloseShortNotesDialog = () => {
  setOpenShortNotesDialog(false);
};
const handleOpenVoidDialog = () => {
  setOpenVoidDialog(true);
};
const handleCloseVoidDialog = () => {
  setOpenVoidDialog(false);
};
const showSuccessMessageForDuration = () => {
  setShowSuccessMessage(true);

  // Hide the success message after 3 seconds
  setTimeout(() => {
    setShowSuccessMessage(false);
  }, 3000);
};

// Function to show delete success message for a fraction of seconds
const showDeleteSuccessMessageForDuration = () => {
  setshowDeleteSuccessMessage(true);

  // Hide the delete success message after 3 seconds
  setTimeout(() => {
    setshowDeleteSuccessMessage(false);
  }, 3000);
};
useEffect(() => {
  let timer;

  if (showSuccessMessage) {
    timer = setTimeout(() => {
      setShowSuccessMessage(false);
    }, 3000);
  }

  if (showDeleteSuccessMessage) {
    timer = setTimeout(() => {
      setshowDeleteSuccessMessage(false);
    }, 3000);
  }

  return () => clearTimeout(timer);
}, [showSuccessMessage, showDeleteSuccessMessage]);
  return (
    <div>  
      <div style={{ paddingLeft: '20px' }}>
        <div >
        <div style={{ display: 'flex', alignItems: 'center' }}>
    <h3 style={{ color: '#18B7BE', fontSize: '24px', marginBottom: '1%' }}>Add Patient</h3>
    <div style={{ flexGrow: 1 }}></div> {/* Spacer to push buttons to the right */}
    <div style={{ display: 'flex', marginTop: '10px' , marginBottom:'30px'}}>
    <Button variant="contained" style={{ backgroundColor: '#178CA4', marginRight: '20px',  }} onClick={handleOpenShortNotesDialog}>Short Book</Button>
      <Dialog open={openShortNotesDialog} onClose={handleCloseShortNotesDialog}>
        <DialogTitle>Short Notes</DialogTitle>
        <DialogContent>
          <ShortNotesTable />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" style={{ backgroundColor: '#178CA4'}} onClick={handleCloseShortNotesDialog}>Close</Button>
        </DialogActions>
      </Dialog>
      {/* Void button and dialog */}
      <Button variant="contained" style={{ backgroundColor: '#178CA4', marginRight: '20px' }} onClick={handleOpenVoidDialog}>Search Bill</Button>
      <Dialog open={openVoidDialog} onClose={handleCloseVoidDialog} maxWidth="xl" fullWidth >
        <DialogTitle>Search Bill</DialogTitle>
        <DialogContent>
          <VoidBill />
        </DialogContent>
        <DialogActions>
          <Button variant="contained" style={{ backgroundColor: '#178CA4'}} onClick={handleCloseVoidDialog}>Close</Button>
        </DialogActions>
      </Dialog>
           <Link to="/scanbill" style={{ textDecoration: 'none' }}>
        <Button variant="contained" style={{ backgroundColor: '#178CA4' }}>
          OTC Bill
        </Button>
      </Link>
   </div></div>
          <div>
          <TextField
          label="Search or Enter Patient Name"
           InputLabelProps={{ shrink: true }}
            value={patientSearchTerm}
             onChange={handlePatientSearchChange}
             InputProps={{
             endAdornment: (
             <InputAdornment position="end">
             <SearchIcon />
             </InputAdornment>
            ),
             }}
           />        
     <TextField
      label="Date Of Birth"
      value={patientDob}
      style={{ marginLeft: '40px' }}
      onChange={handlePatientdobChange}
      InputProps={{
        startAdornment: (
          <InputAdornment position="end">
            <DateRangeIcon />
          </InputAdornment>
        ),
      }}
    />
            <hr style={{ width: '100%', color: '#18B7BE', backgroundColor: '#18B7BE', height: '1px', border: 'none' }} />
          </div>
          {patientSearchTerm && patients.length > 0 && (
    <div>
      <h3 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Patient Details</h3>
      
    </div>
  )}
  {patientSearchTerm && patients.length === 0 && (
    <div>
      <h5 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Patient not found, create a new patient.</h5>
      <Button variant="contained" color="primary" onClick={handleNewPatientDialogOpen} style={{ marginLeft: '10px', color: 'primary', background: '#178CA4' }}>Add New Patient</Button>
    </div>
  
          )}
        <List>       
  {patients.map(patient => {
       return (
      <ListItem button onClick={() => handlePatientSelect(patient)}>
      <TableContainer component={Paper}>
        <Table size="small" aria-label="patient details">
          <TableHead>
            <TableRow >
              <TableCell>Surname</TableCell>
              <TableCell>Given Name</TableCell>
              <TableCell>Date of Birth</TableCell>
              <TableCell>Phone Number</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
          {patient && patient.Patient_Id && ( // Add null check before accessing properties
          <TableRow key={patient.Patient_Id}>
              <TableCell>{patient.surname}</TableCell>
              <TableCell>{patient.given_name}</TableCell>
              <TableCell>{patient.dateofbirth ? new Date(patient.dateofbirth).toLocaleDateString() : ''}</TableCell>
              <TableCell>{patient.phonenumber}</TableCell>
            </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </ListItem>
    );
  })}
</List>
        </div>
        {selectedPatient && (
          <div>     
          </div>
        )}      
      </div>
      {/* New Patient Dialog */}
      <Modal open={newPatientDialogOpen} onClose={handleNewPatientDialogClose}>
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid #000', boxShadow: 24, p: 4 }}>
        <h2 style={{marginLeft:'10px', color:'#005493',  marginBottom:'20px'}}>New Patient Details</h2>
        {emptyFields && (
          <p style={{ color: 'red', marginLeft:'20px', marginBottom:'20px'}}>
            Please fill in the following fields: {emptyFieldsList.join(", ")}
          </p>
        )}
        <TextField label="SurName" value={surName} onChange={e => setSurName(e.target.value)} style={{marginLeft:'20px' , marginBottom:'20px'}}/>
        <TextField label="Given Name" value={name} onChange={e => setName(e.target.value)} style={{marginLeft:'20px' , marginBottom:'20px'}}/>
        <TextField label="Phone Number" value={phoneNumber} onChange={e => setPhoneNumber(e.target.value)} inputProps={{ maxLength: 10 }} style={{marginLeft:'20px', marginBottom:'20px'}} />
        <TextField label="Date of Birth" InputLabelProps={{ shrink: true }} type="date" value={DateOfBirth} onChange={handleDOBChange} style={{marginLeft:'20px', marginBottom:'20px'}}/>
        <TextField label="Age" value={Age}  disabled style={{marginLeft:'20px', marginBottom:'20px'}}/>
        <TextField  select label="Gender" value={gender} onChange={e => setGender(e.target.value)} style={{marginLeft:'20px', marginBottom:'20px', width: '200px' }} SelectProps={{ style: { minWidth: '200px' } }}>
          <MenuItem value="male">Male</MenuItem>
          <MenuItem value="female">Female</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </TextField>
        <TextField label="Address" value={address} onChange={e => setAddress(e.target.value)} style={{marginLeft:'20px', marginBottom:'20px'}} />
        <TextField label="City" value={city} onChange={e => setCity(e.target.value)} style={{marginLeft:'20px', marginBottom:'20px'}}/>
        <TextField label="Pin code" value={pinCode} onChange={e => setPinCode(e.target.value)} style={{marginLeft:'20px', marginBottom:'20px'}}/>
        <TextField label="State" value={state} onChange={e => setState(e.target.value)} style={{marginLeft:'20px', marginBottom:'20px'}}/>
        <Button onClick={handleAddPatient} style={{marginLeft:'20px', color:'white', background:'#178CA4', marginBottom:'20px'}}>Add Patient</Button>
        <Button onClick={handleNewPatientDialogClose} style={{marginLeft:'20px', color:'white', background:'#178CA4', marginBottom:'20px'}}>Close</Button>
      </div>
    </Modal>
    <Modal open={successMessageOpen} onClose={() => setSuccessMessageOpen(false)}>
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid #000', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', width: '400px', padding: '20px', borderRadius: '10px' }}>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
    
    <div style={{ position: 'absolute', top: '10px', right: '10px', backgroundColor: 'red', width: '30px', height: '30px', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', borderRadius: '5px' }} onClick={() => setSuccessMessageOpen(false)}>
      <button style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '20px', color: 'white' }}>×</button>
    </div>
  </div>
  <p>Patient successfully added.</p>
</div>
</Modal>
        {selectedPatient && (
          <div >         
          <Grid >
            <Grid >          
      <Paper square elevation={2} style={{ backgroundColor: '#18B7BE', padding: '10px', color:'white' }}>
        <Typography variant="h4" component="h1" align="center">Vaidhya Pharmacy - Sale/Billing</Typography>
      </Paper>     
</Grid>
</Grid>
      {/* Patient Details Header */}
      <Paper style={{ padding: '16px', backgroundColor: '#f0f0f0' }} elevation={2}>
        <Grid container spacing={2} justifyContent="center">
                    {/* First Row: Surname, Given Name, Date Of Birth, Age, Gender */}
          <Grid container spacing={2}>
        <Grid item xs={12} md={2}>
          <Typography>Surname</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.surname : selectedPatient.surname || ''}
            onChange={(e) => handleChange('surname', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography>Given Name</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.given_name : selectedPatient.given_name || ''}
            onChange={(e) => handleChange('given_name', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
                <Typography>Date Of Birth</Typography>
                <TextField
                    fullWidth
                    variant="outlined"
                    value={editedPatient ? editedPatient.dateofbirth : selectedPatient.dateofbirth ? formatDateOfBirth(selectedPatient.dateofbirth) : ''}
                    onChange={(e) => handleChange('dateofbirth', e.target.value)}
                    InputProps={{ readOnly: !editedPatient }}
                />
            </Grid>
          <Grid item xs={12} md={2}>
          <Typography>Age</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.age : selectedPatient.age || ''}
            onChange={(e) => handleChange('age', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography>Gender</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.gender : selectedPatient.gender || ''}
            onChange={(e) => handleChange('gender', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={2}>
          <Typography>Phone  Number </Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.phonenumber : selectedPatient.phonenumber || ''}
            onChange={(e) => handleChange('phonenumber', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>Address</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.address : selectedPatient.address }
            onChange={(e) => handleChange('address', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>City</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.city : selectedPatient.city || ''}
            onChange={(e) => handleChange('city', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>State</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.pt_state : selectedPatient.pt_state || ''}
            onChange={(e) => handleChange('Pt_state', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>
        <Grid item xs={12} md={3}>
          <Typography>Pin Code</Typography>
          <TextField
            fullWidth
            variant="outlined"
            value={editedPatient ? editedPatient.PinCode : selectedPatient.pincode }
            onChange={(e) => handleChange('PinCode', e.target.value)}
            InputProps={{ readOnly: !editedPatient }}
          />
        </Grid>                   
          </Grid>
          <div>
        {!editedPatient ? (
          <Button variant="contained" style={{ color:'white', background:'#178CA4'}}  onClick={handleEdit}>Edit</Button>
        ) : (
          <div style={{ display: 'flex', gap: '4%', marginTop:'4%' }}>
  <Button variant="contained" style={{ color:'white', background:'#178CA4'}} onClick={handleSave}>Save</Button>
  <Button variant="contained" style={{ color:'white', background:'#178CA4'}} onClick={handleDelete}>Delete</Button>
  <Button variant="contained" style={{ color:'white', background:'#178CA4'}} onClick={() => setEditedPatient(null)}>Cancel</Button>
  {showSuccessMessage && (
    <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid #000', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', width: '400px', padding: '20px', borderRadius: '10px' }}>
        <div className="success-message">Patient data updated successfully</div>
        </div>
      )}
      {showDeleteSuccessMessage && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid #000', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', width: '400px', padding: '20px', borderRadius: '10px' }}>
        <div className="success-message">Patient data deleted successfully</div>
        </div>
      )}
</div>
        )}        
      </div>
      </Grid>
      </Paper>                
  <div>
  {/* Table displaying selected medicines */}
  <TableContainer component={Paper} style={{  overflow: 'hidden' }}>
        <Table>
          <TableHead>
            <TableRow>
        <TableCell>Product Name</TableCell>
        <TableCell>Unit Price</TableCell>
        <TableCell>Stock Quantity</TableCell>
        <TableCell>Quantity of Sale</TableCell>
        <TableCell>Expiration Date</TableCell>
        <TableCell>Location</TableCell>
        <TableCell>Batch Number</TableCell>
        <TableCell style={{ paddingRight: '20px' }}>Total Price</TableCell>
  <TableCell style={{ paddingLeft: '20px' }}>Actions</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {selectedMedicines.map((medicine, index) => (
        <TableRow key={index}>
          <TableCell>
           <Autocomplete
               value={medicine || null}
               onChange={(_event, newValue) => handleProductNameChange(newValue, index)}
              options={inventory}
              getOptionLabel={(option) => option.product_name}
              renderInput={(params) => (
                <TextField {...params} label="Search Drug" variant="outlined" style={{ width: '300px' }} />
              )}
            />
          </TableCell>
          <TableCell>{medicine.selling_price}</TableCell>
          <TableCell>{medicine.stock_quantity}</TableCell>
          <TableCell>
            <TextField
              type="number"
              value={medicine.quantity}
              onChange={(e) => handleChangeQuantity(index, e.target.value)}
            />
          </TableCell>
          <TableCell>{medicine.expiration_date ? new Date(medicine.expiration_date).toLocaleDateString() : ''}</TableCell>
          <TableCell>{medicine.location}</TableCell>
          <TableCell>{medicine.batch_number}</TableCell>
          <TableCell>{(medicine.selling_price * medicine.quantity).toFixed(2)}</TableCell>
          <TableCell>
            <Button onClick={() => handleRemoveMedicine(index)}>Remove</Button>
            <Button onClick={() => handleAddMedicine(index)}>Add</Button>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  </TableContainer>
  <Grid container style={{ padding: '20px' }} justifyContent="flex-end">
        <TextField
          label="Discount"
          type="number"
          value={discount}
          InputProps={{ inputProps: { step: "1", min: "0", max: "30" } }}
          onChange={handleDiscountChange}
          variant="outlined"
          style={{ width: '200px', marginRight: '10px' }}
        />
      </Grid>
      {/* Total amount */}
      <Grid container style={{ padding: '20px' }} justifyContent="flex-end">
        <TextField
          label="Total Amount"
          value={selectedMedicines.reduce((total, medicine) => total + (medicine.selling_price * medicine.quantity), 0).toFixed(2)}
          disabled
          InputProps={{
            startAdornment: <Typography variant="h6">₹</Typography>,
          }}
          variant="outlined"
          style={{ width: '200px', marginRight: '10px' }}
        />
        <TextField
          label="Discounted Amount"
          value={(selectedMedicines.reduce((total, medicine) => total + (medicine.selling_price * medicine.quantity), 0) * (1 - (discount / 100))).toFixed(2)}
          disabled
          InputProps={{
            startAdornment: <Typography variant="h6">₹</Typography>,
          }}
          variant="outlined"
          style={{ width: '200px', marginRight: '10px' }}
        />
        <Button variant="contained" color="primary" style={{ backgroundColor: '#178CA4', marginRight: '10px' }} onClick={handleAddDialog}>Add Billing</Button>
      </Grid>
    <Grid container justifyContent="flex-end" alignItems="center" style={{marginTop:'2%'}}> {/* Adjust container to align items to the right */}
    <>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Select Payment Type</DialogTitle>
        <DialogContent>
          <DialogContentText>Please select the payment type:</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => handlePaymentTypeSelect('CASH')} color="primary">
            Cash
          </Button>
          <Button onClick={() => handlePaymentTypeSelect('CARD')} color="primary">
            Card
          </Button>
          <button onClick={() => handlePaymentTypeSelect('GPAY')}>GPAY</button>
      {paymentType === 'GPAY' && <GooglePayButton />}
            
          
        </DialogActions>
      </Dialog>
    </>
    </Grid> 
</div>          
</div>     
        )}
         <Modal open={openModal} onClose={handleCloseModal} aria-labelledby="modal-title" aria-describedby="modal-description">
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: 'white', border: '2px solid #000', boxShadow: 24, p: 4 }}>
          <h2 id="modal-title">Total Bill Amount: {totalAmount}</h2>
          <h3>List of Medicines:</h3>
          <ul>
            {selectedMedicines.map((medicine, index) => (
              <li key={index}>
                {medicine.product_name} - {medicine.Price_per_unit} - Quantity: {medicine.quantity}
              </li>
            ))}
          </ul>
          <Button onClick={handleCloseModal}>Close</Button>
        </div>
        </Modal>
        </div>
  );         
}
export default SalesAndBilling;
