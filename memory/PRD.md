# Mobilshopurimi POS System - Product Requirements Document

## Original Problem Statement
Sistema POS (Point of Sale) për markete dhe supermarkete me mbështetje multi-filiale. Ndërfaqe në gjuhën shqipe. Aplikacioni desktop (.exe) me Electron.

## User Personas
1. **Administrator** - Menaxhon sistemin, përdoruesit, degët, raportet
2. **Menaxher** - Menaxhon produktet, stokun, sheh raporte
3. **Arkëtar** - Kryen shitje, hap/mbyll arkën

## Core Requirements (Static)
- Autentifikim JWT me role-based access control (username/password)
- Regjistrimi i produkteve me të gjitha fushat OPSIONALE përveç ID
- Menaxhimi i stokut me histori lëvizjesh (IN/OUT)
- Sesione arke (cash drawer)
- Transaksione shitjesh
- Raportim me eksport PDF/Excel
- Mbështetje multi-filiale
- Printimi termal dhe A4

## What's Been Implemented (January 2025)

### Backend (FastAPI + MongoDB)
- [x] Auth: JWT login with username (not email), role-based access
- [x] Users CRUD with role management
- [x] Branches CRUD for multi-filial support
- [x] Products CRUD with ALL optional fields except ID
- [x] Stock management with movement history
- [x] Cash drawer sessions (open, transaction, close)
- [x] Sales transactions (allows out-of-stock sales)
- [x] Reports: dashboard, sales, profit/loss, stock, cashier performance
- [x] PDF/Excel export
- [x] Audit logging for all actions
- [x] Settings API: Company info, POS settings, Warehouses, VAT rates

### Frontend (React + Shadcn UI)
- [x] Login page with Mobilshopurimi branding (cream/dark-blue theme)
- [x] Dashboard with KPIs, charts, quick actions
- [x] POS/Checkout page with thermal receipt printing
- [x] Products management page
- [x] Stock management with movements
- [x] Users management
- [x] Branches management
- [x] Reports with date filters and charts
- [x] Settings page - FULLY FUNCTIONAL (Company, POS, Warehouses, VAT)
- [x] Audit logs page
- [x] Albanian language interface
- [x] PWA support for fullscreen mode

### Receipt Printing Features (January 2025)
- [x] **Professional FISCAL-style thermal receipt design (80mm wide)** - UPDATED
- [x] Company logo on receipt
- [x] Comment templates for receipt
- [x] Saved default comment feature
- [x] **Direct print toggle (pa parapamje)**
- [x] iframe-based reliable printing mechanism
- [x] A4 Invoice printing with buyer info form
- [x] **QR Code for contact (WhatsApp, Viber, Thirrje)** - NEW

### Design & UX
- [x] iPOS rebranding (teal #00a79d)
- [x] Keyboard shortcut labels on POS buttons (F2, F4, F6, F12, Del)
- [x] PIN-based login for cashiers + Admin login form
- [x] Responsive design
- [x] Courier/monospace font for fiscal receipt look
- [x] Thermal receipt with tear-off section for cashier

## Prioritized Backlog

### P0 (Critical) - DONE
- Auth system ✓
- Product management ✓
- POS/Sales ✓
- Stock management ✓
- Cashier workflow ✓
- Invoice A4 printing ✓
- Settings backend ✓
- Direct print toggle ✓
- Professional fiscal receipt ✓
- QR code contact ✓
- Keyboard shortcuts for POS (F1, F2, F4, F6, F9, F10, F12, Ctrl+1/*/+/-, Delete) ✓
- Visual shortcut labels on buttons (F2, F4, F6, F12, Del) ✓

### P1 (High) - REFACTORING NEEDED
- [ ] Refactor backend/server.py into modular APIRouter structure
- [ ] Refactor frontend/src/pages/POS.jsx into smaller components/hooks
- [ ] User-customizable comment templates in Settings

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

## Latest Updates (January 27, 2025 - Session 2)
- **Keyboard Shortcuts për POS Screen** (të gjitha funksionale):
  - F1 - Shfaq ndihmën me listën e shkurtoreve
  - F2 - Hap dritaren e pagesës (Shtyp & Përfundo)
  - F4 - Hap preview faturën A4
  - F6 - Hap dialogun "Dokumentet e Fundit"
  - F9 - Hap dritaren e pagesës (alternativë)
  - F10 - Pagesë direkte me kartë/bank
  - F12 - Hap dialogun "Kërko Artikullin"
  - Ctrl+1 - Zgjidh artikullin e parë në shportë
  - Ctrl+* - Ndrysho çmimin e artikullit të zgjedhur
  - Ctrl++ - Shto sasinë
  - Ctrl+- - Zbrit sasinë
  - Delete - Fshij artikullin e zgjedhur
- **Etiketa vizuale në butona**: F6, F12, Del, F4, F2
- Rregulluar bug: setShowA4Invoice → setShowInvoiceA4
- **Logo iPOS e përditësuar** në kupona termike dhe A4

- **Funksionaliteti i Resetimit të të Dhënave** (Admin only):
  - Reseto Ditën (0) - Fshin shitjet dhe arkat e sotme
  - Reseto Përdorues - Fshin të dhënat e përdoruesve të zgjedhur
  - Reseto Të Gjitha - Fshin të gjitha shitjet, arkat dhe lëvizjet e stokut
  - Dialog 3-hapa: Verifikim fjalëkalimi → Zgjedhja e përdoruesve → Konfirmim
  - Backend endpoints: /api/admin/verify-password, /api/admin/users-for-reset, /api/admin/reset-data

- **Sistem Backup Automatik**:
  - Backup automatik para çdo resetimi
  - Dialog "Backup-et e Ruajtura" për të parë të gjitha backup-et
  - Rikthim (restore) i backup-eve me verifikim fjalëkalimi
  - Fshirje e backup-eve të vjetra
  - Backend endpoints: /api/admin/backups, /api/admin/backups/{id}/restore

- **True Silent Printing (Electron)**:
  - Integrim me Electron IPC për printim pa dialog
  - Preload.js për expozimin e API-ve të printimit
  - Fallback në browser print kur nuk është Electron
  - Detektim automatik nëse po ekzekutohet në Electron

## Previous Updates (January 27, 2025)
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
