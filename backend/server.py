"""
MobilshopurimiPOS - Multi-Tenant SaaS POS System
Main FastAPI Application Entry Point
"""
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
import logging

# Import routers
from routers import auth, tenants, users, branches, products, stock, cashier, sales, reports
from routers.settings import router as settings_router, warehouses_router, vat_router, templates_router
from routers.admin import router as admin_router, audit_router, categories_router, init_router

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

# Create the main app
app = FastAPI(
    title="MobilshopurimiPOS API",
    description="Multi-Tenant SaaS Point of Sale System",
    version="2.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers with /api prefix
app.include_router(auth.router, prefix="/api")
app.include_router(tenants.router, prefix="/api")
app.include_router(users.router, prefix="/api")
app.include_router(branches.router, prefix="/api")
app.include_router(products.router, prefix="/api")
app.include_router(stock.router, prefix="/api")
app.include_router(cashier.router, prefix="/api")
app.include_router(sales.router, prefix="/api")
app.include_router(reports.router, prefix="/api")
app.include_router(settings_router, prefix="/api")
app.include_router(warehouses_router, prefix="/api")
app.include_router(vat_router, prefix="/api")
app.include_router(templates_router, prefix="/api")
app.include_router(admin_router, prefix="/api")
app.include_router(audit_router, prefix="/api")
app.include_router(categories_router, prefix="/api")
app.include_router(init_router, prefix="/api")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "name": "MobilshopurimiPOS API",
        "version": "2.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
