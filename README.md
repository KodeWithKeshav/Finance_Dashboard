# 📈 FinanceFlow | Smart Financial Dashboard

An interactive, premium, and highly responsive frontend dashboard for tracking and analyzing financial activities. Built specifically to demonstrate modern frontend architecture, precise UI/UX design, and elegant state management.

## ✨ Demo & Key Features

### Core Capabilities
* **Rich Dashboard Overview**: At-a-glance summary with beautiful cards for Total Balance, Income, Expenses, and Savings Rate.
* **Interactive Visualizations**: Includes smooth area charts for balance trends and detailed pie and bar charts for categorical spending analysis (built with Recharts).
* **Comprehensive Transaction Management**: View all mock transactions with advanced multi-filtering (search by name or merchant, filter by category, type, date range, and column sorting).
* **Smart Insights**: Auto-computed financial metrics (eg, Highest Spending Category, Month over Month Expense Trend, Savings Rate, Subscription Costs).
* **Role Based Access Control**: Switch seamlessly between `Viewer` (read-only) and `Admin` (can add, edit, or delete transactions) roles.

### Optional Enhancements Included
* 🌙 **Dark & Light Mode**: Flawless theme switching with modern glassmorphism that perfectly adapts to the selected theme.
* 💾 **Data Persistence**: State perfectly syncs to `localStorage` – refresh the page and nothing is lost.
* 🎬 **Micro Animations**: Extensive use of Framer Motion and GSAP for highly polished entry animations, hover interactions, and smooth layout transitions.
* 📥 **Export Functionality**: Easily export your filtered transaction lists to **CSV** or **JSON**.

## 💻 Tech Stack

* **Framework**: [Next.js 16](https://nextjs.org/) (React 19)
* **Styling**: Tailwind CSS v4 with subtle CSS variables for theming.
* **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware.
* **Animations**: [Framer Motion](https://www.framer.com/motion/) & [GSAP](https://gsap.com/)
* **Charts**: [Recharts](https://recharts.org/)
* **Data Visualization**: [Three.js](https://threejs.org/)
* **Icons**: [@heroicons/react](https://heroicons.com/)

## 🚀 Setup Instructions

1. **Install dependencies**:
   Run the following command in the project root:
   ```bash
   npm install
   ```

2. **Run the development server**:
   ```bash
   npm run dev
   ```

3. **Open the App**:
   Navigate to [http://localhost:3000](http://localhost:3000) in your web browser.

## 🏗 Overview of Approach

### 1. Design Philosophy
The design language adopts a modern "glassmorphic" feel with deep layered shadows, vibrant gradient accents, and animated orbs in the background. The typography pairs clean sans serif fonts for legibility with monospaced fonts for precise financial figures. I consciously avoided building a flat or generic interface, opting instead for a UI that feels luxurious, active, and alive.

### 2. State & Architecture
To keep things maintainable yet powerful, I implemented a global store using **Zustand**. 
The state includes the actively applied filters, mock transaction list, the theme, the active role, and the current page context. I used `persist` middleware to ensure a robust user experience across page reloads.

### 3. Modularity
The application is split into highly focused structural components:
* `Layout` orchestrates the general page shell and transition management.
* `Sidebar` & `Header` handle persistent app navigation.
* `StatCards`, `Charts`, `TransactionTable`, and `InsightsPanel` are isolated, feature-specific modules that receive data or hook natively into the Zustand store.

### 4. Responsiveness
A fluid logic dictates the layout: Desktop provides an expansive sidebar and a detailed multi-column grid. Comprehensive mobile responsiveness is currently planned for future iterations, so the dashboard is best experienced on desktop displays for now.

## 🛡️ Future Improvements
* Complete responsive design optimization for mobile and tablet screens.
* Connect to an actual backend API for real time financial data.
* Integrate secure user authentication loops.
* Add pagination to the transaction table to support massive datasets.
