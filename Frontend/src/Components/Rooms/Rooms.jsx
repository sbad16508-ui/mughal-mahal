import React from "react"
import { motion } from "framer-motion"
import { Link, useNavigate } from "react-router-dom"
import "./Rooms.css"
import deluxeTwin from "../../assets/Mediacenter/room/Deluxe Twin Room - 2 people.PNG"
import deluxeKing from "../../assets/Mediacenter/room/Deluxe King Room - 2 people.PNG"
import executiveRoom from "../../assets/Mediacenter/room/Executive Room - 2 people.PNG"
import executiveSuite from "../../assets/Mediacenter/room/Executive Suite - 2 people.PNG"
import premierSuite from "../../assets/Mediacenter/room/Premier Suite - 2 people.PNG"

const roomCards = [
  {
    title: "Deluxe Twin Room - 2 people",
    description: "Deluxe Twin room features 2 twin bed with bedding, a spacious work desk and come with city view.",
    image: deluxeTwin,
    price: "Rs: 14,000 + Tax / Night",
    slug: "deluxe-twin-room-2-people",
  },
  {
    title: "Deluxe King Room - 2 people",
    description: "Deluxe king room features 1 king bed with plus bedding, a spacious work desk with garden view.",
    image: deluxeKing,
    price: "Rs: 14,000 + Tax / Night",
    slug: "deluxe-king-room-2-people",
  },
  {
    title: "Executive Room - 2 people",
    description: "Executive room features 1 king bed with plus bedding, a spacious work desk with city view.",
    image: executiveRoom,
    price: "Rs: 16,000 + Tax / Night",
    slug: "executive-room-2-people",
  },
  {
    title: "Executive Suite - 2 people",
    description: "Executive suite features spacious 1 king bed with plus bedding and work desk extra room sitting area with garden view.",
    image: executiveSuite,
    price: "Rs: 20,000 + Tax / Night",
    slug: "executive-suite-2-people",
  },
  {
    title: "Premier Suite - 2 people",
    description: "Premier suite features spacious 1 king bed with plus bedding and work desk extra room sitting area with garden view.",
    image: premierSuite,
    price: "Rs: 22,000 + Tax / Night",
    slug: "premier-suite-2-people",
  },
]

const Rooms = () => {
  const navigate = useNavigate()
  
  return (
    <div className="rooms-page">
      <section className="rooms-hero" style={{ backgroundImage: `url(${deluxeKing})` }}>
        <motion.div
          className="rooms-hero-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ y: -40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2 }}
          >
            Our Royal Rooms
          </motion.h1>
        </motion.div>
      </section>

      <section className="rooms-list">
        {roomCards.map((room, index) => (
          <motion.div
            key={room.title}
            className={`room-row ${index % 2 !== 0 ? "reverse" : ""}`}
            initial={{ opacity: 0, y: 60 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.9 }}
          >
            <div className="room-image">
              <img src={room.image} alt={room.title} />
            </div>
            <div className="room-content">
              <h2>{room.title}</h2>
              <p>{room.description}</p>
              <div className="room-bottom-row">
                <button onClick={() => navigate(`/rooms/${room.slug}`)}>
                  View room
                </button>
                <span className="room-price">{room.price}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </section>
    </div>
  )
}

export default Rooms