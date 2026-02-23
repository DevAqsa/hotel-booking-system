from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd

app = FastAPI()

# CORS - allows React to talk to this backend (like cors in Express)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # React default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load data
df = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
df_cards = pd.read_csv("cards.csv", dtype=str).to_dict(orient="records")
df_cards_security = pd.read_csv("card_security.csv", dtype=str)


# ============ YOUR CLASSES (same logic) ============

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
        # Check each card manually (more reliable than dict comparison)
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


# ============ PYDANTIC MODELS (like TypeScript interfaces) ============

class BookingRequest(BaseModel):
    hotel_id: str
    customer_name: str
    card_number: str
    card_expiration: str
    card_holder: str
    card_cvc: str
    card_password: str


# ============ API ENDPOINTS (like Express routes) ============

@app.get("/hotels")
def get_hotels():
    """Get all hotels - reload CSV each time"""
    df_fresh = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})
    hotels = df_fresh.to_dict(orient="records")
    return {"hotels": hotels}

@app.get("/hotels/{hotel_id}")
def get_hotel(hotel_id: str):
    """Get single hotel by ID"""
    hotel_data = df[df["id"] == hotel_id].to_dict(orient="records")
    if not hotel_data:
        raise HTTPException(status_code=404, detail="Hotel not found")
    return hotel_data[0]

@app.post("/book")
def book_hotel(booking: BookingRequest):
    global df

    # Reload CSV to get fresh data
    df = pd.read_csv("hotels.csv", dtype={"id": str, "name": str})

    hotel = Hotel(booking.hotel_id)

    # Check availability
    if not hotel.available():
        raise HTTPException(status_code=400, detail="Hotel is not available")

    # DEBUG: Print what we're comparing
    print("=== DEBUG ===")
    print("Received card data:")
    print(f"  number: '{booking.card_number}'")
    print(f"  expiration: '{booking.card_expiration}'")
    print(f"  holder: '{booking.card_holder}'")
    print(f"  cvc: '{booking.card_cvc}'")
    print("Cards in CSV:")
    for card in df_cards:
        print(f"  {card}")
    print("=============")

    # Validate card
    card = SecureCreditCard(number=booking.card_number)
    if not card.validate(booking.card_expiration, booking.card_holder, booking.card_cvc):
        raise HTTPException(status_code=400, detail="Invalid card details")

    # Authenticate
    if not card.authenticate(booking.card_password):
        raise HTTPException(status_code=400, detail="Card authentication failed")

    # Book the hotel
    hotel.book()

    return {
        "success": True,
        "message": "Booking confirmed!",
        "reservation": {
            "customer_name": booking.customer_name,
            "hotel_name": hotel.name
        }
    }