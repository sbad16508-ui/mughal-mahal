import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";

function CookiePolicy() {
  return (
    <>
      <Navbar />
      <main className="page-content" style={{ padding: "120px 20px", minHeight: "70vh", background: "#fdf6e3" }}>
        <div className="container" style={{ maxWidth: "1000px", margin: "0 auto", color: "#1c1b1b" }}>
          <h1 style={{ fontFamily: "Playfair Display, serif", fontSize: "2.6rem", marginBottom: "1rem" }}>Cookie Policy</h1>
          <p style={{ lineHeight: 1.8, marginBottom: "1rem" }}>
            This site uses cookies to improve your experience and provide personalized content.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>What Are Cookies?</h2>
          <p style={{ lineHeight: 1.8 }}>
            Cookies are small files stored on your device to remember preferences and activity.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>How We Use Cookies</h2>
          <p style={{ lineHeight: 1.8 }}>
            We use cookies to maintain session state and analyze site usage. We do not use cookies for unauthorized tracking.
          </p>
          <h2 style={{ fontSize: "1.5rem", marginTop: "2rem" }}>Managing Cookies</h2>
          <p style={{ lineHeight: 1.8 }}>
            You can manage or disable cookies through your browser settings, but some functionality may be affected.
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default CookiePolicy;
