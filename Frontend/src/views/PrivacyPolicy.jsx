import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";

function PrivacyPolicy() {
  return (
    <>
      <Navbar />
      <main className="page-content" style={{ padding: "120px 20px", minHeight: "70vh", background: "#fdf6e3" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", color: "#1c1b1b" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.6rem", marginBottom: "1rem" }}>Privacy Policy</h1>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            Mughal Mahal Hotel respects your privacy and is committed to protecting your personal information.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Information Collection</h2>
          <p style={{ lineHeight: 1.8 }}>
            We collect information provided during bookings, inquiries, and newsletter subscriptions.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Use of Information</h2>
          <p style={{ lineHeight: 1.8 }}>
            Personal information is used to process reservations, respond to requests, and improve your experience.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Data Security</h2>
          <p style={{ lineHeight: 1.8 }}>
            We take reasonable measures to protect your data but cannot guarantee absolute security.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Contact Us</h2>
          <p style={{ lineHeight: 1.8 }}>
            For questions about this policy, please contact info@mughalmahal.pk.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default PrivacyPolicy;
