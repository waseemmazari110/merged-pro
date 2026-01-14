#!/bin/bash

slugs=(
    "london" "lake-district" "brighton" "bath" "manchester" "bournemouth" "york" "cardiff"
    "newcastle" "liverpool" "newquay" "bristol" "cambridge" "oxford" "leeds" "nottingham"
    "sheffield" "exeter" "chester" "durham" "canterbury" "blackpool" "cotswolds" "margate"
    "harrogate" "st-ives" "windsor" "stratford-upon-avon" "plymouth" "cheltenham" "birmingham"
    "cornwall" "devon" "yorkshire" "norfolk" "suffolk" "sussex" "peak-district"
)

echo "| Slug | /destinations/{slug} Status | /locations/{slug} Status | Final Redirect Target |"
echo "| :--- | :--- | :--- | :--- |"

for slug in "${slugs[@]}"; do
    dest_url="http://localhost:3000/destinations/$slug"
    loc_url="http://localhost:3000/locations/$slug"
    
    # Check destination status
    dest_status=$(curl -s -o /dev/null -w "%{http_code}" "$dest_url")
    
    # Check location status and redirect target
    loc_info=$(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" "$loc_url")
    loc_status=$(echo $loc_info | awk '{print $1}')
    loc_target=$(echo $loc_info | awk '{print $2}')
    
    if [ -z "$loc_target" ]; then
        loc_target="N/A"
    fi
    
    echo "| $slug | $dest_status | $loc_status | $loc_target |"
done
