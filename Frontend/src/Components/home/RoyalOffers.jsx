import React, { useState, useEffect } from "react"
import AOS from "aos"
import "aos/dist/aos.css"
import "./RoyalOffers.css"
import homep4 from "../../assets/Mediacenter/Home/homep4.PNG"
import axios from "axios"

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const RoyalOffers = () => {
  const [offersList, setOffersList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    AOS.init({ duration: 1200, once: true })

    const loadActiveOffers = async () => {
      try {
        setLoading(true)
        const res = await axios.get(`${API_BASE_URL}/offers`)
        const allOffers = res.data || []

        const activeCampaigns = allOffers.filter(
          (offer) => offer.status?.toLowerCase() === "active"
        )
        setOffersList(activeCampaigns)
      } catch (err) {
        console.error("Failed connecting to luxury promotion records:", err)
      } finally {
        setLoading(false)
      }
    }

    loadActiveOffers()
  }, [])

  if (loading) {
    return (
      <div style={{ padding: "120px", textTransform: "uppercase", letterSpacing: "2px", textAlign: "center", color: "#bf9b30", fontWeight: "bold" }}>
        Loading Royal Experiences...
      </div>
    )
  }

  return (
    <section className="royal-offers py-5">
      <div className="container" data-aos="fade-up">
        <div className="text-center mb-4">
          <h2 className="section-title" data-aos="fade-down" data-aos-delay="200" style={{ color: '#b76e03', fontSize: '2.2rem', fontWeight: 700 }}>
            Royal Offers
          </h2>
          <p className="section-description mx-auto mb-4" data-aos="fade-down" data-aos-delay="400" style={{ maxWidth: 800, color: '#555' }}>
            Indulge in exclusive royal offers at Mughal Mahal. Experience luxury dining with exquisite cuisine and premium hospitality.
          </p>
        </div>

        <div className="row align-items-start">
          <div className="col-md-8">
            <ul className="offer-list" style={{ lineHeight: 1.8, color: "#333" }}>
              <li>Mughal Mahal hotel invites you to a world of privileges and benefits which ideally blends with your persona and style.</li>
              <li>15% Discount on Lunch.</li>
              <li>10% Discount on Dinner.</li>
              <li>15% Discount on your Anniversary and Birthday.</li>
              <li>15% Discount for Corporate Clients.</li>
              <li>After every 10 transactions get a free 2 pound Cake for your Family.</li>
              <li>On spending of every Rs 1,000 get 50 points for Red Box Cafe (points redeemable at Red Box Cafe).</li>
              <li>Priority Invitation to special events and promotions.</li>
            </ul>

            <p style={{ marginTop: 16, color: '#333' }}>
              Be the first to Experience Royalty to an array of ongoing activities planned around the year at Mughal Mahal Hotel including an invitation to sales promotions, business conferences, special occasions celebrations, food shows, exhibitions, Royal Events, etc.
            </p>

            <h6 style={{ marginTop: 20, color: '#b76e03' }}>Terms &amp; Conditions</h6>
            <ul style={{ lineHeight: 1.8, color: '#333' }}>
              <li>Membership fee for Rs 5,000 (one time, non-refundable)</li>
              <li>In case of card theft,/lost or damage the re-issuing fee is Rs 1,000.</li>
              <li>Renewal card policy will be changed accordingly.</li>
              <li>Management has right to change the discount policy at any time without any prior issue.</li>
            </ul>
          </div>

          <div className="col-md-4 text-center">
            <img
              src={homep4}
              alt="Royal Offers"
              className="img-fluid rounded shadow-lg"
              style={{ maxWidth: "100%" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default RoyalOffers