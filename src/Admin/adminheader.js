import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { Link, Route, Routes , useNavigate, useLocation } from 'react-router-dom';
import vaidhyalogo from '../images/V2.jpg';
import Products from '../Product/product'; 
import InventoryChart from '../audits/Inventory';
import AdminPage from './Usermanagement';
import { logout } from '../Homepage/sessionService';

function Adminheader() {
    const navigate = useNavigate();
    const location = useLocation();
    const [logoutConfirmationOpen, setLogoutConfirmationOpen] = useState(false);

    const handleLogout = () => {
        // Open the logout confirmation dialog
        setLogoutConfirmationOpen(true);
    };

    const handleConfirmLogout = async () => {
       
        // Call the logout function to perform logout and redirect
        await logout(navigate);
    };

    const handleCancelLogout = () => {
        // Close the logout confirmation dialog
        setLogoutConfirmationOpen(false);
    };

    const handleLogoClick = () => {
        navigate('/Dashboarda');
    };

    return (
        <div>
            <AppBar position="static" style={{ height: '4%', backgroundColor: '#18B7BE', marginBottom: '20px' }}>
                <Toolbar>
                    <img src={vaidhyalogo} alt="Vaidhya Logo" width="100" height="90" onClick={handleLogoClick} style={{ cursor: 'pointer', maxWidth: '5%', height: 'auto', marginLeft: '10px' }} />
                    <Typography variant="h8" component="div" sx={{ flexGrow: 1, color: 'white', marginLeft: '20px' }}>
                        Pharmacy 
                    </Typography>
                    <Button color="inherit" component={Link} to="/Dashboarda" style={{ color: location.pathname === '/Dashboarda' ? '#072A40' : 'white' }}>
                        Dashboard
                    </Button>
                    <Button color="inherit" component={Link} to="/order" style={{ color: location.pathname === '/order' ? '#072A40' : 'white' }}>
                        Order
                    </Button>
                    <Button color="inherit" component={Link} to="/billing" style={{ color: location.pathname === '/billing' ? '#072A40' : 'white' }}>
                        Billing
                    </Button>
                    <Button color="inherit" component={Link} to="/Products" style={{ color: location.pathname === '/Products' ? '#072A40' : 'white' }}>
                        Inventory
                    </Button>
                    <Button color="inherit" component={Link} to="/usermanag" style={{ color: location.pathname === '/usermanag' ? '#072A40' : 'white' }}>
                        User Management
                    </Button>
                    <Button color="inherit" onClick={handleLogout} style={{ color: location.pathname === '/logout' ? '#072A40' : 'white' }}>
                        Logout
                    </Button>
                </Toolbar>
            </AppBar>

            <Routes>
                <Route path="/chart" element={<InventoryChart />} />
                <Route path="/Inventory" element={<Products />} />
                <Route path="/usermanag" element={<AdminPage />} />
            </Routes>

            {/* Logout confirmation dialog */}
            <Dialog open={logoutConfirmationOpen} onClose={handleCancelLogout}>
                <DialogTitle>Confirm Logout</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Are you sure you want to logout?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCancelLogout} color="primary">
                        Cancel
                    </Button>
                    <Button onClick={handleConfirmLogout} color="primary">
                        Logout
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default Adminheader;
