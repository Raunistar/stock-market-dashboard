# 📈 Stock Market Dashboard

A responsive and interactive stock market dashboard built with **HTML, CSS, and Vanilla JavaScript**. The application provides stock tracking, interactive price charts, detailed analytics, theme switching, and API integration through a modular JavaScript architecture.

## 🚀 Live Demo

[View Live Demo](https://stomadash.netlify.app/)

## ✨ Features

* 📊 **Interactive Stock Charts** powered by Chart.js
* 📈 **Multiple Time Ranges** — 1 Month, 3 Months, 1 Year, and 5 Years
* 💼 **Stock Portfolio List** with 10 major stocks
* 📋 **Detailed Stock Information** including book value, profit/loss, and summary
* 🔎 **Peak & Low Analysis** for the selected time range
* 🖱️ **Interactive Tooltips** displaying price and date information
* 🌙 **Light/Dark Theme** support
* 📱 **Responsive Design** for desktop, tablet, and mobile
* ⏳ **Loading States** during API requests
* ⚠️ **Error Handling** with user-friendly feedback
* 💾 **API Data Caching** to reduce unnecessary requests
* 🔄 **Mock Data Fallback** when the API is unavailable

## 🛠️ Tech Stack

* **HTML5**
* **CSS3**
* **JavaScript (ES6+)**
* **ES6 Modules**
* **Chart.js**
* **Font Awesome**
* **Google Fonts**
* **REST API**

## 🏗️ Project Structure

```text
stock-market-dashboard/
│
├── index.html
├── styles.css
│
├── script/
│   ├── main.js
│   ├── apiModule.js
│   ├── chartModule.js
│   ├── uiModule.js
│   ├── mockData.js
│   └── utils.js
│
└── README.md
```

### Module Responsibilities

| Module           | Responsibility                                |
| ---------------- | --------------------------------------------- |
| `main.js`        | Application controller and event coordination |
| `apiModule.js`   | API requests, caching, and data retrieval     |
| `chartModule.js` | Chart creation and updates                    |
| `uiModule.js`    | DOM updates, theme management, and UI states  |
| `mockData.js`    | Fallback stock data generation                |
| `utils.js`       | Shared utility functions                      |

## 🌐 API Integration

The dashboard retrieves stock information from REST API endpoints.

### API Endpoints

* **Chart Data:** `https://stock-market-cpi-k9vl.onrender.com/api/stocksdata`
* **Stock Statistics:** `https://stock-market-cpi-k9vl.onrender.com/api/stocksstatsdata`
* **Profile Data:** `https://stock-market-cpi-k9vl.onrender.com/api/profiledata`

### Data Handling

```text
API Request
     ↓
Fetch Data
     ↓
Cache Response
     ↓
Process Data
     ↓
Render UI
```

If the API is unavailable, the application falls back to mock data so the dashboard remains functional.

## 📊 Dashboard Workflow

Users can:

1. Select a stock from the portfolio list
2. View its price chart
3. Change the chart time range
4. Inspect peak and low values
5. View stock statistics
6. Read the company summary
7. Switch between light and dark themes

## 🧠 Key JavaScript Concepts

This project focuses on practical frontend development concepts:

* ES6 Modules
* `async/await`
* Fetch API
* REST API integration
* DOM manipulation
* Event handling
* Array methods
* Data transformation
* Debouncing
* Caching
* Error handling
* Loading states
* Dynamic UI rendering
* Browser storage
* Responsive UI state management

## ⚡ Performance & Reliability

The application includes:

* **Caching** to minimize repeated API requests
* **Debouncing** for appropriate user interactions
* **Efficient DOM updates**
* **Loading indicators** during asynchronous operations
* **Graceful API failure handling**
* **Mock data fallback** when external data is unavailable

## 📱 Responsive Design

The dashboard adapts across:

* Desktop
* Laptop
* Tablet
* Mobile devices

The stock list, chart area, analytics, and controls adjust according to the available screen size.

## 🎨 UI & Accessibility

The interface includes:

* Semantic HTML structure
* Keyboard-friendly interactions
* Responsive layouts
* Clear visual feedback
* Light/Dark theme support
* Consistent typography and spacing
* Accessible interactive controls

## 🚀 Getting Started

### Prerequisites

You need:

* A modern web browser
* A local development server such as VS Code Live Server

### Installation

Clone the repository:

```bash
git clone <repository-url>
```

Navigate into the project:

```bash
cd stock-market-dashboard
```

Open the project using a local development server.

For example, with VS Code, you can use **Live Server** to launch the application.

## 🎯 What I Learned

Building this project helped me strengthen my understanding of building a larger Vanilla JavaScript application from scratch.

Key areas practiced:

* Structuring a frontend application using ES6 modules
* Working with external APIs
* Handling asynchronous operations
* Managing API loading and error states
* Transforming and displaying API data
* Building interactive charts
* Separating application responsibilities into modules
* Implementing caching and fallback data
* Creating responsive interfaces
* Managing themes and UI state
* Debugging real API and browser issues

## 🔮 Future Improvements

Possible future enhancements:

* User authentication
* Personal portfolio creation
* Watchlist functionality
* More technical indicators
* Advanced chart interactions
* Historical data comparison
* Persistent portfolio data
* Unit and integration testing

## 👨‍💻 Author

**Raunak Kumar Jha**

Frontend Developer focused on building practical applications with **JavaScript and React**.

## 📄 License

This project is licensed under the **Apache License 2.0**. See the [LICENSE](LICENSE) file for details.
