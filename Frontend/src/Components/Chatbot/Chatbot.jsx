import React, { useState, useEffect, useRef } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import "./Chatbot.css"

const knowledgeBase = [
  // HOMEPAGE & GENERAL
  {
    keywords: ["home", "homepage", "main page", "welcome", "hotel", "mughal mahal"],
    text:
      "Welcome to Mughal Mahal Hotel in Gujranwala! We offer luxury rooms, themed dining venues, banquet and conference halls, and seamless online booking. Our homepage features room showcases, dining experiences, royal offers, location maps, and contact details. We blend timeless Mughal hospitality with modern luxury.",
    actions: [{ label: "🏠 Visit Home", path: "/" }],
  },

  // ROOM TYPES - DETAILED
  {
    keywords: ["deluxe twin room", "twin bed"],
    text:
      "🛏️ Deluxe Twin Room - Perfect for 2 guests with 2 comfortable twin beds, plus bedding, spacious work desk, and beautiful city views. Features free Wi-Fi and premium amenities. Price: Rs 14,000 + Tax per night.",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["deluxe king room", "king bed"],
    text:
      "👑 Deluxe King Room - Accommodates 2 guests with 1 king bed with premium plus bedding, spacious work desk, and serene garden views. Includes free Wi-Fi and luxury amenities. Price: Rs 14,000 + Tax per night.",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["executive room"],
    text:
      "✨ Executive Room - Sleeps 2 guests with 1 king bed, premium bedding, spacious work desk, and stunning city views. Designed for comfort with free Wi-Fi and executive amenities. Price: Rs 16,000 + Tax per night.",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["executive suite"],
    text:
      "💎 Executive Suite - Luxury accommodation for 2 with spacious king bed, premium plus bedding, sitting area, and beautiful garden views. Perfect for those seeking extra space and comfort. Price: Rs 20,000 + Tax per night.",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["premier suite"],
    text:
      "👸 Premier Suite - Our most luxurious option for 2 guests featuring king bed, premium bedding, work desk, and extra sitting room area. Experience ultimate comfort and elegance. Price: Rs 22,000 + Tax per night.",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["rooms", "room types", "accommodation", "luxury suite"],
    text:
      "🛏️ Our 5 Room Types:\n\n1️⃣ Deluxe Twin (Rs 14K) - 2 twin beds, city view\n2️⃣ Deluxe King (Rs 14K) - King bed, garden view\n3️⃣ Executive (Rs 16K) - King bed, city view\n4️⃣ Executive Suite (Rs 20K) - King bed + sitting area\n5️⃣ Premier Suite (Rs 22K) - King bed + extra sitting room\n\nAll feature free Wi-Fi, premium bedding, work desks. Choose based on your comfort and budget!",
    actions: [{ label: "📋 View All Rooms", path: "/rooms" }, { label: "🔖 Book Now", path: "/book-now" }],
  },

  // DINING - DETAILED
  {
    keywords: ["anarkali restaurant"],
    text:
      "🍽️ Anarkali - Our ala-carte restaurant with rich royal cuisine and beautiful traditional paintings and decoration. Features traditional Mughlai flavors with weekend buffet service. Experience authentic Mughal dining in an elegant atmosphere.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["koh-i-noor"],
    text:
      "🍽️ Koh-i-Noor - Located at Lobby Level offering lavish weekend buffet dinners and a la carte menu for lunch and dinner. Cuisines: Mughlai, Pakistani, Continental, Chinese, BBQ with desserts and salads. Enjoy scenic fountain displays and special themed nights.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["diwan-e-khas"],
    text:
      "🍽️ Diwan-e-Khas - Beautiful new hall with stunning ceiling decorations, peaceful and comfortable environment. Famous for private gatherings and intimate events. Perfect for special occasions and exclusive dinners.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["little china"],
    text:
      "🍽️ Little China - Lobby Level Left Side Chinese-themed restaurant with exclusive setup. Perfect for engagements, birthdays, conferences, anniversaries, and family gatherings. Features crafted Chinese buffet menu with authentic cuisine.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["wild safar"],
    text:
      "🍽️ Wild Safar - Lobby Level Right Side with jungle/African safari theme and marvelous animal and tree paintings. Ideal for birthdays, engagements, family get-togethers. Offers multi-cuisine buffet menu in a unique themed environment.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["rooftop", "takht-e-jazaa", "buffet"],
    text:
      "🍽️ Rooftop Buffet (Takht-e-Jazaa) - First Rooftop restaurant in Gujranwala with live kitchen and beautiful building views. Perfect for events, parties, concerts, buffet lunch/dinner. Experience dining with panoramic city views and modern culinary excellence.",
    actions: [{ label: "🍴 View Dining", path: "/dining" }],
  },
  {
    keywords: ["dining", "restaurant", "food", "menu", "cuisine"],
    text:
      "🍽️ Our 6 Dining Venues:\n\n1️⃣ Anarkali - Royal ala-carte with Mughlai flavors\n2️⃣ Koh-i-Noor - Lavish buffet & a la carte\n3️⃣ Diwan-e-Khas - Private gatherings\n4️⃣ Little China - Chinese themed\n5️⃣ Wild Safar - Safari themed\n6️⃣ Rooftop Buffet - Panoramic city views\n\nCuisines: Mughlai, Pakistani, Continental, Chinese, Thai, BBQ. Click any restaurant below to learn more!",
    actions: [
      { label: "🍽️ Anarkali", path: "/dining#anarkali" },
      { label: "🍴 Koh-i-Noor", path: "/dining#koh-i-noor" },
      { label: "🏛️ Diwan-e-Khas", path: "/dining#diwan-e-khas" },
      { label: "🥢 Little China", path: "/dining#little-china" },
      { label: "🦁 Wild Safar", path: "/dining#wild-safar" },
      { label: "🏢 Rooftop Buffet", path: "/dining#rooftop" },
    ],
  },

  // BANQUET & EVENTS
  {
    keywords: ["sheesh mahal", "wedding hall"],
    text:
      "💍 Sheesh Mahal - Wedding reception venue with Mughal architectural era design featuring fine dining concept and gold-plated crockery. Includes elegant ballroom spaces and premium event lounges. Perfect for magnificent wedding celebrations.",
    actions: [{ label: "💍 View Banquets", path: "/banquet" }, { label: "🔖 Book Event", path: "/book-now" }],
  },
  {
    keywords: ["husnain hall", "marriage", "soul mate"],
    text:
      "💍 Husnain Hall - Philosophy: 'Marriages are made in heaven, but we arrange them on earth'. Features Pakistani cuisine collection, royal stage setup, exquisite linen, floral arrangements, and complimentary wedding benefits for couples. Create magical soul mate experiences!",
    actions: [{ label: "💍 View Banquets", path: "/banquet" }, { label: "🔖 Book Event", path: "/book-now" }],
  },
  {
    keywords: ["banquet", "wedding", "events", "celebration"],
    text:
      "💍 Our Banquet Services:\n\n🏛️ Sheesh Mahal - Mughal-themed receptions with gold-plated crockery\n🏛️ Husnain Hall - Wedding celebrations with Pakistani cuisine\n\nBoth offer elegant ballroom spaces, premium event lounges, royal stage setups, floral arrangements. Tagline: 'Sheesh Mahal, Truly the Wondrous place for Wedding Dreamers!'",
    actions: [{ label: "💒 View Banquets", path: "/banquet" }, { label: "🔖 Book Event", path: "/book-now" }],
  },

  // CONFERENCE & MEETINGS
  {
    keywords: ["conference room", "meeting room", "business"],
    text:
      "🏢 Conference Room - 'Where business meets elegance'. Refined, professional environment for meetings, seminars, corporate discussions.\n\n✅ Features:\n• High-Speed Wi-Fi\n• Refreshments\n• Executive atmosphere\n• Full air conditioning\n• Multimedia setup\n\nPremium amenities with elegant interiors ensuring productivity and lasting impressions.",
    actions: [{ label: "🏢 View Conference", path: "/conferenceRoom" }, { label: "🔖 Book Now", path: "/book-now" }],
  },

  // REDBOX CAFÉ
  {
    keywords: ["redbox café", "café", "coffee", "juice", "snacks"],
    text:
      "☕ Redbox Café - Contemporary lobby café with vibrant menu.\n\n📋 Menu:\n• Fresh Juices\n• Coffees\n• Pastries\n• Sandwiches\n• Desserts\n\n✅ Amenities: Indoor seating, free Wi-Fi, fresh juices, café snacks. Perfect for unwinding or connecting online!",
    actions: [{ label: "☕ View Redbox", path: "/redbox" }],
  },

  // BOOKING
  {
    keywords: ["book", "booking", "reserve", "reservation", "book now"],
    text:
      "🔖 Booking Process:\n\n1️⃣ Login required\n2️⃣ Select check-in/check-out dates\n3️⃣ Choose number of guests (1-3)\n4️⃣ Select room type\n5️⃣ Enter guest name & contact\n6️⃣ Choose payment method\n\n✅ Auto-calculates: Room rate + Nights + GST (5% tax) = Total\n💬 You'll get instant confirmation!",
    actions: [{ label: "🔖 Book Now", path: "/book-now" }, { label: "📋 View Rooms", path: "/rooms" }],
  },
  {
    keywords: ["payment", "card payment", "pay in office", "gst", "cost"],
    text:
      "💳 Payment Options:\n\n1️⃣ Pay in Office - Pay total on arrival\n2️⃣ Card Payment - Immediate payment\n   • Accepted: VISA, MASTERCARD, ALL WORLD\n   • Fields: Card holder, number, expiry (MM/YY), CVV\n\n✅ System calculates:\n• Nightly rate + Nights = Subtotal\n• Add 5% GST tax = Total amount",
    actions: [{ label: "🔖 Book Now", path: "/book-now" }],
  },
  {
    keywords: ["cancel", "cancellation", "cancel order", "cancel booking", "refund", "cancel reservation"],
    text:
      "❌ Order/Booking Cancellation:\n\nTo cancel your booking or order, please contact our support team directly. Our team will assist you with the cancellation process and provide information about refund policies.\n\n☎️ Phone: 055-4299107\n📱 Mobile: +92 322 7799 006\n📧 Email: info@mughalmahal.pk\n\nOur team is available to help with your cancellation request!",
    actions: [
      { label: "📞 Contact Support", path: "/contact" },
      { label: "📧 Contact Us", path: "/contact" },
    ],
  },

  // CONTACT & LOCATION
  {
    keywords: ["contact", "phone", "email", "address", "reach", "call"],
    text:
      "📞 Contact Mughal Mahal:\n\n☎️ Phone: 055-4299107\n📱 Mobile: +92 322 7799 006\n📧 Email: info@mughalmahal.pk\n📍 Address: Main GT Road, Chan Da Qila, Gujranwala, Pakistan\n\nView our location on map or contact us for more details!",
    actions: [
      { label: "📍 View on Map", path: "/contact" },
      { label: "📧 Contact Us", path: "/contact" },
    ],
  },
  {
    keywords: ["location", "where", "map", "directions", "find us"],
    text:
      "📍 Location: Main GT Road, Chan Da Qila, Gujranwala, Pakistan\n\nMughal Mahal Hotel is conveniently located in the heart of Gujranwala with easy access to main highways and city center. Click below to view our location or contact us!",
    actions: [
      { label: "📍 View Google Map", path: "/contact" },
      { label: "📞 Contact Us", path: "/contact" },
    ],
  },

  // FOOTER & POLICIES
  {
    keywords: ["footer", "terms", "privacy", "cookie", "policy", "copyright"],
    text:
      "📄 Footer Navigation:\n\n📌 Explore: Home, Rooms, About, Contact\n📌 Social Media: Facebook, Twitter, Instagram, YouTube\n📌 Contact Info: Address, Phone, Email, Hotel Logo\n📌 Bottom: Terms, Privacy Policy, Cookie Policy, Copyright © 2024",
    actions: [],
  },
  {
    keywords: ["login", "sign in", "username", "password"],
    text:
      "🔐 Login:\n\n📝 Fields: Username, Password\n\n✅ Password Requirements:\n• Uppercase letters\n• Lowercase letters\n• Numbers\n• Special characters (. @ ! # $ % ^ &)\n\nAccess your profile, bookings, and make reservations!",
    actions: [{ label: "🔐 Login", path: "/admin" }],
  },
  {
    keywords: ["register", "signup", "registration", "create account"],
    text:
      "📝 Registration Process:\n\n1️⃣ Personal Info: First name, Last name, Email, City, Address, Phone\n2️⃣ Profile Image: Optional\n3️⃣ Account: Username, Password (same strength)\n4️⃣ OTP Verification: Check email (10-min timeout)\n5️⃣ Done! Auto-login & start booking!\n\n💾 Your data saved for future bookings.",
    actions: [{ label: "📝 Register", path: "/admin" }, { label: "🔖 Book Now", path: "/book-now" }],
  },

  // GENERAL HELP
  {
    keywords: ["help", "assist", "question", "how do i", "what is"],
    text:
      "🆘 I can help with:\n\n🛏️ Rooms (types, features, prices)\n🍽️ Dining (6 venues with themes)\n💍 Banquets (weddings, events)\n🏢 Conference facilities\n☕ Redbox Café\n🔖 Booking process\n💳 Payment options\n📞 Contact info\n🔐 Login/Registration\n📄 Policies\n\nAsk me anything!",
    actions: [],
  },
  {
    keywords: ["website", "pages", "site", "navigation", "menu"],
    text:
      "🌐 Website Pages:\n\n🏠 Home (hero, about, rooms, dining, offers, map, newsletter)\n🛏️ Rooms (5 luxury types)\n🍽️ Dining (6 restaurants)\n💍 Banquet (wedding halls)\n🏢 Conference\n☕ Redbox\n📧 Contact (form, map, info)\n🔖 Booking (reservation)\n🔐 Login/Register\n📄 Policies (Terms, Privacy, Cookies)",
    actions: [{ label: "🏠 Home", path: "/" }, { label: "🛏️ Rooms", path: "/rooms" }, { label: "🍽️ Dining", path: "/dining" }, { label: "💍 Banquet", path: "/banquet" }],
  },
]

