from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List
import pandas as pd
from datetime import datetime
import uuid

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ============ LOAD DATA ============

def load_hotels():
    return pd.read_csv("hotels.csv", dtype={"id": str})


def load_users():
    try:
        df = pd.read_csv("users.csv", dtype=str)
        # Fill NaN values with empty strings
        df = df.fillna("")
        return df
    except:
        df = pd.DataFrame(columns=["username", "password", "name", "email", "phone"])
        df.to_csv("users.csv", index=False)
        return df


def load_bookings():
    try:
        return pd.read_csv("bookings.csv", dtype=str)
    except:
        df = pd.DataFrame(
            columns=["id", "username", "hotel_id", "hotel_name", "room_type", "check_in", "check_out", "guests",
                     "total_price", "status", "booked_at"])
        df.to_csv("bookings.csv", index=False)
        return df


def load_wishlist():
    try:
        return pd.read_csv("wishlist.csv", dtype=str)
    except:
        df = pd.DataFrame(columns=["username", "hotel_id"])
        df.to_csv("wishlist.csv", index=False)
        return df


df_cards = pd.read_csv("cards.csv", dtype=str).to_dict(orient="records")
df_cards_security = pd.read_csv("card_security.csv", dtype=str)


# ============ PYDANTIC MODELS ============

class LoginRequest(BaseModel):
    username: str
    password: str


class SignupRequest(BaseModel):
    username: str
    password: str
    name: str


class ProfileUpdateRequest(BaseModel):
    name: str
    email: Optional[str] = ""
    phone: Optional[str] = ""


class PasswordUpdateRequest(BaseModel):
    username: str
    current_password: str
    new_password: str


class BookingRequest(BaseModel):
    username: str
    hotel_id: str
    hotel_name: str
    room_type: str
    check_in: str
    check_out: str
    guests: int
    total_price: float
    card_number: str
    card_expiration: str
    card_holder: str
    card_cvc: str
    card_password: str


class WishlistRequest(BaseModel):
    username: str
    hotel_id: str


class CancelBookingRequest(BaseModel):
    booking_id: str
    username: str


# ============ CARD CLASSES ============

class CreditCard:
    def __init__(self, number):
        self.number = number

    def validate(self, expiration, holder, cvc):
        for card in df_cards:
            if (card["number"].strip() == self.number.strip() and
                    card["expiration"].strip() == expiration.strip() and
                    card["holder"].strip() == holder.strip() and
                    card["cvc"].strip() == cvc.strip()):
                return True
        return False


class SecureCreditCard(CreditCard):
    def authenticate(self, given_password):
        password = df_cards_security.loc[
            df_cards_security["number"] == self.number, "password"
        ].squeeze()
        return password == given_password


# ============ AUTH ENDPOINTS ============

@app.post("/auth/login")
def login(request: LoginRequest):
    df_users = load_users()
    user = df_users[
        (df_users["username"] == request.username) &
        (df_users["password"] == request.password)
        ]

    if user.empty:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    user_data = user.iloc[0]

    return {
        "success": True,
        "user": {
            "username": str(user_data["username"]),
            "name": str(user_data["name"]),
            "email": str(user_data["email"]) if user_data["email"] else "",
            "phone": str(user_data["phone"]) if user_data["phone"] else ""
        }
    }


@app.post("/auth/signup")
def signup(request: SignupRequest):
    df_users = load_users()

    if request.username in df_users["username"].values:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = pd.DataFrame([{
        "username": request.username,
        "password": request.password,
        "name": request.name,
        "email": "",
        "phone": ""
    }])

    df_users = pd.concat([df_users, new_user], ignore_index=True)
    df_users.to_csv("users.csv", index=False)

    return {
        "success": True,
        "user": {
            "username": request.username,
            "name": request.name,
            "email": "",
            "phone": ""
        }
    }


# ============ PROFILE ENDPOINTS ============

