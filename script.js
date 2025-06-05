// input data
const stockDropdown = document.getElementById('dropdown');
const btnLoadStock = document.getElementById('loadStock');

const searchStock = document.getElementById('stockSearch')
const btnSearchStock = document.getElementById('searchStock');

const stockDetails = document.getElementById('stock-details');
const stockGraph = document.getElementById('stock-graph').getContext('2d');
let stockChart;
const stockTable = document.getElementById('stock_table').getElementsByTagName('tbody')[0];

// API 
const apiKey = 'Y654TYX1RZTR6GYA';


// fetch  stock data
async function getStockData(symbolStock) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbolStock}&apikey=${apiKey}`);
    const data = await response.json();
    console.log(data);
    return data['Time Series (Daily)']; // getting daily chart data
}

// Display Stock Information
    function displayStockInfo(stockData, stockName) {
        const newestDate = Object.keys(stockData)[0];
        
        const newestData = stockData[newestDate];
        const price = newestData['4. close'];
        const volume = newestData['5. volume'];
        const change = (price - stockData[Object.keys(stockData)[1]]['4. close']).toFixed(2);
        
        stockDetails.innerHTML = `
            <h3>${stockName}</h3>
            <p>Price: $${price}</p>
            <p>Change: $${change}</p>
            <p>Volume: ${volume}</p>
        `;

        updateStockTable(stockName, price, change, volume);
    }


// Update stock comparison table
function updateStockTable(stockName, price, change, volume) {
    const rowsData = stockTable.insertRow();
    rowsData.innerHTML = `
        <td>${stockName}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;
}

// Display stock Price Graph
function displayStockPriceGraph(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse();
    const data = labels.map(date => stockData[date]['4. close']);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(stockGraph, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price Chart',
                data: data,
                borderColor: 'red',
                borderWidth: 1,
                fill: false
            }]
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: false
                }
            }
        }
    });
}
   
// handling Load stock Data button
btnLoadStock.addEventListener('click', async()=>{
    const selectedStockOption =  stockDropdown.value;
    const stockData = await getStockData(selectedStockOption);
    if (stockData) {
        displayStockInfo(stockData, selectedStockOption);
        displayStockPriceGraph(stockData);
    } else {
        stockDetails.innerText = `Stock data not available for ${selectedStockOption}.`;
    }
});


// Handling Stock Search Button
btnSearchStock.addEventListener('click', async ()=>{
    const symbolStock = searchStock.value.toUpperCase();
    const stockData = await getStockData(symbolStock);
    if (stockData) {
        displayStockInfo(stockData, symbolStock);
        displayStockPriceGraph(stockData);
    } else {
        stockDetails.innerText = `Stock symbol not found  for ${symbolStock}.`;
    }
});








