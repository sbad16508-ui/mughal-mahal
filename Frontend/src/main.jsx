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

import DashboardPage from "./views/admin/DashboardPage"
import AdminRooms from "./views/admin/Rooms"
import AddRoom from "./views/admin/AddRoom"
import RoomDetails from "./views/admin/RoomDetails"
import EditRoom from "./views/admin/EditRoom"
import AdminDining from "./views/admin/Dining"
import ActiveOrders from "./views/admin/ActiveOrders"
import OrderDetails from "./views/admin/OrderDetails"
import AddMenuItem from "./views/admin/AddMenuItem"
import AddOrder from "./views/admin/AddOrder"
import EditMenuItem from "./views/admin/EditMenuItem"
import MenuItemDetails from "./views/admin/MenuItemDetails"
import AdminBanquet from "./views/admin/Banquet"
import EditBanquet from "./views/admin/EditBanquet"
import BanquetSchedule from "./views/admin/BanquetSchedule.jsx"
import AddEvent from "./views/admin/AddEvent"
import EventDetails from "./views/admin/EventDetails"
import EventEdit from "./views/admin/EventEdit"
import AdminConference from "./views/admin/ConferenceRoom"
import ConferenceDetails from "./views/admin/ConferenceDetails";
import EditConference from "./views/admin/EditConference";
import HallDetails from "./views/admin/HallDetails"
import AddConferenceBooking from "./views/admin/AddConferenceBooking"
import Bookings from "./views/admin/Bookings"
import NewBooking from "./views/admin/NewBooking"
import Billing from "./views/admin/Billing"
import InvoiceDetails from "./views/admin/InvoiceDetails"
import AdminRedbox from "./views/admin/AdminRedbox";
import AdminAlerts from './views/admin/AdminAlerts';
import EditInventoryItem from "./views/admin/EditInventoryItem";
import ItemDetails from "./views/admin/ItemDetails";
import Offers from "./views/admin/Offers";
import CreateOffer from "./views/admin/CreateOffer";
import OfferDetails from "./views/admin/OfferDetails";
import EditOffer from "./views/admin/EditOffer";
import Settings from "./views/admin/Settings";
import ContactMessages from "./views/admin/Contacts";
import AdminProfile from "./views/admin/AdminProfile";


import BookingDetails from "./views/admin/BookingDetails"
import EditBooking from "./views/admin/EditBooking"
import Login from "./views/admin/Login"
import AdminEntry from "./views/admin/AdminEntry"
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