import os, time, json
import requests

# Frontend uses REACT_APP_BACKEND_URL; for testing we assume ingress maps /api -> backend
BASE = os.environ.get("TEST_BACKEND_BASE", "http://localhost:8001/api")

def p(label, data):
    print(label, json.dumps(data, indent=2, default=str))

# Products CRUD
r = requests.post(f"{BASE}/products", json={
    "name":"Test Produk","category":"Test","price":10000,"commission":10,"active":True,"url":"https://x.com"
}, timeout=10)
r.raise_for_status(); prod = r.json(); p("create_product", prod)

pid = prod["id"]
r = requests.put(f"{BASE}/products/{pid}", json={"price":12345}, timeout=10)
r.raise_for_status(); p("update_product", r.json())

r = requests.get(f"{BASE}/products", timeout=10)
r.raise_for_status(); p("list_products", r.json()[:1])

# Campaigns
r = requests.post(f"{BASE}/campaigns", json={
    "name":"Camp Test","budget":50000,"status":"aktif","start":"2025-07-01","end":"2025-07-31",
    "utm":{"source":"seo","medium":"blog","campaign":"camp_test"}
}, timeout=10)
r.raise_for_status(); camp = r.json(); p("create_campaign", camp)

# Coupons
r = requests.post(f"{BASE}/coupons", json={"code":"NEW10","discount":10,"usage":0,"active":True}, timeout=10)
r.raise_for_status(); cp = r.json(); p("create_coupon", cp)

# UTM Link
r = requests.post(f"{BASE}/utm-links", json={"title":"Link Test","url":"https://site.com?a=1"}, timeout=10)
r.raise_for_status(); link = r.json(); p("create_utm_link", link)

# Clicks + metrics
r = requests.post(f"{BASE}/clicks", json={"productId": pid, "ts": time.strftime('%Y-%m-%dT%H:%M:%SZ'), "source":"email", "campaignId": camp["id"]}, timeout=10)
r.raise_for_status(); p("create_click", r.json())

r = requests.get(f"{BASE}/metrics", timeout=10)
r.raise_for_status(); p("metrics", r.json())

# Export CSV
r = requests.get(f"{BASE}/export/csv", timeout=10)
print("export_csv_status", r.status_code, len(r.text))

print("RESULT: BACKEND_TEST_OK")