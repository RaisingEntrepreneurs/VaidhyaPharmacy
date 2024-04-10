import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Typography, Table, TableHead, TableBody, TableRow, TableCell,Button,Grid } from '@mui/material';
import Adminheader from '../Admin/adminheader';

const Return = () => {
  const [medicines, setMedicines] = useState([]);
  const apiurl=process.env.React_App_API_URL;
  useEffect(() => {
    const fetchMedicines = async () => {
      try {
        const response = await axios.get(`${apiurl}/api/inventory`);
        setMedicines(response.data);
      } catch (error) {
        console.error('Error fetching medicines:', error);
      }
    };

    fetchMedicines();
  }, [apiurl]);

  // Filter medicines that are about to expire (e.g., within the next 30 days)
  const getExpiringMedicines = () => {
    const currentDate = new Date();
    const nextMonth = new Date();
    nextMonth.setMonth(currentDate.getMonth() + 1);

    return medicines.filter(medicine => {
      const expirationDate = new Date(medicine.expiration_date);
      return expirationDate <= nextMonth;
    });
  };

  const expiringMedicines = getExpiringMedicines();
   const handleRemainderRequest = (medicine) => {
    // Send request for remainder here
    console.log('Remainder requested for:', medicine.product_name);
    // You can make an API call to send the remainder request to the server
  };
  const handleGoBackClick = () => {
    // Navigate back to the previous page
    window.history.back();
  };

  return (
    <div>
      <Adminheader />
      <Grid container justifyContent="flex-end" alignItems="center" style={{marginTop:'2%'}}>
           <Grid item style={{marginRight:'2%'}}>
            <button variant="contained" style ={{backgroundColor: '#178CA4', color:'white'}} onClick={handleGoBackClick}>Go Back</button>
           </Grid>
        </Grid>
      <Typography variant="h2" style ={{ color:'#18B7BE'}}>Return</Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Product Name</TableCell>
            <TableCell>Expiration Date</TableCell>
            <TableCell>distributor</TableCell>
            <TableCell>BatchNumber</TableCell>
            
          </TableRow>
        </TableHead>
        <TableBody>
          {expiringMedicines.map(medicine => (
            <TableRow key={medicine.product_id}>
              <TableCell>{medicine.product_name}</TableCell>
              <TableCell>{medicine.expiration_date.split('T')[0]}</TableCell>
              <TableCell>{medicine.distributor}</TableCell>
              <TableCell>{medicine.batch_number}</TableCell>
              <TableCell>
                <Button variant="contained" style ={{backgroundColor: '#178CA4', color:'white'}} onClick={() => handleRemainderRequest(medicine)}>Request Reminder</Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default Return;
