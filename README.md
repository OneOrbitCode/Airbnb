# Airbnb Clone (SDE Fullstack Assignment)

A fully functional, pixel-perfect clone of the Airbnb web application that replicates Airbnb's design language, user experience, search filters, and core booking workflows.

---

## 🌟 Implemented Features & Bonuses

### Core Features
- **Pixel-Perfect Airbnb UI/UX**: Replicates Airbnb's typography, `#FF385C` brand styling, sticky header, pill search bar, and card grid layout.
- **Search & Advanced Filters Modal**: Real-time destination search, category strip (`Rooms`, `Amazing pools`, `Cabins`, `Earth homes`, `Tropical`, etc.), and interactive **Filters Modal** (Price Range, Star Rating, and Guest Favorite toggles).
- **Listing Details & 5-Photo Collage**: Deep property overview, host profile, highlights, amenities list, user reviews, and pricing breakdowns.
- **Pre-Fed Reservation System**: Automatically pre-feeds check-in/checkout dates (today to tomorrow), calculates nightly totals, and prevents overlapping booking conflicts.
- **Interactive Guest Counter**: Steppers for Adults, Children, and Infants on both Desktop and Mobile.
- **Host Portal (Full CRUD)**: Dedicated portal to create, edit, view, and delete property listings.
- **My Trips Dashboard**: Real-time reservations tracking with booking details and stay management.

### 🏆 Bonus Features (100% Implemented)
1. **Interactive Map with Listing Pins**:
   - Floating `Show map` / `Show list` toggle button matching Airbnb's mobile & desktop experience.
   - Interactive map canvas with custom price pill pins (`₹3,190`, `₹4,075`, etc.).
   - Hover and tap on pins to view property preview cards with direct navigation.
2. **Leave a Review After Completed Stay**:
   - Interactive Review Modal in both `/trips` and on listing detail pages (`/listings/[id]`).
   - Interactive 5-star rating picker + written review submission.
   - Backend automatically calculates and aggregates listing star ratings upon review submission.
3. **Superhost Badges & Rating Aggregation**:
   - "★ Superhost" status badges displayed on host profiles, cards, and user menu.
   - Dynamic real-time recalculation of average star ratings.
4. **Image Upload to Cloud / Local Media Storage**:
   - Real image file upload in the Host Dashboard (`POST /api/upload`) with drag-and-drop support and immediate preview generation.
5. **Dark Mode**:
   - Global Theme Provider (`light` / `dark`) with toggle in header and user dropdown.
   - Persists state in `localStorage` and adapts all cards, maps, modals, and headers.
6. **Fully Responsive Design**:
   - Mobile bottom reservation bar with slide-up date & guest selection drawer.
   - Adaptive grid layouts across mobile (<640px), tablet (640px-1024px), desktop (1024px-1440px), and ultrawide screens (>1440px).

---

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 (App Router, React Server Components), TypeScript, Tailwind CSS v4
- **Backend**: Python 3.12+, FastAPI, SQLAlchemy ORM, Pydantic
- **Database**: SQLite (`airbnb_v2.db`) with relational schema
- **Media Storage**: FastAPI StaticFiles multipart upload handler

---

## 🗄️ Database Schema

The relational database architecture is defined in `backend/models.py`:

```
+-------------------------------------------------------------+
|                           USERS                             |
+-------------------------------------------------------------+
| id (PK)           | Integer, Primary Key                    |
| name              | String                                  |
| email             | String, Unique                          |
| avatar_url        | String                                  |
| is_host           | Boolean                                 |
| is_superhost      | Boolean                                 |
| created_at        | Date                                    |
+-------------------------------------------------------------+
                              |
                              | 1 : N
                              v
+-------------------------------------------------------------+
|                          LISTINGS                           |
+-------------------------------------------------------------+
| id (PK)           | Integer, Primary Key                    |
| host_id (FK)      | Integer, Foreign Key -> users.id        |
| title             | String                                  |
| description       | Text                                    |
| property_type     | String (e.g. "Rooms", "Cabins", etc.)   |
| location          | String                                  |
| distance          | String                                  |
| dateRange         | String                                  |
| price_per_night   | Float                                   |
| price             | String                                  |
| rating            | Float (Aggregated from reviews)         |
| guestFavorite     | Boolean                                 |
| latitude          | Float (For map pins)                    |
| longitude         | Float (For map pins)                    |
| images            | Text (JSON Array of URLs)               |
| imageSrc          | String (Primary Cover URL)              |
| amenities         | Text (JSON Array of strings)            |
+-------------------------------------------------------------+
         |                                           |
         | 1 : N                                     | 1 : N
         v                                           v
+-----------------------------------+   +-----------------------------------+
|             BOOKINGS              |   |              REVIEWS              |
+-----------------------------------+   +-----------------------------------+
| id (PK)        | Integer          |   | id (PK)        | Integer          |
| listing_id(FK) | FK -> listings.id|   | listing_id(FK) | FK -> listings.id|
| user_id (FK)   | FK -> users.id   |   | user_id (FK)   | FK -> users.id   |
| check_in       | Date             |   | rating         | Float            |
| check_out      | Date             |   | comment        | Text             |
| guests         | Integer          |   | created_at     | Date             |
| total_price    | Float            |   +-----------------------------------+
+-----------------------------------+
```

---

## ⚡ Quick Start & Setup Instructions

### Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 1. Start the Backend API
```powershell
# Navigate to backend directory
cd backend

# Activate virtual environment
.\venv\Scripts\activate

# Install dependencies (if not already installed)
pip install -r requirements.txt

# (Optional) Seed the database with verified live properties & reviews
python seed.py

# Launch FastAPI server on port 8000
uvicorn main:app --reload --port 8000
```
*API Swagger documentation is accessible at `http://127.0.0.1:8000/docs`.*

### 2. Start the Frontend Application
```powershell
# Navigate to frontend directory
cd frontend

# Install packages
npm install

# Start Next.js development server
npm run dev
```

### 3. Open in Browser
Open **`http://localhost:3000`** in your browser.

---

## 🧪 Verification & Testing Guide

| Flow | Steps to Test |
| :--- | :--- |
| **Search & Filters** | Type a destination in the top header (e.g. `Varanasi`) or click **Filters** to test price range and star rating filtering. |
| **Interactive Map** | Click the floating **Show map** button at the bottom of the home screen to pan/zoom and click listing price pins. |
| **Dark Mode** | Click the Moon/Sun icon in the header or user profile menu to toggle dark mode across the entire app. |
| **Reservation** | Click any listing. Check-in and checkout dates are pre-fed. Adjust dates or click **Guests** to use the interactive counter, then click **Reserve**. |
| **Leave a Review** | Go to **My Trips** (`/trips`) and click **Leave a Review**, or click **+ Write a Review** on any listing page. Select 1-5 stars, enter feedback, and submit. |
| **Host Listing & Photo Upload** | Navigate to `/host`, click **+ Create New Listing**, upload a photo from your computer, fill details, and publish. |
