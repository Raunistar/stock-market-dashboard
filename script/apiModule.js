// apiModule.js - HYBRID: Tries real API first, falls back to mock

import {
  generateMockChartData,
  MOCK_STATS_DATA,
  MOCK_PROFILE_DATA,
} from "./mockData.js";

const Stocks = [
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

// Configuration
const API_BASE = "https://stock-market-cpi-k9vl.onrender.com/api";
const USE_REAL_API = true; // Set to true to try real API first
const API_TIMEOUT = 10000; // 10 seconds timeout
const MAX_RETRIES = 2;

// State tracking
let isUsingRealAPI = false;
let lastAPICheck = 0;
let apiStatus = {};

// Cache
const cache = {
  chartData: {},
  statsData: null,
  profileData: {},
};

// Check if API is alive
export const checkAPIStatus = async () => {
  const now = Date.now();
  // Cache check for 30 seconds
  if (now - lastAPICheck < 30000 && Object.keys(apiStatus).length > 0) {
    return apiStatus;
  }

  lastAPICheck = now;
  apiStatus = {};

  const endpoints = ["stocksdata", "stocksstatsdata", "profiledata"];

  for (const endpoint of endpoints) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      const startTime = Date.now();
      const response = await fetch(`${API_BASE}/${endpoint}`, {
        signal: controller.signal,
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
      });

      clearTimeout(timeoutId);

      apiStatus[endpoint] = {
        online: response.ok,
        status: response.status,
        responseTime: Date.now() - startTime,
        testedAt: new Date().toISOString(),
      };

      if (response.ok) {
        // Try to parse a small piece to confirm it's JSON
        const text = await response.text();
        try {
          JSON.parse(text.substring(0, 100));
        } catch {
          apiStatus[endpoint].online = false;
          apiStatus[endpoint].error = "Invalid JSON";
        }
      }
    } catch (error) {
      apiStatus[endpoint] = {
        online: false,
        error: error.name === "AbortError" ? "Timeout" : error.message,
        responseTime: null,
        testedAt: new Date().toISOString(),
      };
    }
  }

  // Determine overall API status
  const onlineEndpoints = Object.values(apiStatus).filter(
    (s) => s.online
  ).length;
  isUsingRealAPI = onlineEndpoints >= 2; // Need at least 2/3 endpoints working

  console.log("API Status Check:", apiStatus);
  console.log("Using Real API?", isUsingRealAPI);

  return apiStatus;
};

// Smart fetcher with retry and fallback
const smartFetch = async (endpoint, retryCount = 0) => {
  if (!USE_REAL_API || !isUsingRealAPI) {
    throw new Error("Using mock data (API disabled or offline)");
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    const response = await fetch(`${API_BASE}/${endpoint}`, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    if (retryCount < MAX_RETRIES) {
      console.log(`Retrying ${endpoint} (${retryCount + 1}/${MAX_RETRIES})...`);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 * (retryCount + 1))
      );
      return smartFetch(endpoint, retryCount + 1);
    }
    throw error;
  }
};

// Main data fetching functions
export const fetchChartData = async (stockSymbol, range = "1month") => {
  const cacheKey = `${stockSymbol}_${range}`;

  if (cache.chartData[cacheKey]) {
    console.log(`Using cached chart data for ${stockSymbol}`);
    return cache.chartData[cacheKey];
  }

  try {
    // Check API status first
    await checkAPIStatus();

    if (isUsingRealAPI) {
      console.log(`Fetching REAL chart data for ${stockSymbol} (${range})`);
      const data = await smartFetch("stocksdata");
      const stockData = data[stockSymbol] || [];

      if (stockData.length > 0) {
        const filtered = filterDataByRange(stockData, range);
        cache.chartData[cacheKey] = filtered;
        return filtered;
      }
    }

    // Fallback to mock data
    console.log(`Using MOCK chart data for ${stockSymbol} (${range})`);
    if (!cache.chartData.mock) {
      cache.chartData.mock = generateMockChartData();
    }

    const mockData = cache.chartData.mock[stockSymbol] || [];
    const filtered = filterDataByRange(mockData, range);
    cache.chartData[cacheKey] = filtered;
    return filtered;
  } catch (error) {
    console.warn(`Chart data error, using mock: ${error.message}`);

    // Generate mock data on the fly
    if (!cache.chartData.mock) {
      cache.chartData.mock = generateMockChartData();
    }

    const mockData = cache.chartData.mock[stockSymbol] || [];
    const filtered = filterDataByRange(mockData, range);
    cache.chartData[cacheKey] = filtered;
    return filtered;
  }
};

