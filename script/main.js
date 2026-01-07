// main.js - SIMPLE and WORKING version
import { initChart, updateChart } from "./chartModule.js";
import { initUI } from "./uiModule.js";

class StockDashboard {
  constructor() {
    this.currentStock = "AAPL";
    this.currentRange = "1month";
  }

  async init() {
    console.log("Initializing dashboard...");

    // Initialize UI (theme, buttons, stock list)
    await initUI();

    // Initialize chart
    initChart();

    // Load initial data
    await this.loadInitialData();

    console.log("Dashboard ready!");
  }

  async loadInitialData() {
    try {
      console.log("Loading initial data...");

      // Get the chart loading element
      const chartLoading = document.getElementById("chartLoading");
      if (chartLoading) chartLoading.style.display = "flex";

      // Import fetchChartData here to avoid circular dependencies
      const { fetchChartData } = await import("./apiModule.js");

      // Load chart data
      const chartData = await fetchChartData(
        this.currentStock,
        this.currentRange
      );

      // Update chart
      await updateChart(this.currentStock, this.currentRange, chartData);

      // Update stock details
      const { updateStockDetails } = await import("./uiModule.js");
      await updateStockDetails(this.currentStock);
    } catch (error) {
      console.error("Error loading initial data:", error);
    } finally {
      const chartLoading = document.getElementById("chartLoading");
      if (chartLoading) chartLoading.style.display = "none";
    }
  }

  async updateChart(stockSymbol, range) {
    this.currentStock = stockSymbol;
    this.currentRange = range;

    try {
      const chartLoading = document.getElementById("chartLoading");
      if (chartLoading) chartLoading.style.display = "flex";

      const { fetchChartData } = await import("./apiModule.js");
      const chartData = await fetchChartData(stockSymbol, range);

      await updateChart(stockSymbol, range, chartData);

      const { updateStockDetails } = await import("./uiModule.js");
      await updateStockDetails(stockSymbol);
    } catch (error) {
      console.error("Error updating chart:", error);
    } finally {
      const chartLoading = document.getElementById("chartLoading");
      if (chartLoading) chartLoading.style.display = "none";
    }
  }
}

// Start everything when page loads
document.addEventListener("DOMContentLoaded", () => {
  const dashboard = new StockDashboard();
  window.stockDashboard = dashboard;
  dashboard.init();
});
