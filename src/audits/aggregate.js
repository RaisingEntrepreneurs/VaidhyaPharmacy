// utils.js

// Function to aggregate sales data based on report type
export const aggregateSalesData = (data, reportType) => {
    // Get the current date
    const currentDate = new Date();
  
    // Filter the data based on the report type
    let filteredData = [];
    switch (reportType) {
      case 'daily':
        filteredData = data.filter(item => isSameDay(new Date(item.creat_tmst), currentDate));
        break;
      case 'weekly':
        filteredData = data.filter(item => isSameWeek(new Date(item.creat_tmst), currentDate));
        break;
      case 'monthly':
        filteredData = data.filter(item => isSameMonth(new Date(item.creat_tmst), currentDate));
        break;
      default:
        filteredData = data;
        break;
    }
  
    // Aggregate the filtered data
    const aggregatedData = filteredData.reduce((accumulator, item) => {
      // Extract product name and total sales amount from each item
      const productName = item.Drug_name;
      const totalSales = parseFloat(item.Total_amount);
  
      // Update or add the total sales for the product
      if (accumulator[productName]) {
        accumulator[productName] += totalSales;
      } else {
        accumulator[productName] = totalSales;
      }
  
      return accumulator;
    }, {});
  
    // Convert aggregated data to array format for VictoryBar component
    const aggregatedDataArray = Object.keys(aggregatedData).map(productName => ({
      product: productName,
      totalSales: aggregatedData[productName]
    }));
  
    return aggregatedDataArray;
};

// Function to check if two dates are on the same day
export const isSameDay = (date1, date2) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear();
};

// Function to check if two dates are in the same week
export const isSameWeek = (date1, date2) => {
  // Get the week numbers for both dates
  const weekNumber1 = getWeekNumber(date1);
  const weekNumber2 = getWeekNumber(date2);

  // Compare the week numbers
  return weekNumber1 === weekNumber2;
};

// Function to get the week number of a date
export const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const pastDaysOfYear = (date - firstDayOfYear) / 86400000;
  return Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
};

// Function to check if two dates are in the same month
export const isSameMonth = (date1, date2) => {
  // Get the month numbers for both dates
  const monthNumber1 = date1.getMonth();
  const monthNumber2 = date2.getMonth();

  // Compare the month numbers
  return monthNumber1 === monthNumber2;
};
