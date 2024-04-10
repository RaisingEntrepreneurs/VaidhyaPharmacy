import React from "react";
import InventoryChart from "./Inventory";

import PharmaHeader from "../Homepage/pharmaheader";
import SessionValidationHOC from '../Homepage/SessionValidationHOC';

function Dashboard () {
    return(
    
        <div>
          <PharmaHeader />
            <InventoryChart />
                
        </div>
    )
}
export default SessionValidationHOC(Dashboard);