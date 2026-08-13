from fastapi import FastAPI, Depends, HTTPException, Query, File, UploadFile
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List, Optional
from database import engine, Base, get_db
import models
from datetime import date
import json
import os
import shutil
import uuid

# Ensure upload directory exists
UPLOAD_DIR = os.path.join(os.path.dirname(__file__), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Create all database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Airbnb Clone API")

# Add CORS middleware for frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Serve uploaded static files
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to the Airbnb Clone API"}

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """Upload listing image to storage / static CDN"""
    ext = file.filename.split(".")[-1] if "." in file.filename else "jpg"
    filename = f"{uuid.uuid4().hex}.{ext}"
    filepath = os.path.join(UPLOAD_DIR, filename)
    
    with open(filepath, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    return {
        "url": f"http://127.0.0.1:8000/uploads/{filename}",
        "filename": filename
    }

@app.get("/api/listings", response_model=List[models.Listing])
def get_listings(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    location: Optional[str] = None,
    category: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(models.ListingDB)
    
    if location:
        query = query.filter(models.ListingDB.location.ilike(f"%{location}%"))
        
    if category and category != "Icons" and category != "All":
        query = query.filter(models.ListingDB.property_type.ilike(f"%{category}%"))

    listings = query.offset(skip).limit(limit).all()
    return listings

@app.get("/api/listings/{listing_id}", response_model=models.Listing)
def get_listing(listing_id: int, db: Session = Depends(get_db)):
    listing = db.query(models.ListingDB).filter(models.ListingDB.id == listing_id).first()
    if listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    return listing

@app.post("/api/listings", response_model=models.Listing)
def create_listing(listing: models.ListingCreate, db: Session = Depends(get_db)):
    db_listing = models.ListingDB(**listing.dict())
    db.add(db_listing)
    db.commit()
    db.refresh(db_listing)
    return db_listing

@app.put("/api/listings/{listing_id}", response_model=models.Listing)
def update_listing(listing_id: int, listing: models.ListingCreate, db: Session = Depends(get_db)):
    db_listing = db.query(models.ListingDB).filter(models.ListingDB.id == listing_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    for key, value in listing.dict().items():
        setattr(db_listing, key, value)
        
    db.commit()
    db.refresh(db_listing)
    return db_listing

@app.delete("/api/listings/{listing_id}")
def delete_listing(listing_id: int, db: Session = Depends(get_db)):
    db_listing = db.query(models.ListingDB).filter(models.ListingDB.id == listing_id).first()
    if db_listing is None:
        raise HTTPException(status_code=404, detail="Listing not found")
    
    db.delete(db_listing)
    db.commit()
    return {"message": "Listing deleted successfully"}

@app.post("/api/bookings", response_model=models.Booking)
def create_booking(booking: models.BookingCreate, db: Session = Depends(get_db)):
    overlapping = db.query(models.BookingDB).filter(
        models.BookingDB.listing_id == booking.listing_id,
        models.BookingDB.check_in < booking.check_out,
        models.BookingDB.check_out > booking.check_in
    ).first()
    
    if overlapping:
        raise HTTPException(status_code=400, detail="Dates are already booked for this property.")
        
    db_booking = models.BookingDB(**booking.dict())
    db.add(db_booking)
    db.commit()
    db.refresh(db_booking)
    return db_booking

@app.get("/api/users/{user_id}/bookings", response_model=List[models.Booking])
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    bookings = db.query(models.BookingDB).filter(models.BookingDB.user_id == user_id).all()
    return bookings

@app.get("/api/hosts/{host_id}/bookings", response_model=List[models.Booking])
def get_host_received_bookings(host_id: int, db: Session = Depends(get_db)):
    """Get all bookings made on properties owned by this host"""
    host_listings = db.query(models.ListingDB.id).filter(models.ListingDB.host_id == host_id).all()
    listing_ids = [l[0] for l in host_listings]
    bookings = db.query(models.BookingDB).filter(models.BookingDB.listing_id.in_(listing_ids)).all()
    return bookings

@app.get("/api/users/{user_id}/listings", response_model=List[models.Listing])
def get_user_listings(user_id: int, db: Session = Depends(get_db)):
    listings = db.query(models.ListingDB).filter(models.ListingDB.host_id == user_id).all()
    return listings

@app.post("/api/listings/{listing_id}/reviews", response_model=models.Review)
def create_review(listing_id: int, review: models.ReviewCreate, db: Session = Depends(get_db)):
    db_review = models.ReviewDB(**review.dict())
    db.add(db_review)
    db.flush()
    
    listing = db.query(models.ListingDB).filter(models.ListingDB.id == listing_id).first()
    if listing:
        all_reviews = db.query(models.ReviewDB).filter(models.ReviewDB.listing_id == listing_id).all()
        if all_reviews:
            avg_rating = sum(r.rating for r in all_reviews) / len(all_reviews)
            listing.rating = round(avg_rating, 2)
            
    db.commit()
    db.refresh(db_review)
    return db_review

@app.get("/api/users", response_model=List[models.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.UserDB).all()
