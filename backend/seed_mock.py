from dotenv import load_dotenv
import os
from pathlib import Path
from pymongo import MongoClient
from datetime import datetime

ROOT = Path(__file__).parent
load_dotenv(ROOT / '.env')

client = MongoClient(os.environ['MONGO_URL'])
db = client[os.environ['DB_NAME']]

# Seed only if empty
if db.products.count_documents({}) == 0:
    db.products.insert_many([
        {"id":"p1","name":"Paket Hosting Turbo","category":"Hosting","price":99000,"commission":25,"active":True,"url":"https://merchant.com/hosting?ref=YOURID","created_at":datetime.utcnow()},
        {"id":"p2","name":"Theme Premium SEO","category":"Tema","price":350000,"commission":30,"active":True,"url":"https://merchant.com/theme?ref=YOURID","created_at":datetime.utcnow()},
        {"id":"p3","name":"Tool Riset Kata Kunci","category":"Tools","price":199000,"commission":20,"active":True,"url":"https://merchant.com/keyword?ref=YOURID","created_at":datetime.utcnow()},
        {"id":"p4","name":"Kursus SEO 30 Hari","category":"Kursus","price":499000,"commission":40,"active":True,"url":"https://merchant.com/seo-course?ref=YOURID","created_at":datetime.utcnow()},
        {"id":"p5","name":"Plugin Cache Pro","category":"Plugin","price":149000,"commission":22,"active":False,"url":"https://merchant.com/cache?ref=YOURID","created_at":datetime.utcnow()},
        {"id":"p6","name":"Email Marketing Starter","category":"Email","price":99000,"commission":18,"active":True,"url":"https://merchant.com/email?ref=YOURID","created_at":datetime.utcnow()},
    ])

if db.campaigns.count_documents({}) == 0:
    db.campaigns.insert_many([
        {"id":"c1","name":"Launching Juli","budget":3000000,"status":"aktif","start":"2025-07-01","end":"2025-07-31","utm":{"source":"newsletter","medium":"email","campaign":"launch_juli"},"created_at":datetime.utcnow()},
        {"id":"c2","name":"SEO Evergreen","budget":1500000,"status":"aktif","start":"2025-06-01","end":"2025-12-31","utm":{"source":"organic","medium":"seo","campaign":"evergreen"},"created_at":datetime.utcnow()},
        {"id":"c3","name":"Promo Lebaran","budget":5000000,"status":"selesai","start":"2025-04-01","end":"2025-04-20","utm":{"source":"ads","medium":"cpc","campaign":"lebaran"},"created_at":datetime.utcnow()},
    ])

if db.coupons.count_documents({}) == 0:
    db.coupons.insert_many([
        {"id":"cp1","code":"HEMAT20","discount":20,"usage":134,"active":True,"created_at":datetime.utcnow()},
        {"id":"cp2","code":"SEOBOOST15","discount":15,"usage":87,"active":True,"created_at":datetime.utcnow()},
        {"id":"cp3","code":"SUPER10","discount":10,"usage":212,"active":False,"created_at":datetime.utcnow()},
    ])

if db.clicks.count_documents({}) == 0:
    now = datetime.utcnow().isoformat()+'Z'
    db.clicks.insert_many([
        {"id":"cl1","productId":"p1","ts":now,"source":"seo","campaignId":"c2"},
        {"id":"cl2","productId":"p2","ts":now,"source":"email","campaignId":"c1"},
        {"id":"cl3","productId":"p3","ts":now,"source":"ads","campaignId":"c3"},
    ])

if db.utm_links.count_documents({}) == 0:
    db.utm_links.insert_one({"id":"u1","title":"Link Blog - Hosting","url":"https://yourblog.com/hosting?utm_source=seo&utm_medium=blog&utm_campaign=evergreen","created_at":datetime.utcnow()})

print("SEED_OK")