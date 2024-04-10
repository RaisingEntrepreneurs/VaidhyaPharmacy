import React, { useState, useEffect } from 'react';
import { VictoryBar, VictoryChart, VictoryAxis, VictoryTheme} from 'victory';
import axios from 'axios';
import { aggregateSalesData } from './aggregate';
import {  RadialChart } from 'react-vis';

const InventoryChart = () => {
  const [totalSalesData, setTotalSalesData] = useState([]);
  const [totalInventoryData, setTotalInventoryData] = useState([]);
  const [reportType] = useState('daily');
  const [paymentTypesData, setPaymentTypesData] = useState([]);
  const [expiringMedicinesData, setExpiringMedicinesData] = useState([]);
  const maxNumber = Math.max(...expiringMedicinesData.map(item => item['Number of Items']));
  const [addressData, setAddressData] = useState([]);
  const apiurl=process.env.React_App_API_URL;
// Determine the maximum tick value based on the maximum data value
const maxTickValue = Math.ceil(maxNumber / 100) * 100;



// Generate an array of tick values from 100 to the maximum tick value
const tickValues = Array.from({ length: Math.ceil(maxTickValue / 100) }, (_, index) => (index + 1) * 100);
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch data for pharmacy billing
        const salesResponse = await axios.get(`${apiurl}/api/pharmacy_billing`);
        const salesData = salesResponse.data;
        
                   
        // Fetch data for payment types
        const paymentTypesResponse = await axios.get(`${apiurl}/api/pharmacy_billing/total_sales_by_payment_type`);
        const paymentTypesData = paymentTypesResponse.data;
        setPaymentTypesData(paymentTypesData);

        // Set payment types data
        
        const inventoryResponse = await axios.get(`${apiurl}/api/inventory`);
        // const inventoryData = inventoryResponse.data;
        // console.log("++++",inventoryResponse.data)
        const inventoryData = inventoryResponse.data.map(item => ({
          x: item.brand_name,
          y: parseFloat(item.stock_quantity), // Parse the value to ensure it's a valid number
        }));
        
        // Check for NaN values and handle them accordingly
        // const validInventoryData = inventoryData.filter(item => !isNaN(item.y));
        
        // Process sales data to aggregate sales based on report type
        const aggregatedSalesData = aggregateSalesData(salesData, reportType);
        // console.log("----------------------",aggregatedSalesData);
        setTotalSalesData(aggregatedSalesData);
    
        // Set total inventory data
        setTotalInventoryData(inventoryData);
    
        

        // Filter medicines expiring in the next 3 months
        const currentDate = new Date();
        const nextThreeMonths = new Date(currentDate);
        nextThreeMonths.setMonth(currentDate.getMonth() + 3);
        const filteredMedicines = inventoryData.filter(medicine => {
          const expirationDate = new Date(medicine.Expiration_Date);
          return expirationDate <= nextThreeMonths;
        });

        // Categorize medicines based on expiration dates
        const expiringInOneMonth = filteredMedicines.filter(medicine => {
          const expirationDate = new Date(medicine.Expiration_Date);
          return expirationDate <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        });

        const expiringInTwoMonths = filteredMedicines.filter(medicine => {
          const expirationDate = new Date(medicine.Expiration_Date);
          return expirationDate <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 2, 0);
        });

        const expiringInThreeMonths = filteredMedicines.filter(medicine => {
          const expirationDate = new Date(medicine.Expiration_Date);
          return expirationDate <= new Date(currentDate.getFullYear(), currentDate.getMonth() + 3, 0);
        });

        // Count the number of medicines in each category
        const data = [
          { category: '1 Month', count: expiringInOneMonth.length },
          { category: '2 Months', count: expiringInTwoMonths.length },
          { category: '3 Months', count: expiringInThreeMonths.length }
        ];
        setExpiringMedicinesData(data);
     
    const response = await axios.post(`${apiurl}/api/patientsph`);
    const patients = response.data;
    // console.log(patients)

    // Extract addresses and count occurrences
    const addressCounts = patients.reduce((counts, patient) => {
      const address = patient.address;
      counts[address] = (counts[address] || 0) + 1;
      return counts;
    }, {});

    // Prepare data for pie chart
    const pieChartData = Object.keys(addressCounts).map(address => ({
      x: address,
      y: addressCounts[address]
    }));

    setAddressData(pieChartData);
  } catch (error) {
    // console.error('Error fetching data:', error);
  }
};       
    fetchData();
  }, [reportType,apiurl]);
  const chartData = paymentTypesData.map(item => ({
    angle: parseFloat(item.total_sales),
    label: item.payment_type,
  }));
  const renderPieChart = () => {
    // console.log('++++++++++++',chartData)
    if ((paymentTypesData.length === 0) ) {
      return <div>No data available for payment types.</div>;
    } else {
      return (
        <VictoryChart
        domainPadding={{ x: 50 }}
        theme={VictoryTheme.material}
        width={300}
        height={300}
      >
        <VictoryAxis dependentAxis />
        <VictoryAxis tickFormat={chartData.map(item => item.label)} />
        <VictoryBar
          data={chartData}
          x="label"
          y="angle"
          style={{ data: { fill: '#4caf50' } }}
        />
      </VictoryChart>
      );
    }
  };
  // Data for the pie chart
  const data = {
    labels: ['Medicine', 'FMCG'],
    datasets: [
      {
        data: [totalSalesData.medicine, totalSalesData.fmcg],
        backgroundColor: [
          'rgba(0, 0, 0, 0.6)', // Black color for both segments
          'rgba(0, 0, 0, 0.6)', // Black color for both segments
        ],
        borderColor: [
          'rgba(0, 0, 0, 1)', // Black color for both segments
          'rgba(0, 0, 0, 1)', // Black color for both segments
        ],
        borderWidth: 1,
      },
    ],
  };
  const PieChart = ({ data }) => {
    if (paymentTypesData.length === 0) {
      return <div>No data available for Sales.</div>;
    } else {
    return (
      <RadialChart
        data={data}
        width={300}
        height={300}
        colorType="literal"
        innerRadius={100}
        radius={140}
        labelsRadiusMultiplier={1.1}
        labelsStyle={{ fontSize: 14, fill: '#fff' }}
      />
      );
    }
  };
  return (
    <div>
      
      <div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '10px' }}>
     <div style={{ marginRight: '20px', marginBottom: '20px', marginTop: '20px' }}>
    <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Total Sales of products</h2>
    <div style={{ height: '400px', width: '600px' }}>
      <VictoryChart domainPadding={20} theme={VictoryTheme.material} width={600} height={400}>
        <VictoryAxis
          tickFormat={tick => tick}
          style={{
            tickLabels: { angle: -45, fontSize: 8, padding: 5 }
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={totalSalesData}
          x="product"
          y="totalSales"
          style={{ data: { stroke: 'rgba(75, 192, 192, 0.7)' } }}
        />
      </VictoryChart>
    </div>
  </div>
  <div>
    <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block', marginTop: '20px' }}>Total Inventory</h2>
    <div style={{ height: '400px', width: '600px' }}>
      <VictoryChart domainPadding={20} theme={VictoryTheme.material} width={600} height={400}>
        <VictoryAxis
          tickFormat={tick => tick}
          style={{
            tickLabels: { angle: -45, fontSize: 8, padding: 5 }
          }}
        />
        <VictoryAxis dependentAxis />
        <VictoryBar
          data={totalInventoryData}
          x="Product_name" // Change this to the correct key for product name in your inventory data
          y="Quali_in_stock" // Change this to the correct key for quantity in your inventory data
          style={{ data: { fill: 'rgba(192, 75, 75, 0.7)' } }}
        />
      </VictoryChart>
    </div>
  </div>
</div>
<div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '10px', marginTop: '20px' }}>
  <div>
  <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Total Sales</h2>
    <div style={{ height: '400px', width: '500px' }}>
      <PieChart data={data} />
    </div>
  </div>
  <div style={{ marginLeft: '5%' }}>
    <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Medication Expire Snapshort </h2>
    <div style={{ height: '400px', width: '600px' }}>
      <VictoryChart domainPadding={20} theme={VictoryTheme.material} width={600} height={400}>
        <VictoryAxis tickValues={[1, 2, 3]} tickFormat={["1 month", "2 months", "3 months"]} />
        <VictoryAxis dependentAxis tickValues={tickValues} />
        <VictoryBar
          data={expiringMedicinesData}
          x="Expire Date"
          y="Number of Items"
          style={{ data: { fill: 'rgba(75, 192, 192, 0.7)' } }}
        />
      </VictoryChart>
    </div>
  </div>
  </div>
  <div style={{ display: 'flex', alignItems: 'flex-start', marginLeft: '10px', marginTop: '20px' }}>
    <div>
     <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Payment Type Distribution</h2>
  <div style={{ height: '400px', width: '500px' }}>
    {renderPieChart()}
    </div>
    </div>
     <div>
      <h2 style={{ color: '#18B7BE', fontSize: '24px', display: 'inline-block' }}>Geographical  Distribution of Customers</h2>
      <div style={{ width: '400px', height: '400px' }}>
      <VictoryChart
      domainPadding={20}
      width={600}
      height={400}
    >
      <VictoryAxis  />
      <VictoryAxis dependentAxis />
      <VictoryBar
        data={addressData}
        x="state"
        y="count"
      />
    </VictoryChart>
      </div>
      </div>
      </div>
</div>
    
  );
};

export default InventoryChart;
