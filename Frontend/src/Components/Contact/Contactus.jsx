import React from "react";
import { motion } from "framer-motion";
import bookingApi from "../../bookingApi";
import MapSection from "../home/MapSection.jsx";
import "./Contactus.css";

const Contactus = () => {
  return (
    <div className="contact-page">
      
      <section className="hero-section">
        <motion.div
          className="hero-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <motion.h1
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          >
            Contact Us
          </motion.h1>
        </motion.div>
      </section>

      
      <section className="form-section">
        <motion.div
          className="contact-container"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
          >
            <h2>Mughal Mahal Hotel</h2>
            <p>
              Experience the luxury of traditional Mughal hospitality in
              Gujranwala. Reach us via the contact form or details below.
            </p>
            <div className="info-list">
              <p>
                <strong>Email:</strong> info@mughalmahal.com
              </p>
              <p>
                <strong>Phone:</strong> +92 300 1234567
              </p>
              <p>
                <strong>Address:</strong> 1 Luxury Ave, Gujranwala, Pakistan
              </p>
            </div>
          </motion.div>

         
          <motion.form
            className="contact-form"
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            onSubmit={async (e) => {
              e.preventDefault()
              const f = e.target
              const name = f.name?.value?.trim()
              const email = f.email?.value?.trim()
              const message = f.message?.value?.trim()
              const honeypot = f.website?.value || ''
              if (!name || !email || !message) return alert('Please complete all fields')
              try {
                await bookingApi.post('/contact', { name, email, message, honeypot })
                alert('Message sent — thank you!')
                f.reset()
              } catch (err) {
                alert(err?.response?.data?.message || 'Send failed')
              }
            }}
          >
            <h3>Send Us a Message</h3>
            <div className="form-group">
              <input type="text" name="name" placeholder=" " required />
              <label>Your Name</label>
            </div>
            <div className="form-group">
              <input type="email" name="email" placeholder=" " required />
              <label>Your Email</label>
            </div>
            <div className="form-group">
              <textarea name="message" placeholder=" " rows={6} required />
              <label>Message</label>
            </div>

            {/* Honeypot field to deter spam bots - keep hidden via CSS */}
            <div style={{ display: 'none' }} aria-hidden>
              <input name="website" type="text" tabIndex={-1} autoComplete="off" />
            </div>

            <motion.button
              type="submit"
              className="submit-btn"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px rgba(201,161,58,0.6)",
              }}
              whileTap={{ scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              Send Message
            </motion.button>
          </motion.form>
        </motion.div>
      </section>

      
      <MapSection />
    </div>
  );
};

export default Contactus;
