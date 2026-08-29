import React from "react";
import Navbar from "../Components/home/Navbar.jsx";
import About from "../Components/home/About.jsx";
import RoomShowcase from "../Components/home/RoomShowcase.jsx";
import LuxurySection from "../Components/home/LuxurySection.jsx";
import DiningSection from "../Components/home/DiningSection.jsx";
import DiningCarousel from "../Components/home/DiningCarousel.jsx";
import LuxuryBanner from "../Components/home/LuxuryBanner.jsx";
import YouTubeSection from "../Components/home/YouTubeSection.jsx";
import MapSection  from "../Components/home/MapSection.jsx";
import RoyalOffers  from "../Components/home/RoyalOffers.jsx";
import NewsletterSection  from "../Components/home/NewsletterSection.jsx";
import Slider from "../Components/home/Slider.jsx";
import Banner from "../Components/home/Banner.jsx";
import Items from "../Components/home/Items.jsx";
import Footer from "../Components/home/Footer.jsx";

function Home() {
  return (
    <>
      <Navbar />
      <Slider />
      <About />
      <RoomShowcase />
      <LuxurySection />
      <DiningSection />
      <DiningCarousel />
      <LuxuryBanner />
      <YouTubeSection />
      <RoyalOffers />
      <MapSection />
      <NewsletterSection />
      <Footer />
    </>
  );
}

export default Home;
