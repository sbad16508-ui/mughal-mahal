import "bootstrap/dist/css/bootstrap.min.css"
import "bootstrap/dist/js/bootstrap.bundle.min.js"
import "./Slider.css"
import { useEffect, useState } from "react"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

export default function Slider() {
  const [roomCategories, setRoomCategories] = useState([])
  const [searchCriteria, setSearchCriteria] = useState({
    checkIn: "",
    checkOut: "",
    adults: "1",
    children: "0",
    roomType: ""
  })

  useEffect(() => {
    const elements = document.querySelectorAll(".animate-on-scroll")

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show")
          }
        })
      },
      { threshold: 0.2 }
    )

    elements.forEach((el) => observer.observe(el))

    const fetchRoomTypes = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/rooms`)
        const uniqueCategories = [...new Set((res.data || []).map(room => room.type || room.category))].filter(Boolean)
        setRoomCategories(uniqueCategories)
      } catch (err) {
        console.error("Error fetching room types for search bar:", err)
      }
    }

    fetchRoomTypes()

    return () => observer.disconnect()
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setSearchCriteria(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (!searchCriteria.checkIn || !searchCriteria.checkOut) {
      alert("Please enter check-in and check-out dates.")
      return
    }

    const queryParams = new URLSearchParams({
      checkIn: searchCriteria.checkIn,
      checkOut: searchCriteria.checkOut,
      adults: searchCriteria.adults,
      children: searchCriteria.children,
      type: searchCriteria.roomType
    }).toString()

    window.location.href = `/rooms?${queryParams}`
  }

  return (
    <>
      <div
        id="heroCarousel"
        className="carousel slide hero-carousel"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner">

          <div className="carousel-item active">
            <img
              src="/src/assets/Mediacenter/home header/home1.PNG"
              className="d-block w-100 hero-img"
              alt="Mughal Mahal - Home 1"
            />

            <div className="hero-text">
              <h1 className="display-3 fw-bold text-animate">
                Premium Experience
              </h1>
              <p className="fs-4 text-animate delay-1">The Real Taste</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/src/assets/Mediacenter/home header/home2.PNG"
              className="d-block w-100 hero-img"
              alt="Mughal Mahal - Home 2"
            />

            <div className="hero-text">
              <h1 className="display-3 fw-bold text-animate">Luxury Living</h1>
              <p className="fs-4 text-animate delay-1">Comfort & Elegance</p>
            </div>
          </div>

          <div className="carousel-item">
            <img
              src="/src/assets/Mediacenter/home header/home3.PNG"
              className="d-block w-100 hero-img"
              alt="Mughal Mahal - Home 3"
            />

            <div className="hero-text">
              <h1 className="display-3 fw-bold text-animate">Conference Hall</h1>
              <p className="fs-4 text-animate delay-1">Be Successful</p>
            </div>
          </div>
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon"></span>
        </button>

        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#heroCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon"></span>
        </button>

        {/* booking form removed from home page per request */}
      </div>
    </>
  )
}