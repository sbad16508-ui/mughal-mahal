import { useMemo, useState, useEffect } from "react";
import "./Booking.css";
import roomCards from "../../data/roomData";
import bookingApi from "../../bookingApi";

function BookingComponent() {
  const [booking, setBooking] = useState({
    checkIn: "",
    checkOut: "",
    adults: "1",
    roomType: roomCards && roomCards.length > 0 ? roomCards[0].id : "standard",
    selectedRoom: "",
    guestName: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "Pay in Office",
    cardName: "",
    cardNumber: "",
    expiryMonth: "",
    expiryYear: "",
    cvv: "",
  });
  const [saved, setSaved] = useState("");
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [activeStep, setActiveStep] = useState("details");
  const [reservedRooms, setReservedRooms] = useState({});
  const [backendReservedRooms, setBackendReservedRooms] = useState({});
  const [backendLoaded, setBackendLoaded] = useState(false);
  const [allRooms, setAllRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);

  useEffect(() => {
    const loadLocalReserved = () => {
      if (typeof window === "undefined") return {}
      try {
        const savedRooms = localStorage.getItem("reservedRoomBookings")
        return savedRooms ? JSON.parse(savedRooms) : {}
      } catch {
        return {}
      }
    }

    const fetchAllRooms = async () => {
      try {
        const response = await bookingApi.get("/rooms")
        const data = Array.isArray(response.data) ? response.data : response.data.rooms || []
        setAllRooms(data)
      } catch (err) {
        console.error("Failed to fetch rooms:", err)
        setAllRooms([])
      } finally {
        setLoadingRooms(false)
      }
    }

    const updateReserved = async () => {
      const localReserved = loadLocalReserved()
      setReservedRooms(localReserved)

      try {
        const response = await bookingApi.get("/bookings")
        const data = Array.isArray(response.data)
          ? response.data
          : Array.isArray(response.data?.value)
          ? response.data.value
          : response.data.bookings || []

        const backendReserved = data
          .filter((booking) => (booking.bookingType || "room").toLowerCase() === "room")
          .reduce((acc, booking) => {
            const type = typeof booking.roomVenue === "object"
              ? booking.roomVenue.type || booking.roomVenue.roomType || booking.roomVenue.id || ""
              : booking.roomVenue || ""
            const roomNumber = typeof booking.roomVenue === "object"
              ? booking.roomVenue.selectedRoom || booking.roomVenue.roomNo || ""
              : ""
            if (!type || !roomNumber) return acc
            acc[type] = [...new Set([...(acc[type] || []), roomNumber])]
            return acc
          }, {})

        setBackendReservedRooms(backendReserved)
        setReservedRooms(backendReserved)
        if (typeof window !== "undefined") {
          localStorage.setItem("reservedRoomBookings", JSON.stringify(backendReserved))
        }
        setBackendLoaded(true)
      } catch (error) {
        console.error("Failed to load reserved rooms from backend", error)
        setReservedRooms(loadLocalReserved())
      }
    }

    fetchAllRooms()
    updateReserved()
  }, []);

  const currentUser = localStorage.getItem("bookingUser");

  const selectedRoomCard = useMemo(() => {
    return roomCards.find((r) => r.id === booking.roomType);
  }, [booking.roomType]);

  const matchesRoomType = (room) => {
    const normalizeRoomType = (value) => String(value || "")
      .trim()
      .toLowerCase()
      .replace(/ room$/, "");
    const selectedType = selectedRoomCard?.title?.split(" - ")[0] || booking.roomType;
    return normalizeRoomType(room.roomType) === normalizeRoomType(selectedType);
  };

  const roomOptions = useMemo(() => {
    const count = Number(selectedRoomCard?.roomCount ?? 10);
    const localReservedForType = reservedRooms[booking.roomType] || [];
    const backendReservedForType = backendReservedRooms[booking.roomType] || [];
    const reservedForType = backendLoaded ? backendReservedForType : localReservedForType;
    return Array.from({ length: count }, (_, index) => {
      const roomNumber = `${index + 1}`;
      return {
        value: roomNumber,
        label: `Room ${roomNumber}`,
        isBooked: reservedForType.includes(roomNumber),
      };
    });
  }, [booking.roomType, reservedRooms, backendReservedRooms, selectedRoomCard, backendLoaded]);

  const rate = useMemo(() => {
    const room = roomCards.find((r) => r.id === booking.roomType);
    if (!room) return 0;
    const match = room.price.match(/\d{1,3}(?:,\d{3})*/);
    if (!match) return 0;
    return parseInt(match[0].replace(/,/g, ""), 10);
  }, [booking.roomType]);
  const nights = useMemo(() => {
    if (!booking.checkIn || !booking.checkOut) return 0;
    const start = new Date(booking.checkIn);
    const end = new Date(booking.checkOut);
    const diff = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return diff > 0 ? diff : 0;
  }, [booking.checkIn, booking.checkOut]);
  const totalRate = useMemo(() => nights * rate, [nights, rate]);
  const gstAmount = useMemo(() => Math.round((totalRate * 5) / 100), [totalRate]);
  const totalAmount = useMemo(() => totalRate + gstAmount, [totalRate, gstAmount]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roomType") {
      setBooking((prev) => ({ ...prev, roomType: value, selectedRoom: "" }));
      return;
    }
    setBooking((prev) => ({ ...prev, [name]: value }));
  };

  const handleRoomSelect = (value) => {
    const reservedForType = reservedRooms[booking.roomType] || [];
    if (reservedForType.includes(value)) return;

    setBooking((prev) => ({
      ...prev,
      selectedRoom: prev.selectedRoom === value ? "" : value,
    }));
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setError("");

    if (!booking.checkIn || !booking.checkOut) {
      setError("Please select both check-in and check-out dates.");
      return;
    }

    if (!booking.roomType) {
      setError("Please choose a room type.");
      return;
    }

    setActiveStep("check-room");
  };

  const handleBackStep = (e) => {
    e.preventDefault();
    setError("");
    setActiveStep("details");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSaved("");

    if (!currentUser) {
      setError("Please login before submitting a booking.");
      return;
    }

    if (activeStep !== "check-room") {
      setActiveStep("check-room");
      return;
    }

    if (!booking.selectedRoom) {
      setError("Please select a room from the available options.");
      return;
    }

    if (!booking.checkIn || !booking.guestName || !booking.phone || !booking.email) {
      setError("Please complete all booking fields before submitting.");
      return;
    }

    if (!booking.paymentMethod) {
      setError("Please select a payment method.");
      return;
    }

    if (booking.paymentMethod === "Card Payment") {
      if (!booking.cardName || !booking.cardNumber || !booking.expiryMonth || !booking.expiryYear || !booking.cvv) {
        setError("Please complete the card payment fields.");
        return;
      }
    }

    try {
      const payload = {
        guestName: booking.guestName,
        email: booking.email,
        phone: booking.phone,
        address: booking.address,
        bookingType: "Room",
        roomVenue: {
          type: booking.roomType,
          selectedRoom: booking.selectedRoom,
        },
        checkInDate: booking.checkIn,
        checkOutDate: booking.checkOut,
        specialRequests: `Adults: ${booking.adults}; Selected Room: ${booking.selectedRoom}`,
        internalNotes: `Selected Room ${booking.selectedRoom}`,
        paymentMethod: booking.paymentMethod === "Card Payment" ? "card" : "cash",
        paymentStatus: booking.paymentMethod === "Card Payment" ? "paid" : "pending",
        totalAmount: booking.paymentMethod === "Card Payment" ? totalAmount : rate,
        paidAmount: booking.paymentMethod === "Card Payment" ? totalAmount : 0,
        status: booking.paymentMethod === "Card Payment" ? "confirmed" : "pending"
      };

      const response = await bookingApi.post("/booking/create-room-booking", payload);

      const bookingRecord = {
        id: `${Date.now()}`,
        checkIn: booking.checkIn,
        adults: booking.adults,
        roomType: booking.roomType,
        selectedRoom: booking.selectedRoom,
        guestName: booking.guestName,
        phone: booking.phone,
        paymentMethod: booking.paymentMethod,
        paymentStatus: booking.paymentMethod === "Card Payment" ? "paid" : "pending",
        rate,
        gstAmount,
        totalAmount: booking.paymentMethod === "Card Payment" ? totalAmount : rate,
        createdAt: new Date().toISOString(),
        backendId: response?.data?.booking?._id || null,
      };

      const storageKey = `bookingOrders_${currentUser}`;
      const existing = JSON.parse(localStorage.getItem(storageKey) || "[]");
      localStorage.setItem(storageKey, JSON.stringify([bookingRecord, ...existing]));

      const updatedReservedRooms = {
        ...reservedRooms,
        [booking.roomType]: Array.from(
          new Set([...(reservedRooms[booking.roomType] || []), booking.selectedRoom])
        ),
      };
      localStorage.setItem("reservedRoomBookings", JSON.stringify(updatedReservedRooms));
      setReservedRooms(updatedReservedRooms);
      setBackendReservedRooms((prev) => ({
        ...prev,
        [booking.roomType]: Array.from(
          new Set([...(prev[booking.roomType] || []), booking.selectedRoom])
        ),
      }));

      if (booking.paymentMethod === "Pay in Office") {
        setModalMessage(
          "Booking done! Please call now to keep reserving your booking. Close this message when ready."
        );
      } else {
        setModalMessage(
          `Payment successful! Your card payment of Rs. ${totalAmount} is complete and your booking is confirmed.`
        );
      }

      setSaved("Booking submitted successfully.");
      setShowModal(true);
      setBooking({
        checkIn: "",
        checkOut: "",
        adults: "1",
        roomType: roomCards && roomCards.length > 0 ? roomCards[0].id : "standard",
        selectedRoom: "",
        guestName: "",
        email: "",
        phone: "",
        address: "",
        paymentMethod: "Pay in Office",
        cardName: "",
        cardNumber: "",
        expiryMonth: "",
        expiryYear: "",
        cvv: "",
      });
      setActiveStep("details");
    } catch (err) {
      setError(err?.response?.data?.message || "Booking submission failed.");
    }
  };

  return (
    <div className="booking-container">
      <h2>Book Your Stay</h2>

      <div className="booking-steps" aria-label="Booking progress steps">
        <div className={`booking-step ${activeStep === "details" ? "active" : "completed"}`}>
          <span>1</span> Room Details
        </div>
        <div className={`booking-step ${activeStep === "check-room" ? "active" : ""}`}>
          <span>2</span> Check Room
        </div>
      </div>

      <form className="booking-form" onSubmit={handleSubmit}>
        <div className="row g-3">
          <div className="col-12 col-md-6">
            <label htmlFor="checkIn" className="heading-label">Check-in Date</label>
            <input
              id="checkIn"
              type="date"
              className="form-control"
              name="checkIn"
              value={booking.checkIn}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="checkOut" className="heading-label">Check-out Date</label>
            <input
              id="checkOut"
              type="date"
              className="form-control"
              name="checkOut"
              value={booking.checkOut}
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="adults" className="heading-label">Select Persons</label>
            <input
              id="adults"
              type="number"
              list="adultOptions"
              className="form-control"
              name="adults"
              value={booking.adults}
              onChange={handleChange}
              min="1"
              placeholder="1"
            />
            <datalist id="adultOptions">
              <option value="1" />
              <option value="2" />
              <option value="3" />
            </datalist>
          </div>

          <div className="col-12 col-md-6">
            <label htmlFor="roomType" className="heading-label">Room Type</label>
            <select
              id="roomType"
              className="form-control"
              name="roomType"
              value={booking.roomType}
              onChange={handleChange}
            >
              {roomCards.map((r) => (
                <option key={r.id} value={r.id}>{`${r.title} - ${r.price}`}</option>
              ))}
            </select>
          </div>

          {activeStep === "check-room" && (
            <div className="col-12">
              <div className="room-check-section">
                <div className="room-check-header">
                  <h3>Available Rooms for {selectedRoomCard?.title}</h3>
                  <p>View and select one room. Selected rooms are highlighted in green.</p>
                </div>
                
                {loadingRooms ? (
                  <div style={{ padding: '20px', color: '#666' }}>Loading room details...</div>
                ) : (
                  <div className="room-details-table">
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead>
                        <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #dee2e6' }}>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Room No</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Floor</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Capacity</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Price/Night</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Bed Type</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>View</th>
                          <th style={{ padding: '12px', textAlign: 'left', fontWeight: 'bold' }}>Status</th>
                          <th style={{ padding: '12px', textAlign: 'center', fontWeight: 'bold' }}>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allRooms
                          .filter(matchesRoomType)
                          .map((room) => {
                            const isBooked = (reservedRooms[booking.roomType] || []).includes(String(room.roomNo));
                            const isSelected = booking.selectedRoom === String(room.roomNo);
                            return (
                              <tr key={room._id || room.id} style={{ borderBottom: '1px solid #dee2e6', backgroundColor: isSelected ? '#e8f5e9' : 'white' }}>
                                <td style={{ padding: '12px', fontWeight: 'bold' }}>{room.roomNo}</td>
                                <td style={{ padding: '12px' }}>{room.floor}</td>
                                <td style={{ padding: '12px' }}>{room.capacity}</td>
                                <td style={{ padding: '12px' }}>Rs. {room.price}</td>
                                <td style={{ padding: '12px' }}>{room.bedType}</td>
                                <td style={{ padding: '12px' }}>{room.viewType}</td>
                                <td style={{ padding: '12px' }}>
                                  <span style={{
                                    padding: '4px 8px',
                                    backgroundColor: isBooked ? '#f8d7da' : '#d4edda',
                                    color: isBooked ? '#721c24' : '#155724',
                                    borderRadius: '3px',
                                    fontSize: '12px',
                                    fontWeight: 'bold'
                                  }}>
                                    {isBooked ? 'Booked' : 'Available'}
                                  </span>
                                </td>
                                <td style={{ padding: '12px', textAlign: 'center' }}>
                                  <button
                                    type="button"
                                    onClick={() => handleRoomSelect(String(room.roomNo))}
                                    disabled={isBooked}
                                    style={{
                                      backgroundColor: isSelected ? '#28a745' : isBooked ? '#ccc' : '#007bff',
                                      color: 'white',
                                      border: 'none',
                                      padding: '6px 12px',
                                      borderRadius: '3px',
                                      cursor: isBooked ? 'not-allowed' : 'pointer',
                                      opacity: isBooked ? 0.5 : 1,
                                      fontWeight: isSelected ? 'bold' : 'normal'
                                    }}
                                    title={isBooked ? 'This room is booked' : 'Select this room'}
                                  >
                                    {isSelected ? '✓ Selected' : 'Select'}
                                  </button>
                                </td>
                              </tr>
                            )
                          })}
                      </tbody>
                    </table>
                  </div>
                )}
                
                <p className="room-check-note">
                  Total Rooms: {allRooms.filter(matchesRoomType).length} | Available: {allRooms.filter((room) => matchesRoomType(room) && !(reservedRooms[booking.roomType] || []).includes(String(room.roomNo))).length}
                </p>
              </div>
            </div>
          )}

          {activeStep === "check-room" && (
            <>
              <div className="col-12">
                <label htmlFor="guestName" className="heading-label">Full Name</label>
                <input
                  id="guestName"
                  type="text"
                  className="form-control"
                  placeholder="Full name"
                  name="guestName"
                  value={booking.guestName}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="email" className="heading-label">Email Address</label>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="you@example.com"
                  name="email"
                  value={booking.email}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="phone" className="heading-label">Contact Number</label>
                <input
                  id="phone"
                  type="text"
                  className="form-control"
                  placeholder="e.g. +92 322 7799 006"
                  name="phone"
                  value={booking.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12">
                <label htmlFor="address" className="heading-label">Address</label>
                <input
                  id="address"
                  type="text"
                  className="form-control"
                  placeholder="Your address"
                  name="address"
                  value={booking.address}
                  onChange={handleChange}
                />
              </div>

              <div className="col-12 col-md-6">
                <label htmlFor="paymentMethod" className="heading-label">Payment Method</label>
                <select
                  id="paymentMethod"
                  className="form-control"
                  name="paymentMethod"
                  value={booking.paymentMethod}
                  onChange={handleChange}
                >
                  <option value="Pay in Office">Pay in Office</option>
                  <option value="Card Payment">Card Payment</option>
                </select>
              </div>

              <div className="col-12 payment-summary">
                <p>Subtotal ({nights} nights): Rs. {totalRate}</p>
                <p>GST (5%): Rs. {gstAmount}</p>
                <p className="payment-total">
                  Total payment: Rs. {totalAmount}
                </p>
                {booking.paymentMethod === "Pay in Office" && (
                  <p className="payment-note">You will pay the total amount at the office on arrival.</p>
                )}
              </div>

              {booking.paymentMethod === "Card Payment" && (
                <>
                  <div className="col-12 card-payment-card">
                    <div className="card-payment-header-row">
                      <h4>Card Payment Details</h4>
                      <div className="card-icons">
                        <span>VISA</span>
                        <span>MASTERCARD</span>
                        <span>ALL WORLD</span>
                      </div>
                    </div>

                    <div className="card-payment-grid">
                      <div className="col-12">
                        <label className="heading-label">Card Holder Name</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cardName"
                          value={booking.cardName}
                          onChange={handleChange}
                          placeholder="Card Holder Name"
                        />
                      </div>

                      <div className="col-12">
                        <label className="heading-label">Card Number</label>
                        <div className="card-number-group">
                          <input
                            type="text"
                            className="form-control card-number-input"
                            name="cardNumber"
                            value={booking.cardNumber}
                            onChange={handleChange}
                            placeholder="1234 5678 9012 3456"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="heading-label">MM/YY</label>
                        <div className="card-expiry-group">
                          <input
                            type="text"
                            className="form-control"
                            name="expiryMonth"
                            value={booking.expiryMonth}
                            onChange={handleChange}
                            placeholder="MM"
                          />
                          <input
                            type="text"
                            className="form-control"
                            name="expiryYear"
                            value={booking.expiryYear}
                            onChange={handleChange}
                            placeholder="YY"
                          />
                        </div>
                      </div>

                      <div className="col-md-4">
                        <label className="heading-label">CVV</label>
                        <input
                          type="text"
                          className="form-control"
                          name="cvv"
                          value={booking.cvv}
                          onChange={handleChange}
                          placeholder="123"
                        />
                      </div>

                      <div className="col-12 card-save-wrap">
                        <div className="save-card-row">
                          <label className="save-card-label">
                            <input
                              type="checkbox"
                              id="saveCard"
                              name="saveCard"
                              checked={booking.saveCard || false}
                              onChange={(e) =>
                                setBooking((prev) => ({ ...prev, saveCard: e.target.checked }))
                              }
                            />
                            Save Payment Method?
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </>
          )}
        </div>

        {error && <div className="booking-error-message mt-3">{error}</div>}
        {saved && <div className="booking-saved-message mt-3">{saved}</div>}

        <div className="booking-action-row">
          {activeStep === "details" ? (
            <button type="button" className="btn btn-dark mt-4 px-5" onClick={handleNextStep}>
              Continue to Check Room
            </button>
          ) : (
            <>
              <button type="button" className="btn btn-outline-dark mt-4 me-3" onClick={handleBackStep}>
                Back
              </button>
              <button type="submit" className="btn btn-dark mt-4 px-5">
                Submit Booking
              </button>
            </>
          )}
        </div>
      </form>

      {showModal && (
        <div className="booking-modal-overlay">
          <div className="booking-modal">
            <h3>Booking Status</h3>
            <p>{modalMessage}</p>
            <button className="btn btn-dark" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingComponent;
