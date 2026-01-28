"""
MobilshopurimiPOS - Multi-Tenant SaaS POS System
Main FastAPI Application Entry Point
"""
from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
import logging

# Import routers
from routers import auth, tenants, users, branches, products, stock, cashier, sales, reports, upload
from routers.settings import router as settings_router, warehouses_router, vat_router, templates_router
from routers.admin import router as admin_router, audit_router, categories_router, init_router

from database import db
from auth import hash_password

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(name)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)


async def init_super_admin():
    """Initialize or update super admin on startup"""
    try:
        new_username = "urimi1806"
        new_password = "1806"
        password_hash = hash_password(new_password)
        
        existing = await db.users.find_one({"role": "super_admin"})
        
        if existing:
            # Update existing super admin
            await db.users.update_one(
                {"role": "super_admin"},
                {"$set": {
                    "username": new_username,
                    "password_hash": password_hash,
                    "is_active": True
                }}
            )
            logger.info(f"Super Admin updated: {new_username}")
        else:
            # Create new super admin
            import uuid
            from datetime import datetime, timezone
            super_admin = {
                "id": str(uuid.uuid4()),
                "username": new_username,
                "password_hash": password_hash,
                "full_name": "Super Administrator",
                "role": "super_admin",
                "is_active": True,
                "tenant_id": None,
                "created_at": datetime.now(timezone.utc).isoformat()
            }
            await db.users.insert_one(super_admin)
            logger.info(f"Super Admin created: {new_username}")
    except Exception as e:
        logger.error(f"Error initializing super admin: {e}")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup/shutdown events"""
    # Startup
    logger.info("Starting MobilshopurimiPOS API...")
    await init_super_admin()
    yield
    # Shutdown
    logger.info("Shutting down MobilshopurimiPOS API...")


# Create the main app
app = FastAPI(
    title="MobilshopurimiPOS API",
    description="Multi-Tenant SaaS Point of Sale System",
    version="2.0.0",
    lifespan=lifespan
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


@app.get("/health")
async def health():
    """Health check endpoint for Kubernetes"""
    return {"status": "healthy"}


@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}