function getBotResponse(text) {
  const normalized = text.toLowerCase()
  
  // Check knowledge base
  for (const entry of knowledgeBase) {
    if (entry.keywords.some((keyword) => normalized.includes(keyword))) {
      return { text: entry.text, actions: entry.actions || [] }
    }
  }

  // Greeting responses
  if (normalized.includes("hello") || normalized.includes("hi") || normalized.includes("hey")) {
    return {
      text: "Hello! 👋 I'm your virtual assistant for Mughal Mahal Hotel. I can help you with information about our rooms, dining venues, banquet halls, conferences, booking process, login/registration, contact details, and everything about our website. What would you like to know?",
      actions: [{ label: "🏠 Home", path: "/" }],
    }
  }

  if (normalized.includes("thank") || normalized.includes("thanks")) {
    return {
      text: "You're welcome! 😊 Feel free to ask if you need any more information about Mughal Mahal Hotel.",
      actions: [],
    }
  }

  // Default response
  return {
    text: "I'm here to assist! I have detailed information about: 🛏️ Rooms (5 types with pricing), 🍽️ Dining (6 themed restaurants), 💍 Banquets (wedding services), 🏢 Conference Room, ☕ Redbox Café, 🔖 Booking process, 💳 Payment methods, 🔐 Login/Registration, 📞 Contact info, 📄 Policies, and all website features. Try asking 'Tell me about rooms', 'How do I book?', 'What dining options?', or 'How to register?'",
    actions: [],
  }
}

