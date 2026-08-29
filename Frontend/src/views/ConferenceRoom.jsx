import ConferenceRoom from "../Components/ConferenceRoom/ConferenceRoom.jsx";
import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();

  const handleBookNow = () => {
    const navBtn = document.getElementById("bookNowButton");
    if (navBtn) {
      navBtn.click();
      return;
    }
    if (!localStorage.getItem("bookingUser")) {
      alert("Please Login to Book");
      return;
    }
    navigate("/book-now");
  };

  return (
    <>
      <Navbar />
      <ConferenceRoom />


      <Footer />
    </>
  );
}

export default About;
