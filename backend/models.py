from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date, Text
from sqlalchemy.orm import relationship
from database import Base
from pydantic import BaseModel
from typing import List, Optional
from datetime import date

# --- SQLAlchemy Models ---

class UserDB(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    avatar_url = Column(String, default="https://a0.muscache.com/im/pictures/user/default_avatar.jpeg")
    is_host = Column(Boolean, default=False)
    is_superhost = Column(Boolean, default=True)
    created_at = Column(Date, default=date.today)

    bookings = relationship("BookingDB", back_populates="user")
    listings = relationship("ListingDB", back_populates="host")
    reviews = relationship("ReviewDB", back_populates="user")

class ListingDB(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    host_id = Column(Integer, ForeignKey("users.id"))
    
    title = Column(String)
    description = Column(Text)
    property_type = Column(String)
    location = Column(String)
    distance = Column(String)
    dateRange = Column(String)
    
    price_per_night = Column(Float)
    price = Column(String)
    
    rating = Column(Float, default=0.0)
    guestFavorite = Column(Boolean, default=False)
    
    latitude = Column(Float, default=25.3176)
    longitude = Column(Float, default=82.9739)
    
    images = Column(Text)
    imageSrc = Column(String)
    amenities = Column(Text)

    host = relationship("UserDB", back_populates="listings")
    bookings = relationship("BookingDB", back_populates="listing")
    reviews = relationship("ReviewDB", back_populates="listing")

class BookingDB(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(Date)
    check_out = Column(Date)
    guests = Column(Integer, default=1)
    total_price = Column(Float)

    listing = relationship("ListingDB", back_populates="bookings")
    user = relationship("UserDB", back_populates="bookings")

class ReviewDB(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(Float)
    comment = Column(Text)
    created_at = Column(Date, default=date.today)

    listing = relationship("ListingDB", back_populates="reviews")
    user = relationship("UserDB", back_populates="reviews")


# --- Pydantic Schemas ---

class UserBase(BaseModel):
    name: str
    email: str
    avatar_url: Optional[str] = None
    is_host: bool = False
    is_superhost: bool = True

class User(UserBase):
    id: int
    created_at: date
    class Config:
        from_attributes = True

class ReviewBase(BaseModel):
    rating: float
    comment: str

class ReviewCreate(ReviewBase):
    listing_id: int
    user_id: int

class Review(ReviewBase):
    id: int
    listing_id: int
    user_id: int
    created_at: date
    user: Optional[User] = None
    class Config:
        from_attributes = True

class BookingSimple(BaseModel):
    id: int
    listing_id: int
    user_id: int
    check_in: date
    check_out: date
    guests: int
    total_price: float
    user: Optional[User] = None
    class Config:
        from_attributes = True

class ListingBase(BaseModel):
    title: str
    description: str
    property_type: str
    location: str
    distance: str
    dateRange: str
    price_per_night: float
    price: str
    rating: float
    guestFavorite: bool
    latitude: Optional[float] = 25.3176
    longitude: Optional[float] = 82.9739
    images: str
    imageSrc: str
    amenities: str

class ListingCreate(ListingBase):
    host_id: int

class Listing(ListingBase):
    id: int
    host_id: int
    host: Optional[User] = None
    reviews: List[Review] = []
    bookings: List[BookingSimple] = []
    class Config:
        from_attributes = True

class BookingBase(BaseModel):
    listing_id: int
    user_id: int
    check_in: date
    check_out: date
    guests: int
    total_price: float

class BookingCreate(BookingBase):
    pass

class Booking(BookingBase):
    id: int
    listing: Optional[Listing] = None
    user: Optional[User] = None
    class Config:
        from_attributes = True
