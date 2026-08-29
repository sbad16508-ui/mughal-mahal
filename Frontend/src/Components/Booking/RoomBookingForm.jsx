import { useMemo, useState } from "react";

function RoomBookingForm({ rate }) {
  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    adults: "1",
    paymentMethod: "Pay in Office",
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [bookingResult, setBookingResult] = useState(null);
  const [error, setError] = useState("");

  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const diff = Math.floor((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [booking.checkIn, booking.checkOut]);

  const subtotal = nights * rate;
  const gstAmount = Math.round(subtotal * 0.05);
  const totalAmount = subtotal + gstAmount;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!booking.checkIn || !booking.checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }
    if (nights <= 0) {
      setError("Check-out must be later than check-in.");
      return;
    }
    if (!booking.adults || Number(booking.adults) < 1) {
      setError("Please enter the number of adults.");
      return;
    }
    if (booking.paymentMethod === "Card Payment") {
      if (!booking.cardName || !booking.cardNumber || !booking.expiryMonth || !booking.expiryYear || !booking.cvv) {
        setError("Please complete all card payment fields.");
        return;
      }
    }

    setBookingResult({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      adults: booking.adults,
      paymentMethod: booking.paymentMethod,
      nights,
      subtotal,
      gstAmount,
      totalAmount,
    });
  };

  return (
    <section className="room-booking-section">
      <h2>Check availability & Book now</h2>
      <form className="room-booking-form" onSubmit={handleSubmit}>
        <div className="room-booking-row">
          <label>Check-in Date</label>
          <input type="date" name="checkIn" value={booking.checkIn} onChange={handleChange} />
        </div>
        <div className="room-booking-row">
          <label>Check-out Date</label>
          <input type="date" name="checkOut" value={booking.checkOut} onChange={handleChange} />
        </div>
        <div className="room-booking-row">
          <label>Adults</label>
          <input type="number" min="1" name="adults" value={booking.adults} onChange={handleChange} />
        </div>
        <div className="room-booking-row">
          <label>Payment Method</label>
          <select name="paymentMethod" value={booking.paymentMethod} onChange={handleChange}>
            <option value="Pay in Office">Pay in Office</option>
            <option value="Card Payment">Card Payment</option>
          </select>
        </div>

        {/* Availability message removed per request */}

        <div className="room-booking-total">
          <p>Rate per night: Rs. {rate}</p>
          <p>Subtotal: Rs. {subtotal}</p>
          <p>GST (5%): Rs. {gstAmount}</p>
          <p className="total-amount">Total: Rs. {totalAmount}</p>
        </div>

        {booking.paymentMethod === "Card Payment" && (
          <div className="room-booking-card-details">
            <div className="room-booking-row">
              <label>Cardholder Name</label>
              <input type="text" name="cardName" value={booking.cardName} onChange={handleChange} placeholder="Cardholder name" />
            </div>
            <div className="room-booking-row">
              <label>Card Number</label>
              <input type="text" name="cardNumber" value={booking.cardNumber} onChange={handleChange} placeholder="1234 5678 9012 3456" />
            </div>
            <div className="room-booking-row">
              <label>Expiry Month</label>
              <input type="text" name="expiryMonth" value={booking.expiryMonth} onChange={handleChange} placeholder="MM" maxLength="2" />
            </div>
            <div className="room-booking-row">
              <label>Expiry Year</label>
              <input type="text" name="expiryYear" value={booking.expiryYear} onChange={handleChange} placeholder="YY" maxLength="2" />
            </div>
            <div className="room-booking-row">
              <label>CVV</label>
              <input type="text" name="cvv" value={booking.cvv} onChange={handleChange} placeholder="123" maxLength="4" />
            </div>
          </div>
        )}

        {error && <div className="room-booking-error">{error}</div>}
        <button type="submit" className="room-booking-submit">Confirm Booking</button>
      </form>

      {bookingResult && (
        <div className="room-booking-confirmation">
          <h3>Booking confirmed</h3>
          <p>Check-in: {bookingResult.checkIn}</p>
          <p>Check-out: {bookingResult.checkOut}</p>
          <p>Guests: {bookingResult.adults}</p>
          <p>Payment: {bookingResult.paymentMethod}</p>
          <p>Nights: {bookingResult.nights}</p>
          <p>Subtotal: Rs. {bookingResult.subtotal}</p>
          <p>GST (5%): Rs. {bookingResult.gstAmount}</p>
          <p className="total-amount">Total: Rs. {bookingResult.totalAmount}</p>
          {bookingResult.paymentMethod === "Pay in Office" && (
            <p>Please complete payment at the office on arrival.</p>
          )}
        </div>
      )}
    </section>
  );
}

export default RoomBookingForm;