@app.put("/profile/{username}")
def update_profile(username: str, request: ProfileUpdateRequest):
    df_users = load_users()

    if username not in df_users["username"].values:
        raise HTTPException(status_code=404, detail="User not found")

    df_users.loc[df_users["username"] == username, "name"] = request.name
    df_users.loc[df_users["username"] == username, "email"] = request.email if request.email else ""
    df_users.loc[df_users["username"] == username, "phone"] = request.phone if request.phone else ""
    df_users.to_csv("users.csv", index=False)

    return {
        "success": True,
        "user": {
            "username": username,
            "name": request.name,
            "email": request.email if request.email else "",
            "phone": request.phone if request.phone else ""
        }
    }

@app.put("/profile/password/update")
def update_password(request: PasswordUpdateRequest):
    df_users = load_users()

    user = df_users[
        (df_users["username"] == request.username) &
        (df_users["password"] == request.current_password)
        ]

    if user.empty:
        raise HTTPException(status_code=400, detail="Current password is incorrect")

    df_users.loc[df_users["username"] == request.username, "password"] = request.new_password
    df_users.to_csv("users.csv", index=False)

    return {"success": True, "message": "Password updated successfully"}


# ============ HOTEL ENDPOINTS ============

@app.get("/")
def root():
    return {"message": "Hotel Booking API", "status": "running"}


@app.get("/hotels")
def get_hotels(
        search: Optional[str] = None,
        min_price: Optional[float] = None,
        max_price: Optional[float] = None,
        available_only: Optional[bool] = False,
        sort_by: Optional[str] = None
):
    df = load_hotels()

    # Search by name or city
    if search:
        df = df[
            df["name"].str.contains(search, case=False, na=False) |
            df["city"].str.contains(search, case=False, na=False)
            ]

    # Filter by price
    if min_price is not None:
        df = df[df["price_per_night"].astype(float) >= min_price]
    if max_price is not None:
        df = df[df["price_per_night"].astype(float) <= max_price]

    # Filter by availability
    if available_only:
        df = df[df["available"] == "yes"]

    # Sort
    if sort_by == "price_low":
        df = df.sort_values("price_per_night", ascending=True)
    elif sort_by == "price_high":
        df = df.sort_values("price_per_night", ascending=False)
    elif sort_by == "rating":
        df = df.sort_values("rating", ascending=False)

    hotels = df.to_dict(orient="records")
    return {"hotels": hotels}


@app.get("/hotels/featured")
def get_featured_hotels():
    df = load_hotels()
    # Get unique hotels by name (just standard rooms for display)
    df_unique = df.drop_duplicates(subset=["name"]).head(3)
    return {"hotels": df_unique.to_dict(orient="records")}


@app.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: str):
    df = load_hotels()
    hotel = df[df["id"] == hotel_id].to_dict(orient="records")
    if not hotel:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel[0]


@app.get("/hotels/rooms/{hotel_name}")
def get_hotel_rooms(hotel_name: str):
    """Get all room types for a hotel"""
    df = load_hotels()
    rooms = df[df["name"] == hotel_name].to_dict(orient="records")
    return {"rooms": rooms}


# ============ BOOKING ENDPOINTS ============

@app.post("/book")
def create_booking(booking: BookingRequest):
    # Validate card
    card = SecureCreditCard(number=booking.card_number)
    if not card.validate(booking.card_expiration, booking.card_holder, booking.card_cvc):
        raise HTTPException(status_code=400, detail="Invalid card details")

    if not card.authenticate(booking.card_password):
        raise HTTPException(status_code=400, detail="Card authentication failed")

    # Create booking
    df_bookings = load_bookings()

    new_booking = {
        "id": str(uuid.uuid4())[:8],
        "username": booking.username,
        "hotel_id": booking.hotel_id,
        "hotel_name": booking.hotel_name,
        "room_type": booking.room_type,
        "check_in": booking.check_in,
        "check_out": booking.check_out,
        "guests": str(booking.guests),
        "total_price": str(booking.total_price),
        "status": "confirmed",
        "booked_at": datetime.now().strftime("%Y-%m-%d %H:%M")
    }

    df_bookings = pd.concat([df_bookings, pd.DataFrame([new_booking])], ignore_index=True)
    df_bookings.to_csv("bookings.csv", index=False)

    # Update hotel availability
    df_hotels = load_hotels()
    df_hotels.loc[df_hotels["id"] == booking.hotel_id, "available"] = "no"
    df_hotels.to_csv("hotels.csv", index=False)

    return {
        "success": True,
        "message": "Booking confirmed!",
        "booking": new_booking
    }


