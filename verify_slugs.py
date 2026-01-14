import requests

slugs = [
    'london', 'lake-district', 'brighton', 'bath', 'manchester', 'bournemouth', 'york', 'cardiff',
    'newcastle', 'liverpool', 'newquay', 'bristol', 'cambridge', 'oxford', 'leeds', 'nottingham',
    'sheffield', 'exeter', 'chester', 'durham', 'canterbury', 'blackpool', 'cotswolds', 'margate',
    'harrogate', 'st-ives', 'windsor', 'stratford-upon-avon', 'plymouth', 'cheltenham', 'birmingham',
    'cornwall', 'devon', 'yorkshire', 'norfolk', 'suffolk', 'sussex', 'peak-district'
]

print("| Slug | /destinations/{slug} Status | /locations/{slug} Status | Final Redirect Target |")
print("| :--- | :--- | :--- | :--- |")

for slug in slugs:
    dest_url = f"http://localhost:3000/destinations/{slug}"
    loc_url = f"http://localhost:3000/locations/{slug}"
    
    try:
        dest_res = requests.get(dest_url, allow_redirects=False)
        dest_status = dest_res.status_code
    except Exception as e:
        dest_status = f"Error: {e}"
        
    try:
        loc_res = requests.get(loc_url, allow_redirects=False)
        loc_status = loc_res.status_code
        loc_target = loc_res.headers.get('Location', 'N/A')
    except Exception as e:
        loc_status = f"Error: {e}"
        loc_target = "N/A"
        
    print(f"| {slug} | {dest_status} | {loc_status} | {loc_target} |")
