import './index.css';
import HomePage from './Homepage/Homepage';
import React from "react";
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Products from './Product/product';
import Dashboard from './audits/Dashboard';
import PharmaHeader from './Homepage/pharmaheader';
import Billing from './Sales/bill';
import AdminHome from './Admin/Admin_home';
import AdminPage from './Admin/Usermanagement';
import Return from './Order/return';
import Dashboarda from './audits/Dashboarda';
import SalesAndBilling from './Sales/sales';
import OverTheCounterSale from './Sales/counterbill';
import OrderManagement from './Order/order';
import InventoryChart from './audits/Inventory';
function VaidhyaPharma() {
  return (
    <Router>
   <div>
      <Routes>
       {/* <Route path="*" element={<Login />} />  */}
        <Route path="/home" element={<HomePage />} /> 
        <Route path="/Products" element={<Products />} /> 
        <Route path="/billing" element={<Billing />} />
        <Route path="/Dashboard" element={<Dashboard />} />
        <Route path="/DBadmin" element={<Dashboard />} />
        <Route path="/Pharmaheader" element={<PharmaHeader />} />
        <Route path="/admin" element={<AdminHome />} />
        <Route path="/usermanag" element={<AdminPage />} />
        <Route path="/chart" element={<InventoryChart />} />
        <Route path="/Dashboarda" element={<Dashboarda/>} />
        <Route path="/sales " element={<SalesAndBilling />} />
        <Route path='/scanbill' element={<OverTheCounterSale />} />
        <Route path='/order' element={<OrderManagement />} />
        <Route path='/return' element={<Return/>} />
        {/*  <Route path="/Doctorhome" element={<Doctorhome />} /> */}
        {/* Add more routes as needed */}
      </Routes>
      </div>
    </Router>
   
  )
}

ReactDOM.render(<VaidhyaPharma />, document.getElementById("root"));


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
///reportWebVitals();
