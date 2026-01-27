"""Sales routes"""
from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from datetime import datetime, timezone

from database import db
from models import (
    SaleCreate, SaleResponse, Sale, SaleItem,
    StockMovement, StockMovementType,
    CashDrawerStatus, PaymentMethod, UserRole
)
from auth import get_current_user, get_tenant_filter, add_tenant_id, log_audit

router = APIRouter(prefix="/sales", tags=["Sales"])


async def generate_receipt_number(branch_id: str = None, tenant_id: str = None) -> str:
    """Generate a unique receipt number"""
    today = datetime.now(timezone.utc).strftime("%Y%m%d")
    prefix = f"RCP-{today}"
    query = {"receipt_number": {"$regex": f"^{prefix}"}}
    if tenant_id:
        query["tenant_id"] = tenant_id
    count = await db.sales.count_documents(query)
    return f"{prefix}-{str(count + 1).zfill(4)}"


@router.post("", response_model=SaleResponse)
async def create_sale(sale_data: SaleCreate, current_user: dict = Depends(get_current_user)):
    """Create a new sale"""
    tenant_filter = get_tenant_filter(current_user)
    
    drawer = await db.cash_drawers.find_one({
        "user_id": current_user["id"],
        "status": CashDrawerStatus.OPEN.value,
        **tenant_filter
    }, {"_id": 0})
    
    items = []
    subtotal = 0
    total_discount = 0
    total_vat = 0
    
    for item_data in sale_data.items:
        product = await db.products.find_one({"id": item_data.product_id, **tenant_filter}, {"_id": 0})
        if not product:
            raise HTTPException(status_code=404, detail=f"Produkti {item_data.product_id} nuk u gjet")
        
        item_subtotal = item_data.quantity * item_data.unit_price
        item_discount = item_subtotal * (item_data.discount_percent / 100)
        item_after_discount = item_subtotal - item_discount
        item_vat = item_after_discount * (item_data.vat_percent / 100)
        item_total = item_after_discount + item_vat
        
        items.append(SaleItem(
            product_id=item_data.product_id,
            product_name=product.get("name"),
            quantity=item_data.quantity,
            unit_price=item_data.unit_price,
            discount_percent=item_data.discount_percent,
            vat_percent=item_data.vat_percent,
            subtotal=item_subtotal,
            vat_amount=item_vat,
            total=item_total
        ))
        
        subtotal += item_subtotal
        total_discount += item_discount
        total_vat += item_vat
        
        new_stock = product.get("current_stock", 0) - item_data.quantity
        await db.products.update_one(
            {"id": item_data.product_id, **tenant_filter},
            {"$set": {"current_stock": new_stock, "updated_at": datetime.now(timezone.utc).isoformat()}}
        )
        
        movement = StockMovement(
            product_id=item_data.product_id,
            quantity=item_data.quantity,
            movement_type=StockMovementType.SALE,
            reason="Shitje",
            user_id=current_user["id"],
            branch_id=current_user.get("branch_id")
        )
        mov_doc = movement.model_dump()
        mov_doc['created_at'] = mov_doc['created_at'].isoformat()
        mov_doc = add_tenant_id(mov_doc, current_user)
        await db.stock_movements.insert_one(mov_doc)
    
    grand_total = subtotal - total_discount + total_vat
    change_amount = (sale_data.cash_amount or 0) - grand_total if sale_data.payment_method == PaymentMethod.CASH else 0
    
    receipt_number = await generate_receipt_number(current_user.get("branch_id"), current_user.get("tenant_id"))
    
    sale = Sale(
        receipt_number=receipt_number,
        items=[item.model_dump() for item in items],
        subtotal=round(subtotal, 2),
        total_discount=round(total_discount, 2),
        total_vat=round(total_vat, 2),
        grand_total=round(grand_total, 2),
        payment_method=sale_data.payment_method,
        cash_amount=sale_data.cash_amount or 0,
        bank_amount=sale_data.bank_amount or 0,
        change_amount=round(max(0, change_amount), 2),
        customer_name=sale_data.customer_name,
        notes=sale_data.notes,
        user_id=current_user["id"],
        branch_id=current_user.get("branch_id"),
        cash_drawer_id=drawer["id"] if drawer else None
    )
    
    doc = sale.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc = add_tenant_id(doc, current_user)
    await db.sales.insert_one(doc)
    
    if drawer and sale_data.cash_amount:
        new_expected = drawer["expected_balance"] + sale_data.cash_amount - change_amount
        await db.cash_drawers.update_one(
            {"id": drawer["id"], **tenant_filter},
            {"$set": {"expected_balance": new_expected}}
        )
    
    await log_audit(current_user["id"], "create_sale", "sale", sale.id, {"total": grand_total})
    return SaleResponse(**doc)


@router.get("", response_model=List[SaleResponse])
async def get_sales(
    branch_id: Optional[str] = None,
    user_id: Optional[str] = None,
    start_date: Optional[str] = None,
    end_date: Optional[str] = None,
    limit: int = 100,
    current_user: dict = Depends(get_current_user)
):
    """Get sales"""
    query = get_tenant_filter(current_user)
    if branch_id:
        query["branch_id"] = branch_id
    if user_id:
        query["user_id"] = user_id
    if start_date:
        query["created_at"] = {"$gte": start_date}
    if end_date:
        query.setdefault("created_at", {})["$lte"] = end_date
    
    sales = await db.sales.find(query, {"_id": 0}).sort("created_at", -1).to_list(limit)
    return [SaleResponse(**s) for s in sales]


@router.get("/{sale_id}", response_model=SaleResponse)
async def get_sale(sale_id: str, current_user: dict = Depends(get_current_user)):
    """Get a sale by ID"""
    query = {"id": sale_id, **get_tenant_filter(current_user)}
    sale = await db.sales.find_one(query, {"_id": 0})
    if not sale:
        raise HTTPException(status_code=404, detail="Shitja nuk u gjet")
    return SaleResponse(**sale)
