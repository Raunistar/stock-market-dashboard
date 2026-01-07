// chartModule.js - Add this at the top
import { formatDate, calculatePeakLow, formatCurrency } from "./utils.js";

let stockChart = null;
let currentStock = "AAPL";
let currentRange = "1month";

// Initialize chart
export const initChart = () => {
  console.log("Initializing chart...");
  const ctx = document.getElementById("stockChart").getContext("2d");

  // Destroy existing chart if it exists
  if (stockChart) {
    stockChart.destroy();
  }

  stockChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        {
          label: "Stock Price",
          data: [],
          borderColor: "rgba(59, 130, 246, 1)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          borderWidth: 2,
          fill: true,
          tension: 0.1,
          pointRadius: 0,
          pointHoverRadius: 6,
          pointHoverBackgroundColor: "rgba(59, 130, 246, 1)",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        intersect: false,
        mode: "index",
      },
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          mode: "index",
          intersect: false,
          backgroundColor: "rgba(15, 23, 42, 0.9)",
          titleColor: "#f1f5f9",
          bodyColor: "#f1f5f9",
          borderColor: "#334155",
          borderWidth: 1,
          padding: 12,
          displayColors: false,
          callbacks: {
            title: function (tooltipItems) {
              return formatDate(tooltipItems[0].parsed.x);
            },
            label: function (context) {
              const price = context.parsed.y;
              return `${currentStock}: ${formatCurrency(price)}`;
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            color: "rgba(226, 232, 240, 0.2)",
          },
          ticks: {
            color: "rgb(148, 163, 184)",
            maxRotation: 0,
          },
        },
        y: {
          grid: {
            color: "rgba(226, 232, 240, 0.2)",
          },
          ticks: {
            color: "rgb(148, 163, 184)",
            callback: function (value) {
              return formatCurrency(value);
            },
          },
        },
      },
    },
  });

  console.log("Chart initialized");
  return stockChart;
};

// Update chart with new data
export const updateChart = async (stockSymbol, range, chartData) => {
  console.log(`Updating chart: ${stockSymbol}, ${range}`);

  currentStock = stockSymbol;
  currentRange = range;

  if (!stockChart) {
    console.log("Chart not initialized, initializing now...");
    initChart();
  }

  try {
    // Update chart data
    const labels = chartData.map((item) => formatDate(item.timestamp));
    const data = chartData.map((item) => item.price);

    stockChart.data.labels = labels;
    stockChart.data.datasets[0].data = data;
    stockChart.data.datasets[0].label = `${stockSymbol} Price`;

    // Update peak/low display
    const { peak, low } = calculatePeakLow(data);
    document.getElementById("peakValue").textContent = formatCurrency(peak);
    document.getElementById("lowValue").textContent = formatCurrency(low);

    // Update selected stock display
    document.getElementById(
      "selectedStock"
    ).textContent = `${stockSymbol} - ${getStockFullName(stockSymbol)}`;

    // Update chart
    stockChart.update();
    console.log("Chart updated successfully");
  } catch (error) {
    console.error("Error updating chart:", error);
  }
};

// Get full stock name
const getStockFullName = (symbol) => {
  const names = {
    AAPL: "Apple Inc.",
    MSFT: "Microsoft Corporation",
    GOOGL: "Alphabet Inc.",
    AMZN: "Amazon.com Inc.",
    PYPL: "PayPal Holdings",
    TSLA: "Tesla Inc.",
    JPM: "JPMorgan Chase & Co.",
    NVDA: "NVIDIA Corporation",
    NFLX: "Netflix Inc.",
    DIS: "The Walt Disney Company",
  };
  return names[symbol] || symbol;
};

// Get current stock and range
export const getCurrentStock = () => currentStock;
export const getCurrentRange = () => currentRange;
