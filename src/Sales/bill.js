import React, { useEffect } from "react";
import AdminHeader from "../Admin/adminheader";
import SalesAndBilling from "./sales";
import SessionValidationHOC from "../Homepage/SessionValidationHOC";
import { useNavigate } from 'react-router-dom';
import { checkInactivity } from "../Homepage/sessionService";

function Billing () {
    const navigate = useNavigate();

    useEffect(() => {
        
        const intervalId = setInterval(() => {
            checkInactivity(navigate); // Pass navigate to the checkInactivity function
        }, 60 * 1000); // Check every minute

        return () => clearInterval(intervalId);
    }, [navigate]);

    return(
        <div>
            <AdminHeader />
            <SalesAndBilling />
        </div>
    )
}

export default SessionValidationHOC(Billing); // Wrap Billing component with SessionValidationHOC