@app.get("/bookings/{username}")
def get_user_bookings(username: str):
    """Get active bookings for a user"""
    df = load_bookings()
    bookings = df[
        (df["username"] == username) &
        (df["status"] == "confirmed")
        ].to_dict(orient="records")
    return {"bookings": bookings}


@app.get("/bookings/history/{username}")
def get_booking_history(username: str):
    """Get all bookings (including cancelled) for a user"""
    df = load_bookings()
    bookings = df[df["username"] == username].to_dict(orient="records")
    return {"bookings": bookings}


@app.post("/bookings/cancel")
def cancel_booking(request: CancelBookingRequest):
    df_bookings = load_bookings()

    # Check if booking exists and belongs to user
    booking = df_bookings[
        (df_bookings["id"] == request.booking_id) &
        (df_bookings["username"] == request.username)
        ]

    if booking.empty:
        raise HTTPException(status_code=404, detail="Booking not found")

    # Update booking status
    df_bookings.loc[df_bookings["id"] == request.booking_id, "status"] = "cancelled"
    df_bookings.to_csv("bookings.csv", index=False)

    # Make hotel available again
    hotel_id = booking.iloc[0]["hotel_id"]
    df_hotels = load_hotels()
    df_hotels.loc[df_hotels["id"] == hotel_id, "available"] = "yes"
    df_hotels.to_csv("hotels.csv", index=False)

    return {"success": True, "message": "Booking cancelled successfully"}


# ============ WISHLIST ENDPOINTS ============

@app.get("/wishlist/{username}")
def get_wishlist(username: str):
    df_wishlist = load_wishlist()
    df_hotels = load_hotels()

    user_wishlist = df_wishlist[df_wishlist["username"] == username]["hotel_id"].tolist()

    # Get hotel details for wishlist items
    wishlist_hotels = df_hotels[df_hotels["id"].isin(user_wishlist)].drop_duplicates(subset=["name"]).to_dict(
        orient="records")

    return {"wishlist": wishlist_hotels, "hotel_ids": user_wishlist}


@app.post("/wishlist/add")
def add_to_wishlist(request: WishlistRequest):
    df_wishlist = load_wishlist()

    # Check if already in wishlist
    exists = df_wishlist[
        (df_wishlist["username"] == request.username) &
        (df_wishlist["hotel_id"] == request.hotel_id)
        ]

    if not exists.empty:
        raise HTTPException(status_code=400, detail="Already in wishlist")

    new_item = pd.DataFrame([{
        "username": request.username,
        "hotel_id": request.hotel_id
    }])

    df_wishlist = pd.concat([df_wishlist, new_item], ignore_index=True)
    df_wishlist.to_csv("wishlist.csv", index=False)

    return {"success": True, "message": "Added to wishlist"}


@app.post("/wishlist/remove")
def remove_from_wishlist(request: WishlistRequest):
    df_wishlist = load_wishlist()

    df_wishlist = df_wishlist[
        ~((df_wishlist["username"] == request.username) &
          (df_wishlist["hotel_id"] == request.hotel_id))
    ]

    df_wishlist.to_csv("wishlist.csv", index=False)

    return {"success": True, "message": "Removed from wishlist"}


# ============ DASHBOARD STATS ============

@app.get("/dashboard/stats/{username}")
def get_dashboard_stats(username: str):
    df_bookings = load_bookings()
    df_wishlist = load_wishlist()

    user_bookings = df_bookings[df_bookings["username"] == username]

    active_bookings = len(user_bookings[user_bookings["status"] == "confirmed"])
    total_bookings = len(user_bookings)
    total_spent = user_bookings[user_bookings["status"] == "confirmed"]["total_price"].astype(float).sum()
    wishlist_count = len(df_wishlist[df_wishlist["username"] == username])

    return {
        "active_bookings": active_bookings,
        "total_bookings": total_bookings,
        "total_spent": round(total_spent, 2),
        "wishlist_count": wishlist_count
    }