export const fetchStatsData = async () => {
  if (cache.statsData) {
    return cache.statsData;
  }

  try {
    await checkAPIStatus();

    if (isUsingRealAPI) {
      console.log("Fetching REAL stats data");
      const data = await smartFetch("stocksstatsdata");

      // Validate data structure
      if (data && typeof data === "object" && data["AAPL"]) {
        cache.statsData = { ...data, source: "api" };
        return data;
      }
    }

    // Fallback to mock
    console.log("Using MOCK stats data");
    cache.statsData = { ...MOCK_STATS_DATA, source: "mock" };
    return MOCK_STATS_DATA;
  } catch (error) {
    console.warn(`Stats data error, using mock: ${error.message}`);
    cache.statsData = { ...MOCK_STATS_DATA, source: "mock" };
    return MOCK_STATS_DATA;
  }
};

export const fetchProfileData = async (stockSymbol) => {
  const cacheKey = stockSymbol;

  if (cache.profileData[cacheKey]) {
    return cache.profileData[cacheKey];
  }

  try {
    await checkAPIStatus();

    if (isUsingRealAPI) {
      console.log(`Fetching REAL profile for ${stockSymbol}`);
      const data = await smartFetch("profiledata");

      if (data && data[stockSymbol]) {
        cache.profileData[cacheKey] = { ...data[stockSymbol], source: "api" };
        return data[stockSymbol];
      }
    }

    // Fallback to mock
    console.log(`Using MOCK profile for ${stockSymbol}`);
    const mockProfile = MOCK_PROFILE_DATA[stockSymbol] || {
      summary: `${stockSymbol} is a publicly traded company.`,
    };

    cache.profileData[cacheKey] = { ...mockProfile, source: "mock" };
    return mockProfile;
  } catch (error) {
    console.warn(`Profile data error, using mock: ${error.message}`);
    const mockProfile = MOCK_PROFILE_DATA[stockSymbol] || {
      summary: `${stockSymbol} is a publicly traded company.`,
    };

    cache.profileData[cacheKey] = { ...mockProfile, source: "mock" };
    return mockProfile;
  }
};

// Helper function
const filterDataByRange = (data, range) => {
  if (!data || !Array.isArray(data) || data.length === 0) {
    return [];
  }

  const now = Date.now() / 1000;
  let days;

  switch (range) {
    case "1month":
      days = 30;
      break;
    case "3month":
      days = 90;
      break;
    case "1year":
      days = 365;
      break;
    case "5year":
      days = 5 * 365;
      break;
    default:
      days = 30;
  }

  const cutoff = now - days * 24 * 60 * 60;
  return data.filter((item) => item && item.timestamp >= cutoff);
};

// Get data source info
export const getDataSourceInfo = () => {
  return {
    usingRealAPI: isUsingRealAPI,
    apiStatus,
    lastChecked: new Date(lastAPICheck).toLocaleTimeString(),
  };
};

// Manual override
export const setUseRealAPI = (value) => {
  isUsingRealAPI = value;
  console.log(
    `Manual API setting: ${value ? "Using REAL API" : "Using MOCK data"}`
  );
};

// Get all stocks
export const getStocks = () => Stocks;

// Clear cache
export const clearCache = () => {
  cache.chartData = {};
  cache.statsData = null;
  cache.profileData = {};
  console.log("Cache cleared");
};
