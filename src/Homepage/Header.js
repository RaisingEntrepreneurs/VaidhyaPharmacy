import React from "react";
///import vaidhya_header_img from "..images/vaidhya_header_img.jpg"
import vaidhyalogo from "../images/V2.jpg"
import { Typography } from '@mui/material';

import "./home.css"

const Header = ({ linkComponent }) => {
    return (
      <header style={{ backgroundColor: '#18B7BE', padding: '0', textAlign: 'left', height: '1cm', display: 'flex', alignItems: 'center' }}>
        <img src={vaidhyalogo} alt="logo" style={{ maxWidth: '3%', height: 'auto', marginLeft: '1%' }} />
        <Typography variant="h8" component="div" style={{ color: 'white', marginLeft: '10px' }}>
          <em>Vaidhya Health Care</em>
        </Typography>       
        {linkComponent && (
          <nav style={{ marginLeft: 'auto', marginRight: '2%' }}>
            {linkComponent}
          </nav>
        )}
      </header>
    );
  };
  
  export default Header;