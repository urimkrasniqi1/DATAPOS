# DataPOS - Multi-Tenant SaaS POS System

## Problem Statement
A modern, multi-tenant Point of Sale (POS) system for businesses in Kosovo. Features include:
- Multi-tenant architecture with subdomain support
- Cashier PIN login and Admin username/password login
- Product management, sales, inventory tracking
- Reporting and analytics
- Desktop application (Electron) support

## User Personas
- **Super Admin**: Manages all tenants, subscriptions, and system-wide settings
- **Tenant Admin**: Manages their company's products, users, branches, settings
- **Cashier**: Uses POS interface for sales

## Core Requirements
1. ✅ Multi-tenant support with subdomain routing
2. ✅ PIN-based login for cashiers
3. ✅ Admin authentication with username/password
4. ✅ Product management with barcode support
5. ✅ Sales processing with multiple payment methods
6. ✅ Inventory/stock management
7. ✅ Reporting dashboard
8. ✅ Receipt printing
9. ✅ Responsive design
10. ✅ Self-registration with 30-day trial
11. ✅ Subscription pricing display

## What's Been Implemented

### January 29, 2026
- ✅ Created public registration endpoint (`/api/register`)
- ✅ Created Registration page (`/register`) with professional design
- ✅ Updated LandingDashboard with pricing section
  - Special offer: 230€ → 150€/year (Save 80€)
  - Monthly plans: 1 month (20€), 3 months (60€), 6 months (120€), 12 months (150€)
- ✅ Added trial banner to Dashboard showing remaining days
- ✅ Fixed manifest.json start_url (/ instead of /login)
- ✅ Reverted Login.jsx to original white theme design
- ✅ Added trial status endpoint (`/api/trial-status/{tenant_id}`)

### Previous Sessions
- ✅ Landing Dashboard with professional dark theme
- ✅ Electron desktop app configuration
- ✅ Responsive POS layout
- ✅ WhatsApp QR code generation (backend ready, not displayed)
- ✅ Multi-branch support
- ✅ User management per tenant
- ✅ Settings management
- ✅ Audit logging

## Architecture

### Backend (FastAPI)
```
/app/backend/
├── server.py           # Main FastAPI app
├── database.py         # MongoDB connection
├── auth.py             # Authentication utilities
├── models.py           # Pydantic models
└── routers/
    ├── auth.py         # Login/logout
    ├── registration.py # Public registration (NEW)
    ├── tenants.py      # Tenant management
    ├── users.py        # User management
    ├── products.py     # Product CRUD
    ├── sales.py        # Sales processing
    ├── reports.py      # Reporting endpoints
    └── ...
```

### Frontend (React)
```
/app/frontend/src/
├── App.js              # Main routing
├── pages/
│   ├── LandingDashboard.jsx  # Landing page with pricing
│   ├── Register.jsx          # Self-registration (NEW)
│   ├── Login.jsx             # PIN/Admin login
│   ├── Dashboard.jsx         # Admin dashboard with trial banner
│   ├── POS.jsx               # Point of sale interface
│   ├── SuperAdmin.jsx        # Super admin panel
│   └── ...
└── components/
    └── ui/             # Shadcn UI components
```

### Database Schema (MongoDB)
- **tenants**: Company information, trial/subscription status
- **users**: Admin, manager, cashier accounts
- **products**: Product catalog per tenant
- **sales**: Transaction records
- **branches**: Multi-branch support
- **settings**: Per-tenant configuration

## Subscription Plans
| Plan | Price | Per Month |
|------|-------|-----------|
| 1 Month | 20€ | 20€ |
| 3 Months | 60€ | 20€ |
| 6 Months | 120€ | 20€ |
| 12 Months | 150€ | 12.5€ |

## Prioritized Backlog

### P0 (Critical)
- None currently

### P1 (High Priority)
- [ ] Stripe integration for automatic subscription payments
- [ ] Download page for desktop app
- [ ] Email notifications for trial expiration

### P2 (Medium Priority)
- [ ] Silent printing verification (Electron)
- [ ] Customer management
- [ ] Subdomain DNS verification guide
- [ ] Electron build script improvements

### P3 (Low Priority)
- [ ] Full application dark theme redesign (user requested but reverted)
- [ ] POS.jsx refactoring (technical debt)

## Credentials
- **Super Admin**: urimi1806 / 1806
- **Test Registration**: test@test.com / test123

## Tech Stack
- **Backend**: FastAPI, MongoDB, Python 3.11
- **Frontend**: React 19, Tailwind CSS, Shadcn/UI
- **Desktop**: Electron 28
- **Deployment**: Kubernetes (Emergent Platform)
