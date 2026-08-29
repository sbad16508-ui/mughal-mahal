import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { FaUsers, FaConciergeBell, FaBed, FaMoneyBillWave, FaUtensils, FaBoxOpen } from "react-icons/fa"
import api from "../../api"

const Dashboard = () => {
  const [dashboardData, setDashboardData] = useState({
    totalRooms: 0,
    occupiedRoomsCount: 0,
    roomBookingsCount: 0,
    diningQueriesCount: 0,
    redboxOrdersCount: 0,
    banquetBookingsCount: 0,
    conferenceBookingsCount: 0,
    totalSales: 0,
    diningRevenue: 0,
    recentBookingsList: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardInformation = async () => {
      try {
        setLoading(true)

        const [roomsRes, bookingsRes, conferencesRes, diningQueriesRes, banquetRes, redboxRes] = await Promise.all([
          api.get("/rooms"),
          api.get("/bookings"),
          api.get("/conferences"),
          api.get("/dining-queries"),
          api.get("/booking/banquet-bookings"),
          api.get("/redbox-orders")
        ])

        const liveRooms = Array.isArray(roomsRes.data) ? roomsRes.data : []
        const liveBookings = Array.isArray(bookingsRes.data) ? bookingsRes.data : []
        const liveConferences = Array.isArray(conferencesRes.data) ? conferencesRes.data : []
        const diningQueries = Array.isArray(diningQueriesRes.data) ? diningQueriesRes.data : []
        const banquetBookings = Array.isArray(banquetRes.data) ? banquetRes.data : []
        const redboxOrders = Array.isArray(redboxRes.data) ? redboxRes.data : []

        const totalRoomsCalculated = 50
        const occupiedRooms = liveBookings.filter((booking) =>
          ((booking.status || 'pending').toString().toLowerCase() === 'confirmed') &&
          ((booking.bookingType || 'room').toString().toLowerCase() === 'room')
        ).length

        const roomRevenue = liveBookings.reduce((sum, b) => sum + Number(b.totalAmount || b.paidAmount || 0), 0)
        const diningRevenue = diningQueries.reduce((sum, query) => sum + Number(query.totalAmount || 0), 0)
        const redboxRevenue = redboxOrders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0)
        const banquetRevenue = banquetBookings.reduce((sum, b) => sum + Number(b.price || b.totalAmount || 0), 0)
        const conferenceRevenue = liveConferences.reduce((sum, c) => sum + Number(c.pricingBreakdown?.totalAmount || c.totalAmount || 0), 0)
        const totalSalesAmount = roomRevenue + diningRevenue + redboxRevenue + banquetRevenue + conferenceRevenue

        setDashboardData({
          totalRooms: totalRoomsCalculated,
          occupiedRoomsCount: occupiedRooms,
          roomBookingsCount: liveBookings.length,
          diningQueriesCount: diningQueries.length,
          redboxOrdersCount: redboxOrders.length,
          banquetBookingsCount: banquetBookings.length,
          conferenceBookingsCount: liveConferences.length,
          totalSales: totalSalesAmount,
          recentBookingsList: liveBookings.slice(-5).reverse(),
          roomRevenue,
          diningRevenue,
          redboxRevenue,
          banquetRevenue,
          conferenceRevenue
        })

      } catch (err) {
        console.error("Transmission breakdown syncing master management panel:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardInformation()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "1px", textAlign: "center", color: "#666", fontWeight: "bold" }}>
        Syncing dashboard workspace metrics...
      </div>
    )
  }

  const occupancyPercentage = Math.round((dashboardData.occupiedRoomsCount / dashboardData.totalRooms) * 100) || 0

  const totalSalesValue = dashboardData.totalSales
    ? `PKR ${dashboardData.totalSales.toLocaleString('en-IN')}`
    : "PKR 0"

  const statsLayout = [
    { title: "Rooms", value: dashboardData.roomBookingsCount, icon: <FaBed /> },
    { title: "Dining", value: dashboardData.diningQueriesCount, icon: <FaConciergeBell /> },
    { title: "Redbox", value: dashboardData.redboxOrdersCount, icon: <FaUsers /> },
    { title: "Banquet", value: dashboardData.banquetBookingsCount, icon: <FaUtensils /> },
    { title: "Conference Room", value: dashboardData.conferenceBookingsCount, icon: <FaBoxOpen /> },
    {
      title: "Total Sales",
      value: totalSalesValue,
      icon: <FaMoneyBillWave />
    }
  ]

  return (
    <div className="container-fluid dashboard-page p-4">
      <motion.div
        className="dashboard-header mb-4"
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="dashboard-title">Dashboard Overview</h2>
        <p className="dashboard-subtitle">
          Welcome back! Here's what's happening at <strong>Mughal Mehal</strong> today.
        </p>
      </motion.div>

      <div className="row">
        {statsLayout.map((item, i) => (
          <motion.div
            className="col-xl-3 col-md-6 mb-4"
            key={i}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 }}
          >
            <div className="stat-card">
              <div className="stat-icon">{item.icon}</div>
              <div className="stat-info">
                <p className="stat-title">{item.title}</p>
                <h3 className="stat-value">{item.value}</h3>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="row mt-2">

        <div className="col-lg-8 mb-4">
          <motion.div
            className="card luxury-card h-100"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
          >
            <div className="card-header-custom">
              <h5>Recent Bookings</h5>
              <span className="card-subtext">Latest guest reservations</span>
            </div>

            <table className="table table-borderless align-middle mt-3">
              <thead>
                <tr>
                  <th>Guest Name</th>
                  <th>Room Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentBookingsList.map((booking) => (
                  <tr key={booking._id || booking.id}>
                    <td><strong>{booking.guestName || booking.contactPerson || "Valued Customer"}</strong></td>
                    <td>{booking.roomType || booking.eventType || "Standard"}</td>
                    <td>
                      <span className={`status ${(booking.status || "pending").toLowerCase()}`}>
                        {booking.status || "Pending"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {dashboardData.recentBookingsList.length === 0 && (
              <div style={{ textAlign: "center", padding: "20px", color: "#aaa" }}>
                No database reservation activities found.
              </div>
            )}
          </motion.div>
        </div>

        <div className="col-lg-4 mb-4">
          <motion.div
            className="card luxury-card h-100 text-center"
            initial={{ opacity: 0, x: 25 }}
            whileInView={{ opacity: 1, x: 0 }}
          >
            <div className="card-header-custom">
              <h5>Room Occupancy</h5>
              <span className="card-subtext">Current utilization</span>
            </div>

            <div className="progress-circle" style={{ background: `conic-gradient(#bf9b30 ${occupancyPercentage}%, #eee ${occupancyPercentage}% 100%)` }}>
              <span>{occupancyPercentage}%</span>
            </div>

            <p className="occupancy-text mt-3">
              {dashboardData.occupiedRoomsCount} of {dashboardData.totalRooms} rooms currently occupied
            </p>
          </motion.div>
        </div>

      </div>
    </div>
  )
}

export default Dashboard