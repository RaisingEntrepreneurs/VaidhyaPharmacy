import React from 'react';

import { AppBar, Toolbar, Typography, Button } from '@mui/material';

import { Link, Route, Routes , useNavigate} from 'react-router-dom';
import vaidhyalogo from '../images/V2.jpg';

function PharmaHeader() {
    const navigate = useNavigate();
    const handleLogout = () => {
        localStorage.clear();
        navigate('/home');
      };
    
  return (
    
      <div>
        <AppBar position="static" style={{ height: '4rem', backgroundColor: '#18B7BE' }}>
       <Toolbar>
  <img src={vaidhyalogo} alt="Vaidhya Logo" width="100"  style={{ cursor: 'pointer',  maxWidth: '3%', height: 'auto', marginLeft: '1%' }} />
  <Typography variant="h8" component="div" sx={{ flexGrow: 1, color: 'white' }}>
     Pharmacy Management System
  </Typography>
            <Button color="inherit" component={Link} to="/dashboard" sx={{ color: 'white' }}>
             Dashboard
            </Button>
            <Button color="inherit" component={Link} to="/billing" sx={{ color: 'white' }}>
             Billing
            </Button>
            <Button color="inherit" onClick={handleLogout} sx={{ color: 'white' }}>Logout</Button>
          </Toolbar>
        </AppBar>
      

      <Routes>
        <Route path="/dashboard" element={<dashboard />} />
        <Route path="/billing" element={<billing />} />
        
      </Routes>
      </div>
  );
}

export default PharmaHeader;