import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { useParams } from "react-router-dom"
import axios from "axios"
import DiningQueryModal from "../home/DiningQueryModal"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"
import DiningTableBookingModal from "../home/DiningTableBookingModal"
import LoginModal from "../LoginModal"
import "./Dining.css"
import din1 from "../../assets/Mediacenter/room/din1.PNG"
import ana1 from "../../assets/Mediacenter/room/ana1.PNG"
import ana2 from "../../assets/Mediacenter/room/ana2.PNG"
import ana3 from "../../assets/Mediacenter/room/ana3.PNG"
import ana4 from "../../assets/Mediacenter/room/ana4.PNG"
import ana5 from "../../assets/Mediacenter/room/ana5.PNG"
import ana6 from "../../assets/Mediacenter/room/ana6.PNG"
import ana7 from "../../assets/Mediacenter/room/ana7.PNG"
import ana8 from "../../assets/Mediacenter/room/ana8.PNG"
import ana9 from "../../assets/Mediacenter/room/ana9.PNG"
import ana10 from "../../assets/Mediacenter/room/ana10.PNG"
import ana11 from "../../assets/Mediacenter/room/ana11.PNG"
import koh1 from "../../assets/Mediacenter/room/koh1.PNG"
import diw1 from "../../assets/Mediacenter/room/diw1.PNG"
import aq1 from "../../assets/Mediacenter/room/aq1.PNG"
import wild1 from "../../assets/Mediacenter/room/wild1.PNG"
import roof1 from "../../assets/Mediacenter/room/roof1.PNG"

