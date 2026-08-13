import json
from datetime import date, timedelta
from sqlalchemy.orm import Session
from database import engine, Base, SessionLocal
import models
import random

# Create tables if they don't exist
models.Base.metadata.create_all(bind=engine)

def seed_database():
    db = SessionLocal()
    
    # Drop all and re-seed fresh
    models.Base.metadata.drop_all(bind=engine)
    models.Base.metadata.create_all(bind=engine)
    
    # Seed Users
    users_data = [
        {"name": "John Doe", "email": "john@example.com", "avatar_url": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80", "is_host": True, "is_superhost": True},
        {"name": "Jane Smith", "email": "jane@example.com", "avatar_url": "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80", "is_host": True, "is_superhost": True},
        {"name": "Arun (Guest)", "email": "arun.guest@example.com", "avatar_url": "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80", "is_host": False, "is_superhost": False},
    ]
    
    for u in users_data:
        db_user = models.UserDB(**u)
        db.add(db_user)
    db.commit()
    
    hosts = db.query(models.UserDB).filter(models.UserDB.is_host == True).all()
    guest = db.query(models.UserDB).filter(models.UserDB.is_host == False).first()

    # Rich listings across all categories with exact real Latitudes and Longitudes
    listings_data = [
        # --- ROOMS ---
        {
            "title": "Luxury Heritage Flat in Varanasi",
            "description": "Experience holy serenity overlooking the sacred Ganges in this peaceful sanctuary with heritage decor.",
            "property_type": "Rooms",
            "location": "Varanasi, Uttar Pradesh",
            "distance": "Ghats nearby · 1.2 km away",
            "dateRange": "Available Nov 1 - 6",
            "price_per_night": 3190.0,
            "price": "3,190",
            "rating": 4.95,
            "guestFavorite": True,
            "latitude": 25.3176,
            "longitude": 82.9739,
            "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1668996216152698055/original/6690a134-244b-402d-a2ec-cc86f2cba0b6.png?im_w=720",
            "images": json.dumps([
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1668996216152698055/original/6690a134-244b-402d-a2ec-cc86f2cba0b6.png?im_w=720",
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1712090595190060304/original/8d875a07-9a4c-4887-a40e-a01268b6ba67.jpeg?im_w=720",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["High-speed Wifi", "Air conditioning", "Kitchen", "Dedicated workspace", "Washer"])
        },
        {
            "title": "Sunlit Modern Flat in Bhelupura",
            "description": "Bright and spacious apartment situated in the heart of cultural neighborhoods with top cafes.",
            "property_type": "Rooms",
            "location": "Bhelupura, Varanasi",
            "distance": "City center · 3.5 km away",
            "dateRange": "Available Nov 10 - 15",
            "price_per_night": 4075.0,
            "price": "4,075",
            "rating": 5.0,
            "guestFavorite": True,
            "latitude": 25.2980,
            "longitude": 82.9930,
            "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1712090595190060304/original/8d875a07-9a4c-4887-a40e-a01268b6ba67.jpeg?im_w=720",
            "images": json.dumps([
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1712090595190060304/original/8d875a07-9a4c-4887-a40e-a01268b6ba67.jpeg?im_w=720",
                "https://a0.muscache.com/im/pictures/hosting/Hosting-1668996216152698055/original/6690a134-244b-402d-a2ec-cc86f2cba0b6.png?im_w=720"
            ]),
            "amenities": json.dumps(["Fast Wifi", "Kitchen", "Free parking on premises", "Balcony", "Elevator"])
        },
        {
            "title": "Riverside Silk Studio",
            "description": "Artisan studio room overlooking ancient weaver alleys and riverfront temple spires.",
            "property_type": "Rooms",
            "location": "Assi Ghat, Varanasi",
            "distance": "Riverside · 300m away",
            "dateRange": "Available Nov 18 - 24",
            "price_per_night": 2850.0,
            "price": "2,850",
            "rating": 4.91,
            "guestFavorite": False,
            "latitude": 25.2890,
            "longitude": 83.0060,
            "imageSrc": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Wifi", "Hot water", "Breakfast", "Air conditioning"])
        },

        # --- CASTLES ---
        {
            "title": "Royal Palace Heritage Suite",
            "description": "Step into royalty at this restored 18th-century Rajput palace with handcrafted jharokhas and courtyards.",
            "property_type": "Castles",
            "location": "Jaipur, Rajasthan",
            "distance": "Historic Old City · 4.1 km away",
            "dateRange": "Available Nov 25 - 30",
            "price_per_night": 12500.0,
            "price": "12,500",
            "rating": 4.99,
            "guestFavorite": True,
            "latitude": 26.9124,
            "longitude": 75.7873,
            "imageSrc": "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Breakfast included", "Swimming pool", "Spa access", "Air conditioning", "Concierge"])
        },
        {
            "title": "Udaipur Lakeview Fort Palace",
            "description": "Grand marble palace fortress overlooking Lake Pichola with private royal dining pavilions.",
            "property_type": "Castles",
            "location": "Udaipur, Rajasthan",
            "distance": "Lake Pichola · 1.5 km away",
            "dateRange": "Available Dec 2 - 8",
            "price_per_night": 18500.0,
            "price": "18,500",
            "rating": 5.0,
            "guestFavorite": True,
            "latitude": 24.5764,
            "longitude": 73.6800,
            "imageSrc": "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Lake view", "Royal Butler", "Private Boat", "Pool", "Wifi"])
        },
        {
            "title": "Sun City Heritage Citadel",
            "description": "Golden sandstone fortress estate with panoramic vistas of Mehrangarh Fort.",
            "property_type": "Castles",
            "location": "Jodhpur, Rajasthan",
            "distance": "Old Blue City · 2.8 km away",
            "dateRange": "Available Dec 10 - 15",
            "price_per_night": 14200.0,
            "price": "14,200",
            "rating": 4.96,
            "guestFavorite": True,
            "latitude": 26.2978,
            "longitude": 73.0185,
            "imageSrc": "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Fort view", "Swimming pool", "Breakfast", "Wifi"])
        },

        # --- AMAZING POOLS ---
        {
            "title": "Private Infinity Pool Villa",
            "description": "Wake up to breathtaking panoramic views from your private heated pool overlooking western hills.",
            "property_type": "Amazing pools",
            "location": "Lonavala, Maharashtra",
            "distance": "Mountain view · 85 km away",
            "dateRange": "Available Dec 2 - 7",
            "price_per_night": 9500.0,
            "price": "9,500",
            "rating": 4.98,
            "guestFavorite": True,
            "latitude": 18.7557,
            "longitude": 73.4091,
            "imageSrc": "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1580587771525-78b9dba3b914?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Private pool", "Wifi", "BBQ grill", "Mountain view", "Chef service available"])
        },
        {
            "title": "Cliffside Glass Pool Estate",
            "description": "A luxury 4-bedroom cliff villa featuring an all-glass edge infinity swimming pool.",
            "property_type": "Amazing pools",
            "location": "Khandala, Maharashtra",
            "distance": "Valley cliff · 92 km away",
            "dateRange": "Available Dec 14 - 19",
            "price_per_night": 13800.0,
            "price": "13,800",
            "rating": 4.97,
            "guestFavorite": True,
            "latitude": 18.7650,
            "longitude": 73.4150,
            "imageSrc": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Infinity pool", "Jacuzzi", "Valley view", "Fast Wifi", "Barbecue"])
        },

        # --- CABINS ---
        {
            "title": "Rustic Pine Woodland Cabin",
            "description": "Secluded cedar cabin surrounded by whispering deodar forests with a cozy stone fireplace.",
            "property_type": "Cabins",
            "location": "Manali, Himachal Pradesh",
            "distance": "Valley view · 240 km away",
            "dateRange": "Available Nov 15 - 20",
            "price_per_night": 4500.0,
            "price": "4,500",
            "rating": 4.92,
            "guestFavorite": True,
            "latitude": 32.2432,
            "longitude": 77.1892,
            "imageSrc": "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1449158743715-0a90ebb6d2d8?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Indoor fireplace", "Wifi", "Kitchen", "Free parking", "Heating"])
        },
        {
            "title": "Snow Peak Alpine Chalet",
            "description": "Nordic wooden chalet facing the snow-clad Pir Panjal range with heated timber floors.",
            "property_type": "Cabins",
            "location": "Solang Valley, Himachal Pradesh",
            "distance": "Snow peaks · 12 km from town",
            "dateRange": "Available Nov 28 - Dec 3",
            "price_per_night": 6200.0,
            "price": "6,200",
            "rating": 4.98,
            "guestFavorite": True,
            "latitude": 32.3160,
            "longitude": 77.1570,
            "imageSrc": "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1542718610-a1d656d1884c?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Wood stove", "Mountain view", "Wifi", "Kitchen", "Snow trekking"])
        },

        # --- EARTH HOMES ---
        {
            "title": "Eco Earth Home & Organic Orchard",
            "description": "Unique mud & stone passive solar home nestled amidst 5 acres of organic apple orchards.",
            "property_type": "Earth homes",
            "location": "Mukteshwar, Uttarakhand",
            "distance": "Himalayan range view · 290 km away",
            "dateRange": "Available Dec 5 - 10",
            "price_per_night": 5200.0,
            "price": "5,200",
            "rating": 4.94,
            "guestFavorite": False,
            "latitude": 29.4722,
            "longitude": 79.6478,
            "imageSrc": "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1518780664697-55e3ad937233?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Organic farm tour", "Wifi", "Kitchen", "Fire pit", "Pet friendly"])
        },
        {
            "title": "Himalayan Cob Dome Sanctuary",
            "description": "Curved earth dome structure built with river stones and clay with unobstructed valley sunrise views.",
            "property_type": "Earth homes",
            "location": "Kasauli, Himachal Pradesh",
            "distance": "Pine forest · 65 km away",
            "dateRange": "Available Dec 12 - 18",
            "price_per_night": 4800.0,
            "price": "4,800",
            "rating": 4.96,
            "guestFavorite": True,
            "latitude": 30.9013,
            "longitude": 76.9649,
            "imageSrc": "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Passive solar heating", "Wifi", "Kitchen", "Stargazing deck"])
        },

        # --- TROPICAL & BEACHFRONT ---
        {
            "title": "Beachfront Coconut Grove Villa",
            "description": "Direct private beach access with golden sands, outdoor showers, and tranquil ocean breezes.",
            "property_type": "Tropical",
            "location": "Goa, India",
            "distance": "Beachfront · 50 meters to sea",
            "dateRange": "Available Nov 18 - 23",
            "price_per_night": 8800.0,
            "price": "8,800",
            "rating": 4.96,
            "guestFavorite": True,
            "latitude": 15.4989,
            "longitude": 73.8278,
            "imageSrc": "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Beach access", "Private patio", "Fast Wifi", "Air conditioning", "Kitchen"])
        },
        {
            "title": "Anjuna Coastal Beach Haven",
            "description": "Boho luxury villa walking distance to Anjuna flea markets and sunset cliffs.",
            "property_type": "Beachfront",
            "location": "Anjuna, Goa",
            "distance": "Beachfront · 100m to sand",
            "dateRange": "Available Dec 1 - 6",
            "price_per_night": 7900.0,
            "price": "7,900",
            "rating": 4.93,
            "guestFavorite": True,
            "latitude": 15.5800,
            "longitude": 73.7400,
            "imageSrc": "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Beach access", "Plunge pool", "Wifi", "Air conditioning"])
        },

        # --- TREEHOUSES ---
        {
            "title": "Luxury Glass Treehouse Escape",
            "description": "Suspended 30 feet above the forest floor with 360-degree glass walls and a wraparound canopy deck.",
            "property_type": "Treehouses",
            "location": "Wayanad, Kerala",
            "distance": "Rainforest canopy · 15 km away",
            "dateRange": "Available Nov 22 - 27",
            "price_per_night": 7200.0,
            "price": "7,200",
            "rating": 4.97,
            "guestFavorite": True,
            "latitude": 11.6854,
            "longitude": 76.1320,
            "imageSrc": "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1488462237308-ecaa28b729d7?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Canopy deck", "Wifi", "Complimentary breakfast", "Hot water", "Trekking guide"])
        },
        {
            "title": "Munnar Tea Estate Canopy Lodge",
            "description": "Bespoke bamboo treehouse overlooking mist-covered emerald tea gardens in Munnar hills.",
            "property_type": "Treehouses",
            "location": "Munnar, Kerala",
            "distance": "Tea hills · 8 km away",
            "dateRange": "Available Dec 5 - 11",
            "price_per_night": 6800.0,
            "price": "6,800",
            "rating": 4.95,
            "guestFavorite": True,
            "latitude": 10.0889,
            "longitude": 77.0595,
            "imageSrc": "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Tea garden tour", "Breakfast", "Wifi", "Balcony"])
        },

        # --- MANSIONS ---
        {
            "title": "Grand Spanish Colonial Mansion",
            "description": "An opulent 8-bedroom sprawling estate featuring courtyards, fountain gardens, and a wine tasting cellar.",
            "property_type": "Mansions",
            "location": "Alibaug, Maharashtra",
            "distance": "Private estate · 45 km away",
            "dateRange": "Available Dec 12 - 17",
            "price_per_night": 28000.0,
            "price": "28,000",
            "rating": 5.0,
            "guestFavorite": True,
            "latitude": 18.6414,
            "longitude": 72.8722,
            "imageSrc": "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=80",
                "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Private chef", "Helipad access", "Swimming pool", "Billiards room", "Cinema"])
        },

        # --- FARMS ---
        {
            "title": "Punjab Heritage Farm Stay",
            "description": "Lush mustard fields, tractor rides, fresh organic dairy, and traditional tandoori dining under open stars.",
            "property_type": "Farms",
            "location": "Amritsar, Punjab",
            "distance": "Golden Temple · 18 km away",
            "dateRange": "Available Nov 15 - 20",
            "price_per_night": 3900.0,
            "price": "3,900",
            "rating": 4.95,
            "guestFavorite": True,
            "latitude": 31.6340,
            "longitude": 74.8723,
            "imageSrc": "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1500076656116-558758c991c1?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Organic food", "Tractor ride", "Bonfire", "Wifi", "Free parking"])
        },
        {
            "title": "Coorg Coffee Estate Farm",
            "description": "Colonial planter bungalow situated inside a 20-acre private arabica coffee and cardamom plantation.",
            "property_type": "Farms",
            "location": "Madikeri, Coorg",
            "distance": "Coffee plantation · 12 km from town",
            "dateRange": "Available Dec 8 - 14",
            "price_per_night": 5400.0,
            "price": "5,400",
            "rating": 4.98,
            "guestFavorite": True,
            "latitude": 12.3375,
            "longitude": 75.8069,
            "imageSrc": "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80",
            "images": json.dumps([
                "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1000&q=80"
            ]),
            "amenities": json.dumps(["Coffee tasting", "Nature walks", "Wifi", "Homemade meals"])
        }
    ]

    for index, l_data in enumerate(listings_data):
        host = hosts[index % len(hosts)]
        db_listing = models.ListingDB(**l_data, host_id=host.id)
        db.add(db_listing)
    db.commit()

    # Seed Sample Reviews and Bookings
    all_db_listings = db.query(models.ListingDB).all()
    
    review_comments = [
        "Unbelievable stay! The views and hospitality surpassed all expectations.",
        "Spotlessly clean, great host communication, and exactly as described in photos.",
        "Felt like a home away from home. The location is peaceful and convenient.",
        "One of the best Airbnb experiences we've ever had in India! Will definitely return."
    ]

    for l in all_db_listings:
        for _ in range(3):
            rev = models.ReviewDB(
                listing_id=l.id,
                user_id=guest.id,
                rating=round(random.uniform(4.8, 5.0), 2),
                comment=random.choice(review_comments),
                created_at=date.today() - timedelta(days=random.randint(2, 40))
            )
            db.add(rev)

    # Seed an existing booking for Guest User
    sample_booking = models.BookingDB(
        listing_id=all_db_listings[0].id,
        user_id=guest.id,
        check_in=date.today() + timedelta(days=5),
        check_out=date.today() + timedelta(days=8),
        guests=2,
        total_price=all_db_listings[0].price_per_night * 3
    )
    db.add(sample_booking)
    
    db.commit()
    print(f"Successfully seeded database with {len(all_db_listings)} listings across all categories, users, bookings, and reviews!")
    db.close()

if __name__ == "__main__":
    seed_database()
