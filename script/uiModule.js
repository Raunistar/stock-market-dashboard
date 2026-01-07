// uiModule.js - WORKING version
import { formatCurrency } from "./utils.js";
import { fetchStatsData, fetchProfileData } from "./apiModule.js";

// Global variables
let currentStock = "AAPL";

// Initialize theme toggle
export const initThemeToggle = () => {
  const themeToggle = document.getElementById("themeToggle");
  const themeIcon = themeToggle.querySelector("i");
  const themeText = themeToggle.querySelector("span");

  // Check saved theme
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    setDarkTheme();
  } else {
    setLightTheme();
  }

  themeToggle.addEventListener("click", () => {
    if (document.body.getAttribute("data-theme") === "dark") {
      setLightTheme();
    } else {
      setDarkTheme();
    }
  });

  function setDarkTheme() {
    document.body.setAttribute("data-theme", "dark");
    themeIcon.className = "fas fa-sun";
    themeText.textContent = "Light Mode";
    localStorage.setItem("theme", "dark");
  }

  function setLightTheme() {
    document.body.removeAttribute("data-theme");
    themeIcon.className = "fas fa-moon";
    themeText.textContent = "Dark Mode";
    localStorage.setItem("theme", "light");
  }
};

// Load stock list
export const loadStockList = async () => {
  const stockList = document.getElementById("stockList");
  const stockCount = document.getElementById("stockCount");

  try {
    const statsData = await fetchStatsData();
    const stocks = [
      "AAPL",
      "MSFT",
      "GOOGL",
      "AMZN",
      "PYPL",
      "TSLA",
      "JPM",
      "NVDA",
      "NFLX",
      "DIS",
    ];

    // Clear loading
    stockList.innerHTML = "";

    // Create stock items
    stocks.forEach((symbol) => {
      const stock = statsData[symbol] || { bookValue: 0, profit: 0 };
      const profit = stock.profit || 0;
      const profitClass = profit >= 0 ? "positive" : "negative";
      const profitSign = profit >= 0 ? "+" : "";

      const stockItem = document.createElement("div");
      stockItem.className = "stock-item";
      stockItem.dataset.symbol = symbol;

      stockItem.innerHTML = `
                <div class="stock-info">
                    <div class="stock-symbol">${symbol}</div>
                    <div class="stock-name">${getStockFullName(symbol)}</div>
                </div>
                <div class="stock-values">
                    <div class="stock-bookvalue">BV: ${formatCurrency(
                      stock.bookValue || 0
                    )}</div>
                    <div class="stock-profit ${profitClass}">
                        ${profitSign}${formatCurrency(profit)}
                    </div>
                </div>
            `;

      stockList.appendChild(stockItem);
    });

    // Update count
    if (stockCount) {
      stockCount.textContent = stocks.length;
    }

    // Set first stock as active
    const firstStock = document.querySelector(".stock-item");
    if (firstStock) {
      firstStock.classList.add("active");
    }
  } catch (error) {
    console.error("Error loading stock list:", error);
    stockList.innerHTML = '<div class="error">Failed to load stocks</div>';
  }
};

// Setup range buttons
export const setupRangeButtons = () => {
  const rangeButtons = document.querySelectorAll(".range-btn");

  rangeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      // Update active button
      rangeButtons.forEach((btn) => btn.classList.remove("active"));
      button.classList.add("active");

      // Get range and update chart
      const range = button.dataset.range;
      if (window.stockDashboard) {
        window.stockDashboard.updateChart(currentStock, range);
      }
    });
  });
};

// Setup stock click events
export const setupStockClickEvents = () => {
  const stockList = document.getElementById("stockList");
  if (!stockList) return;

  stockList.addEventListener("click", (e) => {
    const stockItem = e.target.closest(".stock-item");
    if (!stockItem) return;

    const symbol = stockItem.dataset.symbol;
    currentStock = symbol;

    // Update active state
    document.querySelectorAll(".stock-item").forEach((item) => {
      item.classList.remove("active");
    });
    stockItem.classList.add("active");

    // Get current range
    const activeRangeBtn = document.querySelector(".range-btn.active");
    const range = activeRangeBtn ? activeRangeBtn.dataset.range : "1month";

    // Update chart
    if (window.stockDashboard) {
      window.stockDashboard.updateChart(symbol, range);
    }
  });
};

// Update stock details
export const updateStockDetails = async (symbol) => {
  try {
    const [statsData, profileData] = await Promise.all([
      fetchStatsData(),
      fetchProfileData(symbol),
    ]);

    const stock = statsData[symbol] || {};
    const profit = stock.profit || 0;
    const profitClass = profit >= 0 ? "profit" : "loss";
    const profitSign = profit >= 0 ? "+" : "";

    // Update UI
    document.getElementById("detailName").textContent =
      getStockFullName(symbol);
    document.getElementById("detailBookValue").textContent = formatCurrency(
      stock.bookValue || 0
    );
    document.getElementById(
      "detailProfit"
    ).textContent = `${profitSign}${formatCurrency(profit)}`;
    document.getElementById(
      "detailProfit"
    ).className = `detail-value ${profitClass}`;
    document.getElementById("detailSummary").textContent =
      profileData.summary || "No summary available.";
  } catch (error) {
    console.error("Error updating details:", error);
    document.getElementById("detailSummary").textContent =
      "Failed to load summary";
  }
};

// Get stock full name
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

// Main init function
export const initUI = async () => {
  console.log("Initializing UI...");

  // Initialize all UI components
  initThemeToggle();
  await loadStockList();
  setupRangeButtons();
  setupStockClickEvents();

  console.log("UI initialized");
};
