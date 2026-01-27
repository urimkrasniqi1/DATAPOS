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

## What's Been Implemented (January 2025)

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
- [x] Settings page (UI only)
- [x] Audit logs page
- [x] Albanian language interface

### Cashier Workflow (NEW - January 2025)
- [x] Cashier redirects directly to /pos on login
- [x] After closing drawer, shows "Hap Arkën" and "Çkyçu" buttons
- [x] Fullscreen POS interface for cashier role

### Invoice A4 Printing (NEW - January 2025)
- [x] A4 Invoice component with company info, items, totals
- [x] "Printo A4" button in POS sidebar
- [x] View and print recent sales from Documents dialog
- [x] Print preview with print functionality

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
- Cashier workflow ✓
- Invoice A4 printing ✓

### P1 (High)
- [ ] Settings page backend implementation
- [ ] Real-time stock alerts
- [ ] Thermal receipt printer integration

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
- GET /api/sales/{sale_id}
- GET /api/reports/dashboard, /api/reports/sales, /api/reports/stock
- GET /api/reports/export/pdf, /api/reports/export/excel
- GET /api/audit-logs

## Demo Credentials
- Admin: admin / admin123
- Cashier: arketar / arketar123

## Code Architecture
```
/app
├── backend/
│   └── server.py         # FastAPI app with all routes, models, and logic
├── frontend/
│   └── src/
│       ├── App.js        # Main component with routing and Auth provider
│       ├── components/
│       │   ├── MainLayout.jsx # Sidebar layout for admin/manager
│       │   └── InvoiceA4.jsx  # A4 Invoice printing component
│       └── pages/
│           ├── Login.jsx
│           ├── Dashboard.jsx
│           ├── POS.jsx       # Core POS logic with A4 printing
│           ├── Products.jsx
│           ├── Stock.jsx
│           ├── Users.jsx
│           ├── Branches.jsx
│           ├── Reports.jsx
│           ├── Settings.jsx
│           └── AuditLogs.jsx
└── memory/
    └── PRD.md
```

## Latest Updates (January 27, 2025)
- Rregulluar printimi i kuponit termik dhe faturës A4 duke përdorur iframe të fshehur në vend të window.open()
- Metoda e re e printimit nuk bllokohet nga popup blockers
- Shtuar mesazhe të sakta gabimi dhe suksesi gjatë printimit
- Kupon fiskal-style me logo, dimensione 110mm x 140mm
- Template komentesh (Garanci 12 muaj, Pa kthim, Zbritje speciale, etj.)
- Mundësi për të ruajtur komentin si default
- **Backend për Settings page**:
  - GET/PUT /api/settings/pos - Cilësimet e POS
  - CRUD /api/warehouses - Menaxhimi i depove
  - CRUD /api/vat-rates - Normat e TVSH (3 default: 18%, 8%, 0%)
- **Frontend Settings tabs funksionale**: DEPOT, TVSH me dialog add/edit
- **Raporti i Fitimit/Humbjes (Profit/Loss)**:
  - Backend: GET /api/reports/profit-loss
  - Frontend: Tab "Fitimi" me grafik dhe tabelë ditore
  - Tregon: Të ardhura, Kosto, Fitimi Bruto, Marzhi i Fitimit, TVSH, Fitimi Neto
- **Faqja e Raporteve plotësisht funksionale**:
  - Tab Shitjet: Trendi ditor, grafik linear, tabelë
  - Tab Fitimi: Të ardhura vs Kosto vs Fitim, grafik bar
  - Tab Stoku: Produkte me stok të ulët/pa stok
  - Tab Performanca: Renditja e arkëtarëve sipas shitjeve
  - Eksportimi PDF dhe Excel funksionon

## Previous Updates (January 26, 2025)
- Shtuar tekst informues për zgjedhjen e printerit në dialogun e kuponit termik
- Shtuar tekst informues për zgjedhjen e printerit në dialogun e faturës A4
- Shtuar banner informues në Settings > SHABLLONET E FATURAVE për udhëzime printimi
- Përdoruesit tani informohen se mund të zgjedhin printerin nga dialogu standard i browser-it

## Previous Updates (January 25, 2025)
- Fixed cashier redirect to /pos on login
- Added "Hap Arkën" and "Çkyçu" buttons after drawer close
- Created InvoiceA4 component for A4 invoice printing
- Added "Printo A4" button to POS sidebar
- Added ability to print recent sales from Documents dialog
- Username-based authentication (migrated from email)
- Desktop App Setup with Electron
- Rebranding to "Mobilshopurimi"
- Thermal receipt (80mm) implementation
- Out-of-stock sales enabled
- Company settings backend (GET/PUT /api/settings/company)
