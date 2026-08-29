import ContactUs from "../Components/Contact/Contactus.jsx";
import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";
import NewsletterSection  from "../Components/home/NewsletterSection.jsx";

function ContactPage() {
  return (
    <>
      <Navbar />
      <ContactUs />
      <NewsletterSection />
      <Footer />
    </>
  );
}

export default ContactPage;