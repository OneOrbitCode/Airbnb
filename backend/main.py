from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import engine, Base, get_db
import models

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

# Add CORS middleware for frontend connection
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Airbnb Clone API"}

@app.get("/api/listings", response_model=List[models.Listing])
def get_listings(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    listings = db.query(models.ListingDB).offset(skip).limit(limit).all()
    return listings

@app.get("/api/listings/{listing_id}", response_model=models.Listing)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.ListingDB).filter(models.ListingDB.id == listing_id).first()
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/api/listings", response_model=models.Listing)
def create_listing(listing: models.ListingBase, db: Session = Depends(get_db)):
    db_listing = models.ListingDB(**listing.dict())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@app.post("/api/bookings", response_model=models.Booking)
def create_booking(booking: models.BookingCreate, db: Session = Depends(get_db)):
    # Mocking booking creation
    db_booking = models.BookingDB(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking
