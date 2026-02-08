# StockWise - Smart Stock Trading & Investment Platform

StockWise is a comprehensive web application designed for stock trading, portfolio management, and market analysis. It provides users with tools to track stocks, manage their investments, view market news, and interact with an AI assistant for financial insights. The platform caters to regular users, brokers, and administrators, each with dedicated functionalities.

## ✨ Key Features

* **User Authentication:** Secure registration and login for users, brokers, and admins. Includes Google OAuth integration and password reset functionality (OTP via email & Redis).

* **User Roles:**
    * **Users:** Manage portfolio, watchlist, transactions, profile, wallet, interact with chatbot. Requires admin verification for full features.
    * **Brokers:** Manage assigned clients, view/process transactions (TBD - needs backend logic).
    * **Admin:** User management (view, verify, reject, potentially disable), dashboard with statistics, view pending verifications.

* **Portfolio Management:** Track owned stocks, average prices, quantities, total value, and overall gains/losses.

* **Watchlist:** Add and remove stocks for easy tracking.

* **Stock Information:** Browse stock listings, view detailed stock pages with charts and company information.

* **Market Data & News:** View market summaries, top stocks, and fetch latest financial news (via Finnhub API, currently using mock data).

* **Trading Simulation:** Buy and sell stocks (updates portfolio and wallet balance, records transactions).

* **AI Chatbot:** Integrated chatbot (using OpenRouter API) to answer stock-related questions, potentially leveraging user portfolio context.

* **Wallet System:** Users have a virtual wallet, can add funds via Stripe integration.

* **User Verification:** Admin approval workflow for user accounts, including proof document upload (e.g., License, Passport) stored via Multer.

* **Profile Management:** Users can view and update their profile information (name, contact, address). Admins can potentially update user status.

* **Responsive UI:** Built with React and Bootstrap for adaptability across devices.

* **State Management:** Uses Redux Toolkit for managing application state, particularly authentication.

* **Theming:** Includes a theme provider structure (currently only light theme implemented).

## 👥 User Roles & Flows

1. **Public Visitor:**
   * Lands on the `HomePage`.
   * Can browse general stock information (`StockListingPage`, limited?).
   * Can view Market News.
   * Can register as a User (`RegisterPage`) or Broker (`BrokerRegisterPage`).
   * Can log in (`LoginPage`).
   * Can request password reset (`ForgotPasswordPage`, `ResetPasswordPage`).

2. **Registered User (Pending/Rejected Verification):**
   * Logs in (`LoginPage`).
   * Can view their `ProfilePage` and upload verification documents.
   * Can view basic site features (e.g., stock listings, news).
   * **Cannot** access portfolio, watchlist, or execute trades until approved.
   * Receives email notification on verification status change.

3. **Registered User (Approved):**
   * Logs in.
   * Accesses their personalized `DashboardPage`.
   * Manages their `PortfolioSummary`.
   * Manages their `WatchlistPreview`.
   * Views their `RecentTransactions`.
   * Can Buy/Sell stocks via Modals (triggered from `StockListingPage` or potentially portfolio/watchlist).
   * Can add funds to their `WalletComponent` via Stripe.
   * Can use the AI `ChatBot`.
   * Manages their `ProfilePage`.
   * Logs out.

4. **Broker:**
   * Registers via `BrokerRegisterPage` (pending admin approval).
   * Logs in.
   * Accesses `BrokerDashboardPage` with client/transaction stats (currently mock data).
   * Manages clients via `ClientsManagementPage`.
   * Views and processes transactions via `TransactionsPage` (approval/rejection logic likely needed on backend).
   * Manages their own `ProfilePage`.
   * Logs out.

5. **Admin:**
   * Logs in (uses standard login, backend identifies admin type).
   * Redirected to `AdminDashboardPage`.
   * Views dashboard statistics (user counts, registrations).
   * Manages all users via `UsersManagementPage`.
   * Verifies/Rejects pending user accounts via `UserVerificationPage`.
   * Can view user details and verification documents (`UserDetailsModal`).
   * Potentially manages listed stocks (`StocksManagementPage` - currently uses mock data).
   * Logs out.

## 🛠️ Technology Stack

