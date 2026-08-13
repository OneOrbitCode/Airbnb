from sqlalchemy import Column, Integer, String, Float, Boolean, ForeignKey, Date
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
    is_host = Column(Boolean, default=False)

    bookings = relationship("BookingDB", back_populates="user")

class ListingDB(Base):
    __tablename__ = "listings"

    id = Column(Integer, primary_key=True, index=True)
    imageSrc = Column(String)
    location = Column(String)
    distance = Column(String)
    dateRange = Column(String)
    price = Column(String)
    rating = Column(Float)
    guestFavorite = Column(Boolean, default=False)

    bookings = relationship("BookingDB", back_populates="listing")

class BookingDB(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey("listings.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    check_in = Column(Date)
    check_out = Column(Date)

    listing = relationship("ListingDB", back_populates="bookings")
    user = relationship("UserDB", back_populates="bookings")


# --- Pydantic Schemas ---

class ListingBase(BaseModel):
    imageSrc: str
    location: str
    distance: str
    dateRange: str
    price: str
    rating: float
    guestFavorite: bool

class Listing(ListingBase):
    id: int
    class Config:
        from_attributes = True

class UserBase(BaseModel):
    name: str
    email: str
    is_host: bool = False

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

class BookingCreate(BaseModel):
    listing_id: int
    user_id: int
    check_in: date
    check_out: date

class Booking(BookingCreate):
    id: int
    class Config:
        from_attributes = True
