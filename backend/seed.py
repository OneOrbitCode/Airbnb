import logging
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

MOCK_LISTINGS = [
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1726967218722300135/original/efaa58e3-5c47-449b-8513-b903e03288d2.png?im_w=720",
    "location": "Puducherry, India",
    "distance": "1,234 kilometers away",
    "dateRange": "Oct 15 - 20",
    "price": "4,899",
    "rating": 5.0,
    "guestFavorite": True,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-979349165403113668/original/1273f626-0f45-4e56-bc51-b3cbe887b970.png?im_w=720",
    "location": "Puducherry, India",
    "distance": "Beach and ocean views",
    "dateRange": "Nov 2 - 7",
    "price": "11,431",
    "rating": 4.86,
    "guestFavorite": True,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1521928536703773082/original/d60a8b44-c32a-4560-876d-f33a7dd06029.jpeg?im_w=720",
    "location": "Puducherry, India",
    "distance": "2 kilometers away",
    "dateRange": "Dec 1 - 5",
    "price": "4,247",
    "rating": 4.86,
    "guestFavorite": False,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1488409011195823542/original/1b2923fb-32f4-4665-8a55-0bf416a68116.jpeg?im_w=720",
    "location": "Puducherry, India",
    "distance": "Designed by renowned architect",
    "dateRange": "Jan 10 - 15",
    "price": "5,129",
    "rating": 4.92,
    "guestFavorite": True,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1740676245981804536/original/6ce30cbd-e641-40f2-be70-2aba57bd394c.jpeg?im_w=720",
    "location": "Puducherry, India",
    "distance": "Pool with a view",
    "dateRange": "Feb 5 - 10",
    "price": "7,735",
    "rating": 5.0,
    "guestFavorite": False,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/miso/Hosting-1094771440597889199/original/396e39d5-12b4-4442-ae8b-3c09940b693b.jpeg?im_w=720",
    "location": "Kottaikuppam, India",
    "distance": "Near Auroville beach",
    "dateRange": "Mar 12 - 18",
    "price": "7,811",
    "rating": 4.86,
    "guestFavorite": True,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/hosting/Hosting-1711443031025343915/original/5fb14498-9c7a-46d0-8537-b7efc00d326f.jpeg?im_w=720",
    "location": "Puducherry, India",
    "distance": "French quarter heritage",
    "dateRange": "Apr 2 - 8",
    "price": "7,417",
    "rating": 4.88,
    "guestFavorite": False,
  },
  {
    "imageSrc": "https://a0.muscache.com/im/pictures/miso/Hosting-1391798296611221576/original/d2e616f6-c9e1-4418-b9ba-7d54220d18d0.jpeg?im_w=720",
    "location": "Puducherry, India",
    "distance": "Entire villa",
    "dateRange": "May 1 - 5",
    "price": "17,146",
    "rating": 4.98,
    "guestFavorite": True,
  }
]

def seed_db():
    logger.info("Initializing DB Seed...")
    models.Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    
    # Check if we already have listings to prevent duplicate seeds
    existing = db.query(models.ListingDB).first()
    if existing:
        logger.info("Database already seeded. Skipping...")
        db.close()
        return

    # Seed mock user
    user = models.UserDB(name="Guest User", email="guest@airbnbclone.com", is_host=False)
    db.add(user)
    
    # Seed mock listings
    for listing_data in MOCK_LISTINGS:
        listing = models.ListingDB(**listing_data)
        db.add(listing)

    db.commit()
    db.close()
    logger.info("Database seeding complete!")

if __name__ == "__main__":
    seed_db()