const Chatbot = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text: "👋 Hi! I'm your Mughal Mahal virtual assistant. I can help with rooms, dining, banquets, conferences, redbox, booking, login/registration, contact info, and more. What can I tell you?",
      actions: [],
    },
  ])
  const [input, setInput] = useState("")
  const messagesEndRef = useRef(null)

  useEffect(() => {
    if (open && messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, open])

  const handleSend = () => {
    const trimmed = input.trim()
    if (!trimmed) return

    const userMessage = { sender: "user", text: trimmed, actions: [] }
    const response = getBotResponse(trimmed)
    const botMessage = { sender: "bot", text: response.text, actions: response.actions }

    setMessages((current) => [...current, userMessage, botMessage])
    setInput("")
  }

  const handleNavigate = (path) => {
    // Check if login button clicked - open modal instead of navigating
    if (path === "/admin") {
      window.dispatchEvent(new Event("openLoginModal"))
      setOpen(false)
      return
    }
    
    // Check if trying to access booking without login
    if (path === "/book-now") {
      const bookingUser = localStorage.getItem("bookingUser")
      if (!bookingUser) {
        // User not logged in - show message instead of navigating
        const warningMessage = { 
          sender: "bot", 
          text: "🔐 Please login to book now!", 
          actions: [{ label: "🔐 Login", path: "/admin" }] 
        }
        setMessages((current) => [...current, warningMessage])
        return
      }
    }
    navigate(path)
    setOpen(false)
  }

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault()
      handleSend()
    }
  }

  if (location.pathname.startsWith("/admin")) {
    return null
  }

  return (
    <div className={`chatbot-widget ${open ? "open" : "closed"}`}>
      <div className="chatbot-header" onClick={() => setOpen((prev) => !prev)}>
        <span>Chat with us</span>
        <button className="chatbot-toggle-button" type="button">
          {open ? "×" : "💬"}
        </button>
      </div>

      {open && (
        <div className="chatbot-body">
          <div className="chatbot-messages">
            {messages.map((message, index) => (
              <div key={index}>
                <div className={`chatbot-message ${message.sender}`}>
                  <span>{message.text}</span>
                </div>
                {message.actions && message.actions.length > 0 && (
                  <div className="chatbot-actions">
                    {message.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        className="chatbot-action-button"
                        onClick={() => handleNavigate(action.path)}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="chatbot-input-row">
            <textarea
              className="chatbot-input"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your question..."
              rows={1}
            />
            <button className="chatbot-send-button" type="button" onClick={handleSend}>
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default Chatbot