| Category | Technology |
| :------------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Frontend** | React, Vite, React Router, Redux Toolkit, React-Bootstrap, Axios, Formik, Yup, Recharts, Stripe.js, Google OAuth Client |
| **Backend** | Node.js, Express.js, MongoDB, Mongoose, JWT (JSON Web Tokens), Bcrypt, Axios, Multer (File Uploads), Nodemailer (Email), Stripe API, Redis (OTP), dotenv, cors |
| **Database** | MongoDB |
| **Cache** | Redis (Used for storing Password Reset OTPs) |
| **APIs** | Finnhub (Market Data - *Note: Mock data heavily used*), OpenRouter (AI Chatbot), Google OAuth, Stripe (Payments) |
| **Styling** | Bootstrap, React-Bootstrap, Custom CSS (`theme.css`, `main.css`) |
| **Linting** | ESLint |

## Project Structure

```bash
StockWise/
├── backend/
│   ├── config/         # Database, Redis connections
│   ├── controllers/    # Request handling logic for routes
│   ├── middleware/     # Auth checks, validation, file uploads
│   ├── models/         # Mongoose schemas for database collections
│   ├── routes/         # API endpoint definitions
│   ├── utils/          # Utility functions (e.g., OTP generation)
│   ├── uploads/        # Uploaded images/documents (ensure .gitkeep or configure storage)
│   ├── .env            # Environment variables (GITIGNORED)
│   ├── package.json
│   └── server.js       # Main backend application entry point
│
├── frontend/
│   ├── public/         # Static assets
│   ├── src/
│   │   ├── assets/     # Images, CSS
│   │   ├── components/ # Reusable UI components (common, admin, broker, etc.)
│   │   ├── config/     # Constants, theme configuration
│   │   ├── context/    # React Context providers (AuthProvider - may be deprecated by Redux)
│   │   ├── hooks/      # Custom React hooks (useAuth, useStock)
│   │   ├── pages/      # Page-level components corresponding to routes
│   │   ├── redux/      # Redux Toolkit setup (store, features/slices)
│   │   ├── services/   # API service functions (authService)
│   │   ├── validations/# Yup validation schemas
│   │   ├── App.jsx     # Main application component with routing
│   │   ├── main.jsx    # Application entry point
│   │   └── index.css   # Global styles
│   ├── .env            # Frontend environment variables (GITIGNORED)
│   ├── index.html      # HTML entry point
│   ├── package.json
│   └── vite.config.js  # Vite configuration
│
└── README.md           # This file
```

## 🚀 Project Setup

Follow these steps to set up and run the StockWise project locally.

**Prerequisites:**
* Node.js (v16 or later recommended)
* npm or yarn
* MongoDB Instance (Local or Cloud - e.g., MongoDB Atlas)
* Redis Instance (Local or Cloud - e.g., Redis Cloud)
* API Keys (Google, Finnhub, OpenRouter, Stripe)
* Email Service Credentials (e.g., Gmail App Password)

**1. Clone the Repository:**

```bash
git clone https://github.com/Aniruddhachitte26/StockWise.git
cd StockWise
```

2. Setup Backend:
```bash
cd backend
npm install
```

3. Configure Environment Variables:
```bash
Create a .env file in the backend directory with the following variables:
# Server
PORT=3000

# Database
MONGO_URI=your_mongodb_connection_string

# JWT
JWT_SECRET=your_jwt_secret

# Redis (for OTP)
REDIS_HOST=your_redis_host
REDIS_PORT=your_redis_port
REDIS_PASSWORD=your_redis_password
REDIS_USERNAME=your_redis_username

# Email Service (for notifications and OTP)
EMAIL_USERNAME=your_email_address
EMAIL_PASSWORD=your_email_app_password

# Frontend URL (for email links)
FRONTEND_URL=http://localhost:5173

# APIs
FINNHUB_API_KEY=your_finnhub_api_key
FINNHUB_API_URL=https://finnhub.io/api/v1
OPENROUTER_API_KEY=your_openrouter_api_key
GOOGLE_CLIENT_ID=your_google_client_id
STRIPE_SECRET_KEY=your_stripe_secret_key
```

4. Setup Frontend:

```bash
cd ../frontend
npm install
```


5. Run Both Applications:

Backend:

```bash
cd backend
npm run dev
```
Frontend:

```bash
cd frontend
npm run dev
```

The frontend will be available at http://localhost:5173 and the backend will run on http://localhost:3000.   
 