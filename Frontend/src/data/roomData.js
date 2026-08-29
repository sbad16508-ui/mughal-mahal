import deluxeTwin from "../assets/Mediacenter/room/Deluxe Twin Room - 2 people.PNG"
import deluxeKing from "../assets/Mediacenter/room/Deluxe King Room - 2 people.PNG"
import executiveRoom from "../assets/Mediacenter/room/Executive Room - 2 people.PNG"
import executiveSuite from "../assets/Mediacenter/room/Executive Suite - 2 people.PNG"
import premierSuite from "../assets/Mediacenter/room/Premier Suite - 2 people.PNG"

const roomCards = [
  {
    id: "deluxe-twin-room",
    title: "Deluxe Twin Room - 2 people",
    description: "Deluxe Twin room features 2 twin bed with bedding, a spacious work desk and city view.",
    image: deluxeTwin,
    price: "Rs: 14,000 + Tax / Night",
    roomCount: 10,
  },
  {
    id: "deluxe-king-room",
    title: "Deluxe King Room - 2 people",
    description: "Deluxe King room features 1 king bed with plus bedding, a spacious work desk and garden view.",
    image: deluxeKing,
    price: "Rs: 14,000 + Tax / Night",
    roomCount: 10,
  },
  {
    id: "executive-room",
    title: "Executive Room - 2 people",
    description: "Executive room features 1 king bed with plus bedding, a spacious work desk and city view.",
    image: executiveRoom,
    price: "Rs: 16,000 + Tax / Night",
    roomCount: 10,
  },
  {
    id: "executive-suite",
    title: "Executive Suite - 2 people",
    description: "Executive Suite features spacious 1 king bed with plus bedding and a sitting area with garden view.",
    image: executiveSuite,
    price: "Rs: 20,000 + Tax / Night",
    roomCount: 10,
  },
  {
    id: "premier-suite",
    title: "Premier Suite - 2 people",
    description: "Premier Suite features a king bed with plus bedding and a work desk plus extra room sitting area.",
    image: premierSuite,
    price: "Rs: 22,000 + Tax / Night",
    roomCount: 10,
  },
]

export default roomCards
