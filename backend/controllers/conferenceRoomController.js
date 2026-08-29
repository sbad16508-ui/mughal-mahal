import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import ConferenceRoom from '../models/conferenceRoom.js';

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/conferenceRooms.json')

const DEFAULT_CONFERENCE_ROOMS = [
  {
    _id: 'conf-room-1',
    name: 'Conference 1',
    capacity: 50,
    layout: 'Boardroom',
    price: 12000,
    tags: ['WiFi', 'Projector'],
    status: 'Available',
  },
  {
    _id: 'conf-room-2',
    name: 'Conference 2',
    capacity: 80,
    layout: 'Theater',
    price: 14000,
    tags: ['WiFi', 'Projector', 'Sound System'],
    status: 'Available',
  },
  {
    _id: 'conf-room-3',
    name: 'Conference 3',
    capacity: 120,
    layout: 'U-shape',
    price: 16000,
    tags: ['WiFi', 'Projector', 'Catering'],
    status: 'Available',
  },
  {
    _id: 'meeting-room-1',
    name: 'Meeting 1',
    capacity: 20,
    layout: 'Boardroom',
    price: 8000,
    tags: ['WiFi', 'Whiteboard'],
    status: 'Available',
  },
  {
    _id: 'meeting-room-2',
    name: 'Meeting 2',
    capacity: 30,
    layout: 'U-shape',
    price: 9000,
    tags: ['WiFi', 'Projector'],
    status: 'Available',
  },
  {
    _id: 'meeting-room-3',
    name: 'Meeting 3',
    capacity: 40,
    layout: 'Theater',
    price: 10000,
    tags: ['WiFi', 'Conference Phone'],
    status: 'Available',
  },
]

const loadFallbackRooms = () => {
  try {
    if (!fs.existsSync(fallbackFile)) {
      fs.writeFileSync(fallbackFile, JSON.stringify(DEFAULT_CONFERENCE_ROOMS, null, 2), 'utf8')
      return DEFAULT_CONFERENCE_ROOMS
    }
    const raw = fs.readFileSync(fallbackFile, 'utf8')
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) && parsed.length ? parsed : DEFAULT_CONFERENCE_ROOMS
  } catch (error) {
    console.error('Failed to read fallback conference rooms file:', error.message)
    return DEFAULT_CONFERENCE_ROOMS
  }
}

const saveFallbackRooms = (rooms) => {
  try {
    fs.writeFileSync(fallbackFile, JSON.stringify(rooms, null, 2), 'utf8')
  } catch (error) {
    console.error('Failed to write fallback conference rooms file:', error.message)
  }
}

const usingDatabase = () => mongoose.connection.readyState === 1

export const addConferenceRoom = async (req, res) => {
    const {
        name,
        capacity,
        layout,
        price,
        tags,
        status
    } = req.body

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const newRoom = {
            _id: `conf-room-${Date.now()}`,
            name,
            capacity,
            layout,
            price,
            tags,
            status
        }
        rooms.push(newRoom)
        saveFallbackRooms(rooms)
        return res.status(201).json({ message: 'Conference Room Created', data: newRoom })
    }

    try {
        const conferenceRoom = new ConferenceRoom({
            name,
            capacity,
            layout,
            price,
            tags,
            status
        })

        await conferenceRoom.save()
        return res.status(201).json({ message: "Conference Room Created" })
    } catch (error) {
        console.error("Create Conference Room Error:", error)
        return res.status(400).json({ message: "Error creating conference room", error: error.message })
    }
}

export const getConferenceRoom = async (req, res) => {
    const { id } = req.params

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const conferenceRoom = rooms.find((room) => room._id === id)
        if (!conferenceRoom) {
            return res.status(404).json({ message: "Conference Room not found" })
        }
        return res.status(200).json(conferenceRoom)
    }

    try {
        const conferenceRoom = await ConferenceRoom.findById(id)
        if (!conferenceRoom) {
            return res.status(404).json({ message: "Conference Room not found" })
        }
        return res.status(200).json(conferenceRoom)
    } catch (error) {
        return res.status(500).json({ message: "Error fetching conference room" })
    }
}

export const getConferenceRooms = async (req, res) => {
    if (!usingDatabase()) {
        return res.status(200).json(loadFallbackRooms())
    }

    try {
        const conferenceRooms = await ConferenceRoom.find()
        return res.status(200).json(conferenceRooms)
    } catch (error) {
        console.error('Error fetching conference rooms:', error)
        return res.status(200).json(loadFallbackRooms())
    }
}

export const updateConferenceRoom = async (req, res) => {
    const { id } = req.params
    const {
        name,
        capacity,
        layout,
        price,
        tags,
        status
    } = req.body

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const index = rooms.findIndex((room) => room._id === id)
        if (index === -1) {
            return res.status(404).json({ message: "Conference Room not found" })
        }
        rooms[index] = {
            ...rooms[index],
            name,
            capacity,
            layout,
            price,
            tags,
            status
        }
        saveFallbackRooms(rooms)
        return res.status(200).json({ message: "Conference Room Updated" })
    }

    try {
        const conferenceRoom = await ConferenceRoom.findByIdAndUpdate(id, {
            name,
            capacity,
            layout,
            price,
            tags,
            status
        })

        if (!conferenceRoom) {
            return res.status(404).json({ message: "Conference Room not found" })
        }
        return res.status(200).json({ message: "Conference Room Updated" })
    } catch (error) {
        console.error("Update Conference Room Error:", error)
        return res.status(400).json({ message: "Error updating conference room" })
    }
}