const Dining = () => {
  const { slug } = useParams()
  const [loading, setLoading] = useState(true)
  const [activeIndex, setActiveIndex] = useState(0)
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [showTableBookingModal, setShowTableBookingModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const [diningItems, setDiningItems] = useState([])
  const [menuData, setMenuData] = useState([])
  const [tablesData, setTablesData] = useState([])
  const [selectedTableType, setSelectedTableType] = useState(null)
  const [selectedTable, setSelectedTable] = useState(null)
  const [availableTables, setAvailableTables] = useState([])

  const pageInfo = {
    "anarkali": {
      title: "Anarkali",
      description:
        "Discover the rich flavors of royal cuisine at Anarkali Restaurant which promises an unsurpassable dining experience to all its guests. This restaurant will attract you with beautiful paintings and decoration all around. Anarkali is an Ala-Carte Restaurant, which also serves Buffet during the weekend.",
      image: ana1,
      menuImages: [ana2, ana3, ana4],
    },
    "koh-i-noor": {
      title: "Koh-i-Noor",
      description:
        "Located on the lobby level, Koh I Noor serves lavish buffet at dinner on weekends, along with a choice of a la carte menu both lunch and dinner. The buffet contains Mughlai, Pakistani, Continental, Chinese, B.B.Q and a range of desserts and salads. Special themed nights are also celebrated at the restaurant. A traditional Mughlai ambiance awaits you as you enter this exotically decorated restaurant, with Mughal era paintings on the wall, along with scenic views of the hotel spectacular fountains have always been breathtaking.",
      image: koh1,
      menuImages: [ana5, ana6, ana7],
    },
    "diwan-e-khas": {
      title: "Diwan-e-Khas",
      description:
        "A newly constructed hall which is beautifully decorated with colors at the ceiling and all around, providing extraordinary peaceful and comfortable environment. This restaurant is famous for private gatherings and events.",
      image: diw1,
      menuImages: [ana8, ana9, ana10],
    },
    "little-china": {
      title: "Little China",
      description:
        "Located at the lobby level on the left side of the Hotel. Chinese themed based restaurant for our guests with exclusive Chinese setup, furniture, and ambiance. Mostly used for gatherings like Engagement, Birthday, Conference, anniversary celebrations and family Get together.\n\nLittle China has its own crafted buffet menu for meeting all your sweet desires.",
      image: aq1,
      menuImages: [ana11, ana2, ana3],
    },
    "wild-safar": {
      title: "Wild Safar",
      description:
        "To Be found at the Lobby level on right side of the hotel. Jungle themed hall, gives you the feel like an African safari. This hall has will take your event excitement to the next level. A restaurant which relives the era of wild safari as it is decorated with marvelous paintings of scenic animals on wall and beautiful trees. Wild safari is best for Birthday events, engagement and family get-together. Choose from a range of multi cuisine buffet menu.",
      image: wild1,
      menuImages: [ana4, ana5, ana6],
    },
    "rooftop-buffet": {
      title: "Rooftop Buffet",
      description:
        "Takht-e-Jazaa is the first ever Roof Top in Gujranwala, opening opportunities for unlimited events, parties, concert, buffet lunch/dinner etc. It has live kitchen with beautiful view of building dorms.",
      image: roof1,
      menuImages: [ana7, ana8, ana9],
    },
  }

  const currentPage = slug ? pageInfo[slug] : null

  const handlePrev = () => {
    if (!currentPage) return
    setActiveIndex((current) => (current - 1 + currentPage.menuImages.length) % currentPage.menuImages.length)
  }

  const handleNext = () => {
    if (!currentPage) return
    setActiveIndex((current) => (current + 1) % currentPage.menuImages.length)
  }

  const openQuery = () => {
    const username = localStorage.getItem('bookingUser')
    const profileRaw = localStorage.getItem('bookingUserProfile')
    if (!username) {
      setShowLoginModal(true)
      return
    }
    try { setProfile(profileRaw ? JSON.parse(profileRaw) : null) } catch { setProfile(null) }
    setShowQueryModal(true)
  }

  const handleTableTypeSelect = (tableType) => {
    setSelectedTableType(tableType)
    const available = tableType.tables.filter(t => !t.isBooked)
    setAvailableTables(available)
    setSelectedTable(null)
  }

  const handleTableSelect = (table) => {
    setSelectedTable(table)
  }

  const handleSelectTableButtonClick = () => {
    if (!selectedTable) {
      alert('Please select a table')
      return
    }
    const username = localStorage.getItem('bookingUser')
    const profileRaw = localStorage.getItem('bookingUserProfile')
    if (!username) {
      setShowLoginModal(true)
      return
    }
    try { setProfile(profileRaw ? JSON.parse(profileRaw) : null) } catch { setProfile(null) }
    setShowTableBookingModal(true)
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        // Fetch each item independently to handle partial failures
        try {
          const itemsRes = await axios.get(`${API_BASE_URL}/dinings`)
          setDiningItems(itemsRes.data || [])
        } catch (err) {
          console.error("Failed to load dining items:", err)
        }

        try {
          const menuRes = await axios.get(`${API_BASE_URL}/dining/menu`)
          setMenuData(menuRes.data || [])
        } catch (err) {
          console.error("Failed to load menu:", err)
        }

        try {
          const tablesRes = await axios.get(`${API_BASE_URL}/dining/tables`)
          setTablesData(tablesRes.data || [])
        } catch (err) {
          console.error("Failed to load tables:", err)
        }
      } catch (err) {
        console.error("Error in fetchData:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", textTransform: "uppercase", letterSpacing: "2px", color: "#c9a13a", fontWeight: "bold" }}>
        Preparing Gastronomic Delicacies...
      </div>
    )
  }

  return (
    <div className="dining-page">

      <section className="dining-hero" style={{ backgroundImage: `url(${din1})` }}>
        <motion.div
          className="dining-hero-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Royal Dining
          </motion.h1>
        </motion.div>
      </section>

      {slug && currentPage && (
        <>
          <section className="dining-subpage-section">
            <div className="dining-subpage-content">
              <div className="dining-subpage-text">
                <h2>{currentPage.title}</h2>
                <p>{currentPage.description}</p>
              </div>
              <div className="dining-subpage-image">
                <img src={currentPage.image} alt={currentPage.title} />
              </div>
            </div>
          </section>

          <section className="dining-menu-section">
            <div className="dining-menu-header">
              <h2>Menu</h2>
            </div>
            <div className="dining-slider-wrapper">
              <button className="dining-slider-control prev" onClick={handlePrev}>&lt;</button>
              <div className="dining-slider-item">
                <img src={currentPage.menuImages[activeIndex]} alt={`${currentPage.title} menu ${activeIndex + 1}`} />
              </div>
              <button className="dining-slider-control next" onClick={handleNext}>&gt;</button>
            </div>

            <div className="dining-query-wrap">
              <button className="dining-query-btn" onClick={openQuery}>Query Now</button>
            </div>
            <DiningQueryModal
              show={showQueryModal}
              onClose={() => setShowQueryModal(false)}
              prefill={profile}
              venueOptions={[currentPage?.title || 'Dining Reservation']}
              modalTitle="Dining Booking"
              menuData={menuData}
              formSource="dining-page"
            />
            <DiningTableBookingModal
              show={showTableBookingModal}
              onClose={() => setShowTableBookingModal(false)}
              selectedTableType={selectedTableType}
              selectedTable={selectedTable}
              venueOptions={[currentPage?.title || 'Dining Reservation']}
              menuData={menuData}
              prefill={profile}
            />
            <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={() => { setShowLoginModal(false); setShowTableBookingModal(true); }} />
          </section>

          {/* Table Selection Section */}
          {tablesData.length > 0 && slug !== 'anarkali' && (
            <section className="dining-table-section">
              <div className="dining-table-header">
                <h2>Select Your Table</h2>
              </div>

              <div className="dining-table-types">
                <h3>Step 1: Choose Table Type</h3>
                <div className="table-types-grid">
                  {tablesData.map((tableType) => (
                    <motion.button
                      key={tableType.tableTypeId}
                      className={`table-type-btn ${selectedTableType?.tableTypeId === tableType.tableTypeId ? 'selected' : ''}`}
                      onClick={() => handleTableTypeSelect(tableType)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="table-type-name">{tableType.tableTypeName}</div>
                      <div className="table-capacity">Capacity: {tableType.capacity}</div>
                      <div className="table-count">Available: {tableType.tables.filter(t => !t.isBooked).length}/{tableType.quantity}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {selectedTableType && availableTables.length > 0 && (
                <motion.div
                  className="dining-table-selection"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <h3>Step 2: Select Table Number</h3>
                  <div className="individual-tables-grid">
                    {availableTables.map((table) => (
                      <motion.button
                        key={table.tableNumber}
                        className={`individual-table-btn ${selectedTable?.tableNumber === table.tableNumber ? 'selected' : ''}`}
                        onClick={() => handleTableSelect(table)}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Table {table.tableNumber}
                      </motion.button>
                    ))}
                  </div>

                  {selectedTable && (
                    <div className="table-selection-confirm">
                      <p>
                        Selected: <strong>{selectedTableType.tableTypeName}</strong> - Table <strong>{selectedTable.tableNumber}</strong>
                      </p>
                      <button className="select-table-btn" onClick={handleSelectTableButtonClick}>
                        Proceed with Booking
                      </button>
                    </div>
                  )}
                </motion.div>
              )}

              {selectedTableType && availableTables.length === 0 && (
                <div className="no-tables-message">
                  <p>Sorry, no tables of type {selectedTableType.tableTypeName} are currently available.</p>
                </div>
              )}
            </section>
          )}
        </>
      )}

      {!slug && (
        <motion.section
          className="dining-intro"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2>Exquisite Culinary Experience</h2>
          <p>
            Discover a refined dining experience where traditional Mughlai flavors
            meet modern culinary excellence in an atmosphere of elegance.
          </p>
        </motion.section>
      )}

      {!slug && (
        <section className="dining-list">
          {diningItems.map((item, index) => {
            const itemId = item._id
            const displayTitle = item.itemName
            const displayDesc = item.description

            return (
              <motion.div
                key={itemId || index}
                className={`dining-row ${index % 2 !== 0 ? "reverse" : ""}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
              >
                <div className="dining-content">
                  <span className="dining-line" />
                  <h2>{displayTitle}</h2>
                  <p>{displayDesc}</p>
                  <div className="dining-meta" style={{ marginBottom: "15px", fontStyle: "italic", color: "#888" }}>
                    <p>{item.preparationTime}</p>
                    <p>{item.price}</p>
                    <p>{item.servingSize}</p>
                    <p>{item.calories}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </section>
      )}
    </div>
  )
}

export default Dining