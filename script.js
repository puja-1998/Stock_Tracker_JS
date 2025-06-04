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
const apiKey = '9WVDNRTXAWZTCF6W';


// fetch  stock data
async function getStockData(symbolStock) {
    const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbolStock}&apikey=${apiKey}`);
    const data = await response.json();
    console.log(data);
    return data['Time Series (Daily)']; // getting daily chart data
}

// Display Stock Information
    function displayStockInfo(stockData, companyName) {
        const newestDate = Object.keys(stockData)[0];
        console.log(newestDate);
        
        const newestData = stockData[newestDate];
        const price = newestData['4. close'];
        const volume = newestData['5. volume'];
        const change = (price - stockData[Object.keys(stockData)[1]]['4. close']).toFixed(2);
        
        stockDetails.innerHTML = `
            <h3>${companyName}</h3>
            <p>Price: $${price}</p>
            <p>Change: $${change}</p>
            <p>Volume: ${volume}</p>
        `;

        updateStockTable(companyName, price, change, volume);
    }


// Update stock comparison table
function updateStockTable(companyName, price, change, volume) {
    const rowsData = stockTable.insertRow();
    rowsData.innerHTML = `
        <td>${companyName}</td>
        <td>$${price}</td>
        <td>${change}</td>
        <td>${volume}</td>
    `;
}

// Display stock Graph
function displayStockPriceGraph(stockData) {
    const labels = Object.keys(stockData).slice(0, 30).reverse();
    const data = labels.map(date => stockData[date]['4. close']);

    if (stockChart) {
        stockChart.destroy();
    }

    stockChart = new Chart(stockGraph, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Stock Price',
                data: data,
                borderColor: 'rgba(75, 192, 192, 1)',
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
   
// Handling Stock Search Button
searchStock.addEventListener('click', async ()=>{
    const symbolStock = searchStock.value.toUpperCase();
    const stockData = await getStockData(symbolStock);
    if (stockData) {
        displayStockInfo(stockData, symbolStock);
        displayStockPriceGraph(stockData);
    } else {
        stockDetails.innerText = `Stock symbol not found.`;
    }
});

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

// // fetch trending  stock data
// async function getTrendingData() {
//     const response = await fetch(`https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&apikey=${apiKey}`);
//     const data = await response.json();
//     console.log(data);
// }





