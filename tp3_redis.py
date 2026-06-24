import redis
import time
import json

r = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

# PARTIE 1 — STRUCTURES DE BASE

r.set("session:abc123", '{"user_id":42}', ex=1800)
r.hset("user:42", mapping={"nom": "Dupont", "email": "d@mail.fr", "ville": "Paris"})

r.set("pageviews:accueil", 0)
for _ in range(100):
    r.incr("pageviews:accueil")

r.zadd("scores", {"alice": 1500, "bob": 1200, "charlie": 1800})
print("Top 2:", r.zrevrange("scores", 0, 1, withscores=True))

# PARTIE 2 — CACHE-ASIDE

fake_db = {
    "PRD-001": {"sku": "PRD-001", "nom": "Casque Bluetooth", "prix": 79.99}
}

def mongo_get(sku):
    time.sleep(0.01)
    return fake_db.get(sku)

def get_product(sku):
    key = f"product:{sku}"
    cached = r.get(key)
    if cached:
        return json.loads(cached)
    data = mongo_get(sku)
    if data:
        r.set(key, json.dumps(data), ex=300)
    return data

def update_product(sku, data):
    fake_db.get(sku, {}).update(data)
    r.delete(f"product:{sku}")

r.delete("product:PRD-001")

t0 = time.time()
get_product("PRD-001")
print(f"Cache Miss : {(time.time()-t0)*1000:.2f} ms")

t0 = time.time()
for _ in range(1000):
    get_product("PRD-001")
print(f"1000x Cache Hit : {(time.time()-t0)*1000:.2f} ms")

# PARTIE 3 — RATE LIMITING

def check_rate_limit(ip):
    key = f"ratelimit:{ip}"
    count = r.incr(key)
    if count == 1:
        r.expire(key, 60)
    return count <= 10

ip = "192.168.1.1"
r.delete(f"ratelimit:{ip}")

for i in range(1, 13):
    status = "Acceptée" if check_rate_limit(ip) else "Rejetée"
    print(f"Requête {i:2d} : {status}")
