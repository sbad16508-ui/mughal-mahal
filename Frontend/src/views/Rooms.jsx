import Rooms from "../Components/Rooms/Rooms.jsx";
import Footer from "../Components/home/Footer.jsx";
import Navbar from "../Components/home/Navbar.jsx";
import { useNavigate } from "react-router-dom";

function About() {
  const navigate = useNavigate();
  return (
    <>
      <Navbar />
      <Rooms/>

      <Footer />
    </>
  );
}

export default About;
