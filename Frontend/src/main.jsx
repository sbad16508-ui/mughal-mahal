import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import 'bootstrap/dist/js/bootstrap.bundle.min.js'

import Home from "./views/Home"
import AboutPage from "./views/About"
import ContactPage from "./views/ContactPage"
import Redbox from "./views/Redbox"
import Rooms from "./views/Rooms"
import ConferenceRoom from "./views/ConferenceRoom"
import Banquet from "./views/Banquet"
import Dining from "./views/Dining"
import Booking from "./views/Booking"
import ProfilePage from "./views/ProfilePage"
import Terms from "./views/Terms"
import PrivacyPolicy from "./views/PrivacyPolicy"
import CookiePolicy from "./views/CookiePolicy"
import RoomDetail from "./views/RoomDetail"
import RoomPage from "./views/RoomPage"
import RoomReservedPage from "./views/RoomReservedPage"

import DashboardPage from "./views/Admin/DashboardPage"
import AdminRooms from "./views/Admin/Rooms"
import AddRoom from "./views/Admin/AddRoom"
import RoomDetails from "./views/Admin/RoomDetails"
import EditRoom from "./views/Admin/EditRoom"
import AdminDining from "./views/Admin/Dining"
import ActiveOrders from "./views/Admin/ActiveOrders"
import OrderDetails from "./views/Admin/OrderDetails"
import AddMenuItem from "./views/Admin/AddMenuItem"
import AddOrder from "./views/Admin/AddOrder"
import EditMenuItem from "./views/Admin/EditMenuItem"
import MenuItemDetails from "./views/Admin/MenuItemDetails"
import AdminBanquet from "./views/Admin/Banquet"
import EditBanquet from "./views/Admin/EditBanquet"
import BanquetSchedule from "./views/Admin/BanquetSchedule.jsx"
import AddEvent from "./views/Admin/AddEvent"
import EventDetails from "./views/Admin/EventDetails"
import EventEdit from "./views/Admin/EventEdit"
import AdminConference from "./views/Admin/ConferenceRoom"
import ConferenceDetails from "./views/Admin/ConferenceDetails";
import EditConference from "./views/Admin/EditConference";
import HallDetails from "./views/Admin/HallDetails"
import AddConferenceBooking from "./views/Admin/AddConferenceBooking"
import Bookings from "./views/Admin/Bookings"
import NewBooking from "./views/Admin/NewBooking"
import Billing from "./views/Admin/Billing"
import InvoiceDetails from "./views/Admin/InvoiceDetails"
import AdminRedbox from "./views/Admin/AdminRedbox";
import AdminAlerts from './views/Admin/AdminAlerts';
import EditInventoryItem from "./views/Admin/EditInventoryItem";
import ItemDetails from "./views/Admin/ItemDetails";
import Offers from "./views/Admin/Offers";
import CreateOffer from "./views/Admin/CreateOffer";
import OfferDetails from "./views/Admin/OfferDetails";
import EditOffer from "./views/Admin/EditOffer";
import Settings from "./views/Admin/Settings";
import ContactMessages from "./views/Admin/Contacts";
import AdminProfile from "./views/Admin/AdminProfile";


import BookingDetails from "./views/Admin/BookingDetails"
import EditBooking from "./views/Admin/EditBooking"
import Login from "./views/Admin/Login"
import AdminEntry from "./views/Admin/AdminEntry"
import ProtectedRoutes from './Components/protectedroutes'
import Sidebar from "./Components/Admin/Sidebar"
import Navbar from "./Components/Admin/Navbar"
import Chatbot from "./Components/Chatbot/Chatbot"
import AdminLayout from "./Components/Admin/AdminLayout";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/redbox" element={<Redbox />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/rooms/:slug" element={<RoomPage />} />
        <Route path="/rooms/reserved/:slug" element={<RoomReservedPage />} />
        <Route path="/conferenceRoom" element={<ConferenceRoom />} />
        <Route path="/banquet" element={<Banquet />} />
        <Route path="/dining" element={<Dining />} />
        <Route path="/dining/:slug" element={<Dining />} />
        <Route path="/book-now" element={<Booking />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/cookie-policy" element={<CookiePolicy />} />

        <Route path="/admin" element={<AdminEntry />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin/*" element={
          <ProtectedRoutes>
            <AdminLayout />
          </ProtectedRoutes>
        }>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="profile" element={<AdminProfile />} />
          <Route path="room" element={<AdminRooms />} />
          <Route path="room/add" element={<AddRoom />} />
          <Route path="room/edit/:id" element={<EditRoom />} />
          <Route path="dining" element={<AdminDining />} />
          <Route path="redbox" element={<AdminRedbox />} />
          <Route path="conference" element={<AdminConference />} />
          <Route path="banquet" element={<AdminBanquet />} />
        </Route>

      </Routes>
      <Chatbot />
    </BrowserRouter>
  </StrictMode>
)