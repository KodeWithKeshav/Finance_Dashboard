# FinanceFlow | Smart Financial Dashboard

An interactive, premium, and highly responsive frontend dashboard for tracking and analyzing financial activities. Built specifically to demonstrate modern frontend architecture, precise UI/UX design, and elegant state management.

## 🌟 Demo & Features

### Core Capabilities
- **Rich Dashboard Overview**: At-a-glance summary with beautiful cards for Total Balance, Income, Expenses, and Savings Rate.
- **Interactive Visualizations**: Includes smooth area charts for balance trends and detailed pie/bar charts for categorical spending analysis (built with Recharts).
- **Comprehensive Transaction Management**: View all mock transactions with advanced multi-filtering (search by name/merchant, filter by category/type/date range, and column sorting).
- **Smart Insights**: Auto-computed financial metrics (e.g., Highest Spending Category, MoM Expense Trend, Savings Rate, Subscription Costs).
- **Role-Based Access Control (RBAC)**: Switch seamlessly between `Viewer` (read-only) and `Admin` (can add/edit/delete transactions) roles.

### Optional Enhancements Included
- 🌙 **Dark & Light Mode**: Flawless theme switching with modern glassmorphism that perfectly adapts to the selected theme.
- 💾 **Data Persistence**: State perfectly syncs to `localStorage` – refresh the page and nothing is lost.
- ✨ **Micro-Animations**: Extensive use of Framer Motion for highly polished entry animations, hover interactions, and smooth layout transitions.
- 📥 **Export Functionality**: Easily export your filtered transaction lists to **CSV** or **JSON**.

## 💻 Tech Stack
- **Framework**: [Next.js 14 App Router](https://nextjs.org/) (React 18)
- **Styling**: Vanilla CSS (CSS Variables) with subtle Tailwind CSS integrations.
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with persist middleware.
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Charts**: [Recharts](https://recharts.org/)
- **Icons**: Custom responsive SVGs & standard Emojis for optimal performance.

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
The design language adopts a modern "glassmorphic" feel with deep layered shadows, vibrant gradient accents, and animated orbs in the background. The typography pairs `Inter` for clean legibility with `JetBrains Mono` for precise financial figures. I consciously avoided building a "flat, generic MVP", opting instead for a UI that feels luxurious, active, and alive.

### 2. State & Architecture
To keep things maintainable yet powerful, I implemented a global store using **Zustand**. 
The state includes the actively applied filters, mock transaction list, the theme, the active role, and the current page context. I used `persist` middleware to ensure a robust user experience across page reloads. The state is strictly typed with TypeScript.

### 3. Modularity
The application is split into highly focused structural components:
- `layout.tsx` & `page.tsx`: Orchestrate the general page shell and transition management.
- `Sidebar.tsx` & `Header.tsx`: Handle persistent app navigation.
- `StatCards.tsx`, `Charts.tsx`, `TransactionTable.tsx`, `InsightsPanel.tsx`: Isolated, feature-specific modules that receive data or hook natively into the Zustand store.

### 4. Responsiveness
A fluid logic dictates the layout: Desktop provides an expansive sidebar and a detailed multi-column grid, while screens under 1024px and 768px systematically collapse the sidebar and stack content linearly so the dashboard never feels crowded on mobile.

## 🛡️ Future Improvements (Out of Scope for Assignment)
- Connect to an actual backend (e.g., Supabase / Node.js).
- Add secure authentication (e.g., NextAuth).
- Paginating transaction data to allow handling sets larger than 1,000 items easily.
