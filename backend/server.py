from fastapi import FastAPI, APIRouter, HTTPException, Response
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime


ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")


# ===== Common helpers =====

def gen_id() -> str:
    return str(uuid.uuid4())


def clean(doc: Dict[str, Any]) -> Dict[str, Any]:
    if not doc:
        return doc
    doc.pop("_id", None)
    return doc


# ===== Models =====
class StatusCheck(BaseModel):
    id: str = Field(default_factory=gen_id)
    client_name: str
    timestamp: datetime = Field(default_factory=datetime.utcnow)

class StatusCheckCreate(BaseModel):
    client_name: str

# Products
class ProductBase(BaseModel):
    name: str
    category: str
    price: int
    commission: int
    active: bool = True
    url: str

class ProductCreate(ProductBase):
    pass

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    price: Optional[int] = None
    commission: Optional[int] = None
    active: Optional[bool] = None
    url: Optional[str] = None

class Product(ProductBase):
    id: str = Field(default_factory=gen_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Campaigns
class UTM(BaseModel):
    source: str
    medium: str
    campaign: str

class CampaignBase(BaseModel):
    name: str
    budget: int
    status: str
    start: str
    end: str
    utm: UTM

class CampaignCreate(CampaignBase):
    pass

class CampaignUpdate(BaseModel):
    name: Optional[str] = None
    budget: Optional[int] = None
    status: Optional[str] = None
    start: Optional[str] = None
    end: Optional[str] = None
    utm: Optional[UTM] = None

class Campaign(CampaignBase):
    id: str = Field(default_factory=gen_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Coupons
class CouponBase(BaseModel):
    code: str
    discount: int
    usage: int = 0
    active: bool = True

class CouponCreate(CouponBase):
    pass

class CouponUpdate(BaseModel):
    code: Optional[str] = None
    discount: Optional[int] = None
    usage: Optional[int] = None
    active: Optional[bool] = None

class Coupon(CouponBase):
    id: str = Field(default_factory=gen_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# UTM Links
class UTMLinkBase(BaseModel):
    title: str
    url: str

class UTMLinkCreate(UTMLinkBase):
    pass

class UTMLink(UTMLinkBase):
    id: str = Field(default_factory=gen_id)
    created_at: datetime = Field(default_factory=datetime.utcnow)

# Clicks
class ClickBase(BaseModel):
    productId: str
    ts: datetime
    source: str
    campaignId: Optional[str] = None

class ClickCreate(ClickBase):
    pass

class Click(ClickBase):
    id: str = Field(default_factory=gen_id)

# Metrics response
class Metrics(BaseModel):
    clicks: int
    conversions: int
    revenue: int
    ctr: float


# ===== Routes =====
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    await db.status_checks.insert_one(status_obj.dict())
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    status_checks = await db.status_checks.find().to_list(1000)
    return [StatusCheck(**clean(sc)) for sc in status_checks]

# Products CRUD
@api_router.get("/products", response_model=List[Product])
async def list_products():
    docs = await db.products.find().sort("created_at", -1).to_list(1000)
    return [Product(**clean(d)) for d in docs]

@api_router.post("/products", response_model=Product, status_code=201)
async def create_product(body: ProductCreate):
    obj = Product(**body.dict())
    await db.products.insert_one(obj.dict())
    return obj

@api_router.put("/products/{id}", response_model=Product)
async def update_product(id: str, body: ProductUpdate):
    upd = {k: v for k, v in body.dict().items() if v is not None}
    res = await db.products.find_one_and_update({"id": id}, {"$set": upd}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Product not found")
    doc = await db.products.find_one({"id": id})
    return Product(**clean(doc))

@api_router.delete("/products/{id}", status_code=204)
async def delete_product(id: str):
    res = await db.products.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Product not found")
    return Response(status_code=204)

# Campaigns CRUD
@api_router.get("/campaigns", response_model=List[Campaign])
async def list_campaigns():
    docs = await db.campaigns.find().sort("created_at", -1).to_list(1000)
    return [Campaign(**clean(d)) for d in docs]

@api_router.post("/campaigns", response_model=Campaign, status_code=201)
async def create_campaign(body: CampaignCreate):
    obj = Campaign(**body.dict())
    await db.campaigns.insert_one(obj.dict())
    return obj

@api_router.put("/campaigns/{id}", response_model=Campaign)
async def update_campaign(id: str, body: CampaignUpdate):
    upd = {k: (v.dict() if isinstance(v, BaseModel) else v) for k, v in body.dict().items() if v is not None}
    res = await db.campaigns.find_one_and_update({"id": id}, {"$set": upd}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Campaign not found")
    doc = await db.campaigns.find_one({"id": id})
    return Campaign(**clean(doc))

@api_router.delete("/campaigns/{id}", status_code=204)
async def delete_campaign(id: str):
    res = await db.campaigns.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Campaign not found")
    return Response(status_code=204)

# Coupons CRUD
@api_router.get("/coupons", response_model=List[Coupon])
async def list_coupons():
    docs = await db.coupons.find().sort("created_at", -1).to_list(1000)
    return [Coupon(**clean(d)) for d in docs]

@api_router.post("/coupons", response_model=Coupon, status_code=201)
async def create_coupon(body: CouponCreate):
    obj = Coupon(**body.dict())
    await db.coupons.insert_one(obj.dict())
    return obj

@api_router.put("/coupons/{id}", response_model=Coupon)
async def update_coupon(id: str, body: CouponUpdate):
    upd = {k: v for k, v in body.dict().items() if v is not None}
    res = await db.coupons.find_one_and_update({"id": id}, {"$set": upd}, return_document=True)
    if not res:
        raise HTTPException(status_code=404, detail="Coupon not found")
    doc = await db.coupons.find_one({"id": id})
    return Coupon(**clean(doc))

@api_router.delete("/coupons/{id}", status_code=204)
async def delete_coupon(id: str):
    res = await db.coupons.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Coupon not found")
    return Response(status_code=204)

# UTM Links
@api_router.get("/utm-links", response_model=List[UTMLink])
async def list_utm_links():
    docs = await db.utm_links.find().sort("created_at", -1).to_list(1000)
    return [UTMLink(**clean(d)) for d in docs]

@api_router.post("/utm-links", response_model=UTMLink, status_code=201)
async def create_utm_link(body: UTMLinkCreate):
    obj = UTMLink(**body.dict())
    await db.utm_links.insert_one(obj.dict())
    return obj

@api_router.delete("/utm-links/{id}", status_code=204)
async def delete_utm_link(id: str):
    res = await db.utm_links.delete_one({"id": id})
    if res.deleted_count == 0:
        raise HTTPException(status_code=404, detail="UTM link not found")
    return Response(status_code=204)

# Clicks
@api_router.get("/clicks", response_model=List[Click])
async def list_clicks(limit: int = 100):
    docs = await db.clicks.find().sort("ts", -1).to_list(limit)
    return [Click(**clean(d)) for d in docs]

@api_router.post("/clicks", response_model=Click, status_code=201)
async def create_click(body: ClickCreate):
    obj = Click(**body.dict())
    await db.clicks.insert_one(obj.dict())
    return obj

# Metrics (placeholder aggregation)
@api_router.get("/metrics", response_model=Metrics)
async def get_metrics():
    clicks = await db.clicks.count_documents({})
    # Placeholder simple heuristic for demo
    conversions = await db.clicks.count_documents({"source": {"$in": ["email", "ads"]}})
    revenue = conversions * 100000  # asumsi rata-rata
    ctr = round((conversions / clicks * 100) if clicks else 0.0, 2)
    return Metrics(clicks=clicks, conversions=conversions, revenue=revenue, ctr=ctr)

# Export CSV
@api_router.get("/export/csv")
async def export_csv():
    import io, csv
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(["type","id","name","category","price","commission","active"])  # products
    async for p in db.products.find():
        p = clean(p)
        writer.writerow(["product", p.get("id"), p.get("name"), p.get("category"), p.get("price"), p.get("commission"), p.get("active")])
    writer.writerow([])
    writer.writerow(["type","id","name","budget","status","start","end"])  # campaigns
    async for c in db.campaigns.find():
        c = clean(c)
        writer.writerow(["campaign", c.get("id"), c.get("name"), c.get("budget"), c.get("status"), c.get("start"), c.get("end")])
    csv_data = buf.getvalue()
    return Response(content=csv_data, media_type='text/csv', headers={"Content-Disposition": "attachment; filename=affipro_export.csv"})

# Include the router in the main app
app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()