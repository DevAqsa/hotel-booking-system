import pandas

df = pandas.read_csv("hotels.csv", dtype={"id": str, "name": str})


class Hotel:
    def __init__(self, hotel_id):
        self.hotel_id = hotel_id
        self.name = df.loc[df["id"] == self.hotel_id, "name"].squeeze()


    def book(self):
        """book a hotel by changing its availability to No"""
        df.loc[df["id"] == self.hotel_id, "available"] =  "no"
        df.to_csv("hotels.csv", index=False)


    def available(self):
        """check if hotel available"""
        availability = df.loc[df["id"] == self.hotel_id, "available"].squeeze()
        if availability == "yes":
            return True
        else:
            return False

class ReservationTicket:
    def __init__(self, customer_name, hotel_object):
        self.customer_name = customer_name
        self.hotel = hotel_object


    def generate(self):
        content = f"""
            Thank you for your reservation !
            Here are your Booking data:
            Name: {self.customer_name}
            Hotel: {self.hotel.name}
        """
        return content


print(df)
hotel_ID = input("Enter hotel id: ")
hotel = Hotel(hotel_ID)

if hotel.available():
    hotel.book()
    name = input("Enter hotel name: ")
    reservation_ticket = ReservationTicket(customer_name=name ,hotel_object=hotel)
    print(reservation_ticket.generate())
else:
    print("Hotel is not free")

