# t3next POS System - Product Requirements Document

## Original Problem Statement
Sistema POS (Point of Sale) për markete dhe supermarkete me mbështetje multi-filiale. Ndërfaqe në gjuhën shqipe.

## User Personas
1. **Administrator** - Menaxhon sistemin, përdoruesit, degët, raportet
2. **Menaxher** - Menaxhon produktet, stokun, sheh raporte
3. **Arkëtar** - Kryen shitje, hap/mbyll arkën

## Core Requirements (Static)
- Autentifikim JWT me role-based access control
- Regjistrimi i produkteve me të gjitha fushat OPSIONALE përveç ID
- Menaxhimi i stokut me histori lëvizjesh (IN/OUT)
- Sesione arke (cash drawer)
- Transaksione shitjesh
- Raportim me eksport PDF/Excel
- Mbështetje multi-filiale

## What's Been Implemented (December 2025)

### Backend (FastAPI + MongoDB)
- [x] Auth: JWT login, role-based access (admin, manager, cashier)
- [x] Users CRUD with role management
- [x] Branches CRUD for multi-filial support
- [x] Products CRUD with ALL optional fields except ID
- [x] Stock management with movement history
- [x] Cash drawer sessions (open, transaction, close)
- [x] Sales transactions with stock validation
- [x] Reports: dashboard, sales, stock, cashier performance
- [x] PDF/Excel export
- [x] Audit logging for all actions

### Frontend (React + Shadcn UI)
- [x] Login page with t3next branding (red #E53935)
- [x] Dashboard with KPIs, charts, quick actions
- [x] POS/Checkout page per user design
- [x] Products management page
- [x] Stock management with movements
- [x] Users management
- [x] Branches management
- [x] Reports with date filters
- [x] Settings page
- [x] Audit logs page
- [x] Albanian language interface

### Design Implementation
- [x] t3next branding (red #E53935, teal #00B9D7)
- [x] User-provided designs for Login, Checkout, Payment modal
- [x] Sidebar navigation
- [x] Responsive design

## Prioritized Backlog

### P0 (Critical) - DONE
- Auth system ✓
- Product management ✓
- POS/Sales ✓
- Stock management ✓

### P1 (High)
- [ ] Receipt printing integration
- [ ] Barcode scanner hardware integration
- [ ] Real-time stock alerts

### P2 (Medium)
- [ ] OpenAI GPT integration for analytics
- [ ] Advanced reporting dashboards
- [ ] Multi-currency support
- [ ] Customer loyalty program

### P3 (Nice to Have)
- [ ] Mobile app
- [ ] E-commerce integration
- [ ] Supplier management

## API Endpoints
- POST /api/auth/login
- GET /api/auth/me
- CRUD /api/users, /api/branches, /api/products
- GET/POST /api/stock/movements
- POST /api/cashier/open, /api/cashier/close
- POST /api/sales
- GET /api/reports/dashboard, /api/reports/sales, /api/reports/stock
- GET /api/reports/export/pdf, /api/reports/export/excel
- GET /api/audit-logs

## Demo Credentials
- Email: admin@t3next.com
- Password: admin123
