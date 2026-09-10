# 🌾 Farmer Market Connect

[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen.svg)](https://nodejs.org/)
[![React Version](https://img.shields.io/badge/react-18.3.1-blue.svg)](https://reactjs.org/)
[![AI Model](https://img.shields.io/badge/Groq%20AI-llama--3.1--8b--instant-orange.svg)](https://groq.com/)
[![License](https://img.shields.io/badge/license-ISC-green.svg)](LICENSE)

**Farmer Market Connect** is a complete, production-ready, AI-powered MERN stack web application built to digitally bridge agricultural producers directly with consumers, retailers, and commercial buyers across India. By eliminating multi-tier middleman markups, the platform provides farmers with 100% of their listed crop proceeds, empowers buyers with fresh farm produce at fair rates, and delivers real-time conversational assistance using **Groq Cloud API** (`llama-3.1-8b-instant`).

---

## 📑 Table of Contents
1. [Project Overview](#-project-overview)
2. [Key Features](#-key-features)
3. [Architecture & Workflow](#-architecture--workflow)
4. [Technology Stack](#-technology-stack)
5. [Directory Structure](#-directory-structure)
6. [Prerequisites](#-prerequisites)
7. [Installation & Setup](#-installation--setup)
8. [Environment Variables](#-environment-variables)
9. [Database Seeding](#-database-seeding)
10. [Groq AI Integration & RAG](#-groq-ai-integration--rag)
11. [REST API Documentation](#-rest-api-documentation)
12. [Role-Based Access Control (RBAC)](#-role-based-access-control-rbac)
13. [Deployment Guide](#-deployment-guide)
14. [Security & Hardening](#-security--hardening)
15. [Troubleshooting & FAQ](#-troubleshooting--faq)

---

## 🌾 Project Overview

Traditional agricultural trade suffers from lack of transparency, delayed payouts, and substantial middleman margins that reduce farmer earnings while raising grocery prices for households.

**Farmer Market Connect** solves this by providing:
- **Direct Marketplace**: Verified crop listings with authentic harvest photos, stock levels, and Indian Rupee (₹) unit pricing.
- **Role-Tailored Dashboards**: Specialized views for consumers, farmers, and platform administrators.
- **Intelligent Groq Assistant**: Natural-language crop discovery grounded in real-time MongoDB inventory (RAG).
- **Flexible Checkout**: Cash on Delivery (COD) and Direct UPI options with real-time animated shipment tracking.

---

## 🌟 Key Features

### 🛒 Consumer Experience
- **Smart Marketplace**: Live search, category filtering (Vegetables, Fruits, Grains, Pulses, Spices, Dairy, Organic, Seeds), price ranges, and farm location filtering.
- **Produce Details**: Image galleries, organic badges, farmer biographical narratives, and related harvest recommendations.
- **Basket & Checkout**: Dynamic quantity controls, subtotal calculations, and address verification.
- **Order Tracking**: Visual 5-step timeline (`Pending` → `Confirmed` → `Processing` → `In Transit` → `Delivered`).
- **Profile & Alerts**: In-app notifications for order updates and address defaults.

### 👩‍🌾 Farmer Experience
- **Farmer Dashboard**: Real-time sales statistics, revenue charts, order counts, and quick-action shortcuts.
- **Produce Management**: List new crops, adjust available stock in kg/quintal/crates, modify pricing, toggle live marketplace availability, and delete listings with confirmation modals.
- **Order Processing**: Review incoming customer orders, manage delivery status transitions, and view customer delivery instructions.

### 🛡️ Admin Experience
- **Platform Analytics**: Global GMV sales metrics, user acquisition totals, and live listing health.
- **User Moderation**: Filter by role, review contact details, and activate or suspend accounts.
- **Product Moderation**: Delist inappropriate or unverified listings and perform administrative deletes.
- **Category Control**: Create, edit, and categorize produce types with custom cover imagery.
- **AI Audit**: Monitor Groq AI conversation frequencies and query volume.

### 🤖 Groq AI Assistant (`llama-3.1-8b-instant`)
- Accessible anywhere via floating draggable assistant button.
- Server-side context injection (Retrieval-Augmented Generation) prevents hallucinations by fetching live catalog items.
- Provides advice on bulk requirements, recipes, organic verification, and seller onboarding.

---

## 🏗 Architecture & Workflow

```
                             ┌─────────────────────────────────┐
                             │       User Web Browser          │
                             │ React 18, Vite, Tailwind CSS    │
                             │ Context API + Framer Motion     │
                             └───────────────┬─────────────────┘
                                             │ HTTP/REST + JWT Bearer
                                             ▼
                             ┌─────────────────────────────────┐
                             │        Express.js Backend       │
                             │ Rate Limiting, Helmet, Security │
                             │ RBAC Middlewares (Roles)        │
                             └───────┬─────────────────┬───────┘
                                     │                 │
                      Mongoose Models│                 │ OpenAI-compatible REST
                                     ▼                 ▼
                        ┌──────────────────┐    ┌──────────────────────────┐
                        │     MongoDB      │    │      Groq Cloud API      │
                        │ Users, Products, │    │  llama-3.1-8b-instant    │
                        │ Orders, Cat, AI  │    │  (Context-Aware RAG)     │
                        └──────────────────┘    └──────────────────────────┘
```

---

## 💻 Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 18, Vite, Tailwind CSS, Framer Motion, Lucide React, Axios, React Router DOM 6 |
| **Backend** | Node.js, Express.js, Express Validator, Helmet, CORS, Morgan, Express Rate Limit |
| **Database** | MongoDB, Mongoose 8 |
| **Authentication** | JSON Web Tokens (JWT), bcryptjs password hashing (10 rounds) |
| **Artificial Intelligence** | Groq API, Model: `llama-3.1-8b-instant` |

---

## 📁 Directory Structure

```
Farmer-market-connect/
├── client/                     # Frontend Single Page Application
│   ├── public/                 # Favicon & robots.txt
│   ├── src/
│   │   ├── components/
│   │   │   ├── admin/          # Admin stats, tables & category modals
│   │   │   ├── ai/             # Floating assistant, message bubbles, typing indicators
│   │   │   ├── common/         # Buttons, Inputs, Cards, Badges, Modals, Toasts, Skeletons
│   │   │   ├── consumer/       # Order cards & animated timeline
│   │   │   ├── farmer/         # Dashboard cards, sales charts & product tables
│   │   │   ├── landing/        # Hero, Features, Workflow, FAQ, Pricing, Testimonials
│   │   │   ├── layout/         # Responsive Navbar, Footer, Dashboard Sidebar
│   │   │   └── marketplace/    # ProductCard, ProductGrid, SearchBar, FilterPanel
│   │   ├── context/            # AuthContext, CartContext, ThemeContext, AIContext
│   │   ├── hooks/              # useAuth, useCart, useTheme, useAI
│   │   ├── pages/              # Marketplace, ProductDetails, Dashboards, Orders, Profile
│   │   ├── routes/             # ProtectedRoute, RoleRoute, AppRoutes
│   │   ├── services/           # Axios API client, auth, product, order, user, AI services
│   │   └── utils/              # Formatters (₹ currency), validators, constants
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                     # Backend REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection & environment validator
│   │   ├── controllers/        # Auth, User, Product, Order, Admin, AI controllers
│   │   ├── middleware/         # Auth, Role RBAC, Rate limiting, Centralized errors
│   │   ├── models/             # User, Product, Order, Category, Notification, AIConversation
│   │   ├── routes/             # Express API route declarations
│   │   ├── services/           # Groq AI service, catalog RAG, business logic
│   │   ├── utils/              # JWT generator, Seed scripts (Admin & Data), Logger
│   │   ├── app.js              # Express app setup & middlewares
│   │   └── server.js           # Server lifecycle & port binding
│   ├── package.json
│   └── .env.example
├── package.json                # Root orchestration scripts
└── README.md
```

---

## ⚙️ Prerequisites

- **Node.js**: `v18.0.0` or higher (tested on Node v26)
- **npm**: `v9.0.0` or higher
- **MongoDB**: Local MongoDB community instance or [MongoDB Atlas URI](https://www.mongodb.com/cloud/atlas)
- **Groq API Key**: Obtain a free API key at [console.groq.com](https://console.groq.com/)

---

## 🚀 Installation & Setup

### 1. Clone or Open the Repository
```bash
cd Farmer-market-connect
```

### 2. Install Dependencies
Install dependencies across both client and server:
```bash
npm run install:all
```
*(Alternatively: `cd server && npm install` followed by `cd ../client && npm install`)*

---

## 🔐 Environment Variables

### Server (`server/.env`)
Create `server/.env` based on `server/.env.example`:
```ini
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/farmer_market_connect
JWT_SECRET=your_super_secret_jwt_key_farmer_market_2026_at_least_32_chars
GROQ_API_KEY=gsk_your_groq_api_key_here
CLIENT_URL=http://localhost:5173
ADMIN_EMAIL=admin@farmermarket.com
ADMIN_PASSWORD=Admin@123456
```

### Client (`client/.env`)
In local development, requests to `/api` are automatically proxied to `http://localhost:5000` via Vite. For production builds, specify:
```ini
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## 🌱 Database Seeding

Populate the database with verified categories, realistic Indian agricultural produce, and demo accounts:

### Seed Administrator Account
```bash
npm run seed:admin
```
*Creates the admin user using `ADMIN_EMAIL` and `ADMIN_PASSWORD` defined in `server/.env`.*

### Seed Full Agricultural Demo Catalog
```bash
npm run seed:data
```
*Populates 8 categories, 3 verified farmers, 2 demo buyers, 12 realistic crop products with Indian Rupee (₹) pricing, and sample tracked orders.*

#### Default Demo Credentials:
| Role | Email | Password |
|---|---|---|
| **Farmer** | `ramesh.farmer@example.com` | `Password123!` |
| **Consumer** | `priya.buyer@example.com` | `Password123!` |
| **Admin** | `admin@farmermarket.com` | `Admin@123456` |

---

## 🤖 Groq AI Integration & RAG

The platform integrates Groq's low-latency OpenAI-compatible Chat Completions endpoint:
`https://api.groq.com/openai/v1/chat/completions` using the `llama-3.1-8b-instant` model.

### Features & Protections:
1. **Zero Frontend Secret Leaks**: The `GROQ_API_KEY` is kept strictly on the Node.js server.
2. **Context-Aware RAG (Retrieval-Augmented Generation)**: Before sending prompts to Groq, the backend queries MongoDB for relevant crop availability and injects real produce prices, units, and farmers into the prompt.
3. **Graceful Fallback**: If the Groq API key is not configured or upstream limits are reached, the assistant automatically answers with grounded agricultural guidance without crashing.

---

## 📡 REST API Documentation

### Authentication (`/api/auth`)
- `POST /api/auth/register` — Register a consumer or farmer account
- `POST /api/auth/login` — Authenticate and receive JWT Bearer token
- `GET /api/auth/me` — Retrieve current authenticated session

### Produce (`/api/products`)
- `GET /api/products` — Filterable & searchable products (query: `search`, `category`, `minPrice`, `maxPrice`, `organic`, `location`, `sort`, `page`, `limit`)
- `GET /api/products/categories` — Distinct produce categories
- `GET /api/products/:id` — Full crop details with farmer information
- `GET /api/products/farmer/my-products` — Farmer's own listings *(Farmer/Admin)*
- `POST /api/products` — List new harvest produce *(Farmer/Admin)*
- `PUT /api/products/:id` — Update listing details *(Owner/Admin)*
- `DELETE /api/products/:id` — Remove listing *(Owner/Admin)*

### Orders (`/api/orders`)
- `POST /api/orders` — Create new order with stock reservation *(Consumer)*
- `GET /api/orders` — List user's orders *(Role-filtered)*
- `GET /api/orders/:id` — Detailed order view with status timeline
- `PUT /api/orders/:id/status` — Advance order status *(Farmer/Admin)*
- `PUT /api/orders/:id/cancel` — Cancel eligible order and restore stock

### AI Assistant (`/api/ai`)
- `POST /api/ai/chat` — Send conversation prompt (Rate limited)
- `GET /api/ai/history` — Get user's conversation history *(Authenticated)*
- `DELETE /api/ai/history` — Clear stored history

### Administration (`/api/admin`)
- `GET /api/admin/stats` — Platform GMV, orders, users, active listings
- `GET /api/admin/users` — Search and manage user roles/statuses
- `PUT /api/admin/users/:id/status` — Activate/suspend user accounts
- `GET /api/admin/products` — Audit all marketplace produce listings
- `PUT /api/admin/products/:id/status` — Toggle product live status
- `DELETE /api/admin/products/:id` — Permanent administrative deletion
- `GET /api/admin/categories` — Manage produce categories
- `POST /api/admin/categories` — Create category
- `GET /api/admin/ai-summary` — Audit Groq AI query volume

---

## 🔒 Security & Hardening

1. **Helmet & Security Headers**: Sets HTTP response security headers.
2. **Strict CORS Policy**: Whitelists configured production frontend origins.
3. **Tiered Rate Limiting**:
   - General API: 200 requests / 15 minutes
   - Authentication Endpoints: 20 requests / 15 minutes
   - AI Endpoints: 40 requests / 15 minutes
4. **Password Protection**: Salted bcrypt hashing with automatic exclusion from queries.
5. **NoSQL Injection Defense**: Strict type casting and input validation via `express-validator`.
6. **Role Guarding**: Backend authorization middleware enforces roles on every sensitive route.

---

## 🚢 Deployment Guide

### Frontend Deployment (Vercel / Netlify)
1. Set root directory to `client`.
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Set Environment Variable:
   ```ini
   VITE_API_BASE_URL=https://your-server-domain.com/api
   ```

### Backend Deployment (Render / Railway)
1. Set root directory to `server`.
2. Build Command: `npm install`
3. Start Command: `node src/server.js`
4. Configure Environment Variables:
   - `MONGO_URI` (from MongoDB Atlas)
   - `JWT_SECRET`
   - `GROQ_API_KEY`
   - `CLIENT_URL=https://your-frontend.vercel.app`
   - `NODE_ENV=production`

---

## 🛠 Running Locally

```bash
# Terminal 1: Backend
cd server
npm run dev

# Terminal 2: Frontend
cd client
npm run dev
```

Visit **`http://localhost:5173`** to access Farmer Market Connect!
#   f a r m e r - c o n n e c t  
 