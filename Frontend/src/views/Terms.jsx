import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";

function Terms() {
  return (
    <>
      <Navbar />
      <main className="page-content" style={{ padding: "120px 20px", minHeight: "70vh", background: "#fdf6e3" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", color: "#1c1b1b" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.6rem", marginBottom: "1rem" }}>Terms & Conditions</h1>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            Welcome to Mughal Mahal Hotel. By using our website and services, you agree to the following terms and conditions.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Use of Website</h2>
          <p style={{ lineHeight: 1.8 }}>
            All content on this website is provided for informational purposes only. You may not reproduce or redistribute content without prior permission.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Reservations and Payments</h2>
          <p style={{ lineHeight: 1.8 }}>
            Reservations made through this website are subject to availability and confirmation. Payments must be completed at the time of booking.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Cancellation Policy</h2>
          <p style={{ lineHeight: 1.8 }}>
            Cancellation terms are defined at the time of booking and may vary depending on the room type or package selected.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Limitation of Liability</h2>
          <p style={{ lineHeight: 1.8 }}>
            Mughal Mahal Hotel is not responsible for any indirect or consequential loss arising from the use of this website.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default Terms;
