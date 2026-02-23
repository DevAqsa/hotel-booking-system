from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
df = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
df_cards = pd.read_csv("cards.csv", dtype=str).to_dict(orient="records")
df_cards_security = pd.read_csv("card_security.csv", dtype=str)

# Load users - CREATE users.csv first!
try:
    df_users = pd.read_csv("users.csv", dtype=str)
except:
    # Create empty users file if doesn't exist
    df_users = pd.DataFrame(columns=["username", "password", "name"])
    df_users.to_csv("users.csv", index=False)


# ============ YOUR EXISTING CLASSES ============

class Hotel:
    def __init__(self, hotel_id):
        self.hotel_id = hotel_id
        self.name = df.loc[df["id"] == self.hotel_id, "name"].squeeze()

    def book(self):
        global df
        df.loc[df["id"] == self.hotel_id, "available"] = "no"
        df.to_csv("hotels.csv", index=False)

    def available(self):
        availability = df.loc[df["id"] == self.hotel_id, "available"].squeeze()
        return availability == "yes"


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


# ============ PYDANTIC MODELS ============

class BookingRequest(BaseModel):
    hotel_id: str
    customer_name: str
    card_number: str
    card_expiration: str
    card_holder: str
    card_cvc: str
    card_password: str


class LoginRequest(BaseModel):
    username: str
    password: str


class SignupRequest(BaseModel):
    username: str
    password: str
    name: str


# ============ AUTH ENDPOINTS ============

@app.post("/auth/login")
def login(request: LoginRequest):
    global df_users
    df_users = pd.read_csv("users.csv", dtype=str)

    user = df_users[
        (df_users["username"] == request.username) &
        (df_users["password"] == request.password)
        ]

    if user.empty:
        raise HTTPException(status_code=401, detail="Invalid username or password")

    return {
        "success": True,
        "user": {
            "username": request.username,
            "name": user.iloc[0]["name"]
        }
    }


@app.post("/auth/signup")
def signup(request: SignupRequest):
    global df_users
    df_users = pd.read_csv("users.csv", dtype=str)

    # Check if username exists
    if request.username in df_users["username"].values:
        raise HTTPException(status_code=400, detail="Username already exists")

    # Add new user
    new_user = pd.DataFrame([{
        "username": request.username,
        "password": request.password,
        "name": request.name
    }])

    df_users = pd.concat([df_users, new_user], ignore_index=True)
    df_users.to_csv("users.csv", index=False)

    return {
        "success": True,
        "user": {
            "username": request.username,
            "name": request.name
        }
    }


# ============ HOTEL ENDPOINTS ============

@app.get("/")
def root():
    return {"message": "Hotel Booking API", "status": "running"}


@app.get("/hotels")
def get_hotels():
    df_fresh = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
    hotels = df_fresh.to_dict(orient="records")
    return {"hotels": hotels}


@app.get("/hotels/featured")
def get_featured_hotels():
    """Get featured hotels for landing page"""
    df_fresh = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
    hotels = df_fresh.head(3).to_dict(orient="records")
    return {"hotels": hotels}


@app.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: str):
    hotel_data = df[df["id"] == hotel_id].to_dict(orient="records")
    if not hotel_data:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel_data[0]


@app.post("/book")
def book_hotel(booking: BookingRequest):
    global df

    df = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
    hotel = Hotel(booking.hotel_id)

    if not hotel.available():
        raise HTTPException(status_code=400, detail="Hotel is not available")

    card = SecureCreditCard(number=booking.card_number)
    if not card.validate(booking.card_expiration, booking.card_holder, booking.card_cvc):
        raise HTTPException(status_code=400, detail="Invalid card details")

    if not card.authenticate(booking.card_password):
        raise HTTPException(status_code=400, detail="Card authentication failed")

    hotel.book()

    return {
        "success": True,
        "message": "Booking confirmed!",
        "reservation": {
            "customer_name": booking.customer_name,
            "hotel_name": hotel.name
        }
    }