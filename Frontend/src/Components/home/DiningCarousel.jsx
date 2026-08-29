import React, { useState, useEffect } from "react";
import { Container, Carousel, Button } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./DiningCarousel.css";
import homep3 from "../../assets/Mediacenter/Home/homep3.PNG";
import DiningQueryModal from "./DiningQueryModal";
import LoginModal from "../LoginModal";
import { getDiningMenu } from "../../diningApi";

const slides = [
  {
    title: "Anarkali",
    subtitle: "Great Food",
    description: "Explore & experience the magical food of Mughal Mahal",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/IMG_0043-768x512.jpg",
  },
  {
    title: "Takht e Jaza",
    subtitle: "Exquisite Dining",
    description: "Discover the unique theme and flavors of Takht e Jaza",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/IMG_3297-768x512.jpg",
  },
  {
    title: "Diwan e Khaas",
    subtitle: "Royal Experience",
    description: "Enjoy premium Mughlai cuisine in Diwan e Khaas",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/Dawat-e-Khaas-2.jpg",
  },
  {
    title: "Kohi Noor",
    subtitle: "Elegant Atmosphere",
    description: "Dine under luxurious themes in Kohi Noor",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/Koh-e-Noor-3.jpg",
  },
  {
    title: "Little China",
    subtitle: "Asian Delights",
    description: "Savor Chinese and Thai delicacies at Little China",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/Little-China-2-768x512.jpg",
  },
  {
    title: "Wild Safari",
    subtitle: "Adventure Dining",
    description: "Experience wild safari themed dining for the whole family",
    image: "https://mughalmahal.pk/wp-content/uploads/2022/07/Wild-Safari-2-768x512.jpg",
  },
];

const DiningCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showQueryModal, setShowQueryModal] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [profile, setProfile] = useState(null)
  const [menuData, setMenuData] = useState([])

  const venueOptions = [
    'Anarkali',
    'Koh-i-Noor',
    'Diwan-e-Khas',
    'Little China',
    'Wild Safar',
    'Rooftop Buffet'
  ]

  useEffect(() => {
    const loadMenu = async () => {
      try {
        const data = await getDiningMenu()
        setMenuData(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error('Failed to load dining menu for homepage query modal:', error)
      }
    }

    loadMenu()
  }, [])

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

  return (
    <section className="luxury-dining-section py-5">
      <Container>
        <Carousel
          activeIndex={activeIndex}
          onSelect={setActiveIndex}
          interval={3500}
          controls={false}
          indicators={false}
          fade
        >
          {slides.map((slide, idx) => (
            <Carousel.Item key={idx}>
              <div
                className="carousel-image"
                style={{ backgroundImage: `url(${homep3})` }}
              >
                <div className="carousel-overlay">
                  <h6 className="carousel-subtitle">{slide.subtitle}</h6>
                  <h2 className="carousel-title">{slide.title}</h2>
                  <p className="carousel-description">{slide.description}</p>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
      <div className="dining-query-wrap">
        <Button onClick={openQuery} variant="warning">Query Now</Button>
      </div>
      <DiningQueryModal
        show={showQueryModal}
        onClose={() => setShowQueryModal(false)}
        prefill={profile}
        venueOptions={venueOptions}
        menuData={menuData}
        modalTitle="Dining Booking"
        formSource="homepage"
      />
      <LoginModal show={showLoginModal} onClose={() => setShowLoginModal(false)} onLogin={() => { setShowLoginModal(false); setShowQueryModal(true); }} />
    </section>
  );
};

export default DiningCarousel;
