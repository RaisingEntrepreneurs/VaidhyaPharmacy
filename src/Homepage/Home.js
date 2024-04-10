import React from 'react';
import { Typography, Grid, Box } from '@mui/material';
import { Link ,Element } from 'react-scroll';  // Fix the import statement
import background from '../images/background.PNG';
import Similing from '../images/Similing.PNG';
import Thumsub from '../images/Thumsub.PNG';
import 'bootstrap/dist/css/bootstrap.min.css';
import vaidhyalogo from '../images/vaidhya_header_img.jpg';
import './home.css';
import Footer from './Footer';
import LoginEffect from './LoginEffect';
import SessionValidationHOC from './SessionValidationHOC';

const HomePage = () => {
  
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#005493', padding: '0', textAlign: 'left', height: '1cm', display: 'flex', alignItems: 'center' }}>
        <img src={vaidhyalogo} alt="logo" style={{ maxWidth: '3%', height: 'auto', marginLeft: '1%' }} />
        <Typography variant="h8" component="div" style={{ color: 'white', marginLeft: '10px' }}>
          <em>Vaidhya Health Care</em>
        </Typography>
        {/* Include the LoginEffect component here */}
        <div style={{ flex: 1 }}></div>
        <LoginEffect />
       
      </header>
      
      <main style={{ flex: 1, padding: '1rem', textAlign: 'left', backgroundImage: `url(${background})`, backgroundSize: 'cover', overflowX: 'auto', whiteSpace: 'nowrap', position: 'relative' }}>
        

        <Grid container justifyContent="left">
          <Grid item xs={12} sm={6}>
          <Box
  sx={{
    mt: '30%', // Adjust the percentage to center vertically
    ml: '5%', // Set the margin-left to keep content on the left side
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    color: 'white',
  }}
>
  <Typography color="black" variant="h6" component="h2" textAlign="left" gutterBottom>
    Welcome to Vaidhya Health Care..
  </Typography>
  <Typography color="black" variant="h10" component="h3" gutterBottom sx={{ mt: '5%' }}>
    We are thriving to simplify healthcare
  </Typography>
</Box>
          </Grid>
        </Grid>


        <div style={{ display: 'flex', position: 'absolute', bottom: '5%', left: '0', width: '100%', overflowX: 'auto', whiteSpace: 'nowrap', scrollbarWidth: 'thin', scrollbarColor: 'darkgray lightgray', WebkitOverflowScrolling: 'touch' }}>
          <img src={Similing} alt="logo" style={{ width: '10%', height: 'auto', marginLeft: '1%' }} />
          <img src={Thumsub} alt="logo" style={{ width: '10%', height: 'auto', marginLeft: '1%' }} />
        </div>
      </main>
      

      <Footer />
    </div>
  );
};

export default SessionValidationHOC(HomePage);
