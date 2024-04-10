import React, { useEffect } from "react";
import InventoryChart from "./Inventory";
import SessionValidationHOC from '../Homepage/SessionValidationHOC';
import Adminheader from "../Admin/adminheader";
import { useNavigate } from 'react-router-dom';
import { checkInactivity } from "../Homepage/sessionService";

    

function Dashboarda () {
    const navigate = useNavigate();

    useEffect(() => {
        
        const intervalId = setInterval(() => {
            checkInactivity(navigate); // Pass navigate to the checkInactivity function
        }, 60 * 1000); // Check every minute

        return () => clearInterval(intervalId);
    }, [navigate]);

    return(
    
        <div>
          <Adminheader/>
            <InventoryChart />
                
        </div>
    )
}
export default SessionValidationHOC(Dashboarda);