import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import Room from '../models/room.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/rooms.json')

const normalizeAmenities = (amenities) => {
    const isString = (input) => typeof input === 'string'
    const isObject = (input) => input && typeof input === 'object'

    const parseJsonString = (input) => {
        if (!isString(input)) return input
        const trimmed = input.trim()
        if (!trimmed) return []
        try {
            return JSON.parse(trimmed)
        } catch (e) {
            if (trimmed.startsWith('"') && trimmed.endsWith('"')) {
                try {
                    return JSON.parse(trimmed)
                } catch (innerError) {
                    // fall through
                }
            }
            const firstIndex = trimmed.indexOf('[')
            if (firstIndex === -1) return input
            let depth = 0
            for (let i = firstIndex; i < trimmed.length; i += 1) {
                const char = trimmed[i]
                if (char === '[') depth += 1
                if (char === ']') {
                    depth -= 1
                    if (depth === 0) {
                        const substring = trimmed.slice(firstIndex, i + 1)
                        try {
                            return JSON.parse(substring)
                        } catch (innerError) {
                            return input
                        }
                    }
                }
            }
            return input
        }
    }

    const cleanStringTokens = (items) => {
        const invalidTokens = new Set(['"', '\\', '[', ']', ',', '{', '}', "'", '`'])
        return items.flatMap((item) => {
            if (typeof item !== 'string') return []
            const trimmed = item.trim()
            if (!trimmed || invalidTokens.has(trimmed)) return []
            if (trimmed.includes(',')) {
                return trimmed.split(',').map((part) => part.trim()).filter(Boolean)
            }
            return [trimmed]
        })
    }

    const deepParse = (value) => {
        let current = value
        let attempts = 0
        while (isString(current) && attempts < 10) {
            const parsed = parseJsonString(current)
            if (parsed === current) break
            current = parsed
            attempts += 1
        }
        return current
    }

    const normalize = (value) => {
        const parsed = deepParse(value)
        if (Array.isArray(parsed)) {
            const items = parsed.flatMap((item) => {
                const normalizedItem = normalize(item)
                return Array.isArray(normalizedItem) ? normalizedItem : [normalizedItem]
            })
            const cleaned = cleanStringTokens(items)
            if (cleaned.length > 0 && cleaned.some((item) => item.length > 1)) {
                return cleaned
            }
            const candidate = items.filter(isString).join('')
            const candidateParsed = deepParse(candidate)
            if (Array.isArray(candidateParsed)) {
                return normalize(candidateParsed)
            }
            return cleaned
        }

        if (isObject(parsed)) {
            return normalize(Object.values(parsed))
        }

        if (isString(parsed)) {
            return parsed.split(',').map((item) => item.trim()).filter(Boolean)
        }

        return []
    }

    return normalize(amenities)
}

const loadFallbackRooms = () => {
    try {
        if (!fs.existsSync(fallbackFile)) {
            const defaultRooms = [
                {
                    _id: 'room-1',
                    roomNo: '101',
                    roomType: 'Deluxe Twin',
                    floor: '1',
                    size: '35 sqm',
                    capacity: 2,
                    price: 14000,
                    bedType: 'Twin',
                    viewType: 'City',
                    description: 'Deluxe Twin room with city view and modern amenities.',
                    amenities: ['WiFi', 'TV', 'Tea/Coffee'],
                    status: 'Available'
                },
                {
                    _id: 'room-2',
                    roomNo: '102',
                    roomType: 'Deluxe King',
                    floor: '1',
                    size: '38 sqm',
                    capacity: 2,
                    price: 14000,
                    bedType: 'King',
                    viewType: 'Garden',
                    description: 'Deluxe King room with garden view and comfortable bedding.',
                    amenities: ['WiFi', 'TV', 'Mini Bar'],
                    status: 'Available'
                },
                {
                    _id: 'room-3',
                    roomNo: '201',
                    roomType: 'Executive Room',
                    floor: '2',
                    size: '40 sqm',
                    capacity: 2,
                    price: 16000,
                    bedType: 'King',
                    viewType: 'City',
                    description: 'Executive Room with work desk and convenient layout.',
                    amenities: ['WiFi', 'TV', 'Work Desk'],
                    status: 'Available'
                },
                {
                    _id: 'room-4',
                    roomNo: '301',
                    roomType: 'Executive Suite',
                    floor: '3',
                    size: '55 sqm',
                    capacity: 2,
                    price: 20000,
                    bedType: 'King',
                    viewType: 'Garden',
                    description: 'Spacious Executive Suite with lounge area.',
                    amenities: ['WiFi', 'TV', 'Living Area'],
                    status: 'Available'
                },
                {
                    _id: 'room-5',
                    roomNo: '401',
                    roomType: 'Premier Suite',
                    floor: '4',
                    size: '70 sqm',
                    capacity: 2,
                    price: 22000,
                    bedType: 'King',
                    viewType: 'Garden',
                    description: 'Premier Suite with premium amenities and extra space.',
                    amenities: ['WiFi', 'TV', 'Mini Bar'],
                    status: 'Available'
                }
            ]
            fs.writeFileSync(fallbackFile, JSON.stringify(defaultRooms, null, 2), 'utf8')
            return defaultRooms
        }
        const raw = fs.readFileSync(fallbackFile, 'utf8')
        const parsed = JSON.parse(raw)
        if (Array.isArray(parsed)) {
            return parsed.map((room) => ({
                ...room,
                amenities: normalizeAmenities(room.amenities)
            }))
        }
        return []
    } catch (error) {
        console.error('Failed to read fallback rooms file:', error.message)
        return []
    }
}

const saveFallbackRooms = (rooms) => {
    try {
        fs.writeFileSync(fallbackFile, JSON.stringify(rooms, null, 2), 'utf8')
    } catch (error) {
        console.error('Failed to write fallback rooms file:', error.message)
    }
}

const usingDatabase = () => mongoose.connection.readyState === 1

export const addRoom = async (req, res) => {
    const { roomNo, roomType, floor, size, capacity, price, bedType, viewType, description, amenities, status } = req.body
    const uploadedFile = req.file ? req.file.filename : null
    const parsedAmenities = normalizeAmenities(amenities)

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const newRoom = {
            _id: `room-${Date.now()}`,
            roomNo,
            roomType,
            floor,
            size,
            capacity,
            price,
            bedType,
            viewType,
            description,
            amenities: parsedAmenities,
            images: uploadedFile ? [uploadedFile] : [],
            status: status || 'Available'
        }
        rooms.unshift(newRoom)
        saveFallbackRooms(rooms)
        return res.status(201).json({ message: 'Room Created', room: newRoom, storedLocally: true })
    }

    try {
        const room = new Room({
            roomNo,
            roomType,
            floor,
            size,
            capacity,
            price,
            bedType,
            viewType,
            description,
            amenities: parsedAmenities,
            images: uploadedFile ? [uploadedFile] : [],
            status
        })
        await room.save()
        return res.status(201).json({ message: 'Room Created' })
    } catch (error) {
        return res.status(400).json({ message: 'Error creating room' })
    }
}

export const getRoom = async (req, res) => {
    const { id } = req.params
    if (!usingDatabase()) {
        const room = loadFallbackRooms().find((item) => item._id === id || item.roomNo === id)
        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }
        return res.status(200).json(room)
    }

    try {
        const room = await Room.findById(id)
        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }
        return res.status(200).json(room)
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching room' })
    }
}

export const getRooms = async (req, res) => {
    if (!usingDatabase()) {
        return res.status(200).json(loadFallbackRooms())
    }

    try {
        const rooms = await Room.find()
        return res.status(200).json(rooms)
    } catch (error) {
        console.error('Error fetching rooms from DB, falling back to JSON:', error.message)
        return res.status(200).json(loadFallbackRooms())
    }
}

export const updateRoom = async (req, res) => {
    const { id } = req.params
    const { roomNo, roomType, floor, size, capacity, price, bedType, viewType, description, amenities, status } = req.body
    const uploadedFile = req.file ? req.file.filename : null

    const parsedAmenities = normalizeAmenities(amenities)

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const index = rooms.findIndex((item) => item._id === id || item.roomNo === id)
        if (index === -1) {
            return res.status(404).json({ message: 'Room not found' })
        }
        rooms[index] = {
            ...rooms[index],
            roomNo,
            roomType,
            floor,
            size,
            capacity,
            price,
            bedType,
            viewType,
            description,
            amenities: parsedAmenities,
            status,
            images: (rooms[index].images || []).slice()
        }
        if (uploadedFile) {
            rooms[index].images.unshift(uploadedFile)
        }
        saveFallbackRooms(rooms)
        return res.status(200).json({ message: 'Room Updated' })
    }

    try {
        const room = await Room.findById(id)
        if (!room) return res.status(404).json({ message: 'Room not found' })
        room.roomNo = roomNo
        room.roomType = roomType
        room.floor = floor
        room.size = size
        room.capacity = capacity
        room.price = price
        room.bedType = bedType
        room.viewType = viewType
        room.description = description
        room.amenities = parsedAmenities
        room.status = status
        room.images = room.images || []
        if (uploadedFile) {
            room.images.unshift(uploadedFile)
        }
        await room.save()
        return res.status(200).json({ message: 'Room Updated' })
    } catch (error) {
        console.error('Error updating room:', error.message)
        return res.status(400).json({ message: 'Error updating room' })
    }
}

export const deleteRoom = async (req, res) => {
    const { id } = req.params

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms().filter((item) => item._id !== id && item.roomNo !== id)
        saveFallbackRooms(rooms)
        return res.status(200).json({ message: 'Room Deleted' })
    }

    try {
        const room = await Room.findByIdAndDelete(id)
        if (!room) {
            return res.status(404).json({ message: 'Room not found' })
        }
        return res.status(200).json({ message: 'Room Deleted' })
    } catch (error) {
        return res.status(400).json({ message: 'Error deleting room' })
    }
}

export const removeRoomImage = async (req, res) => {
    const { id } = req.params
    const { filename } = req.body
    if (!filename) return res.status(400).json({ message: 'Filename required' })

    if (!usingDatabase()) {
        const rooms = loadFallbackRooms()
        const index = rooms.findIndex((item) => item._id === id || item.roomNo === id)
        if (index === -1) return res.status(404).json({ message: 'Room not found' })
        rooms[index].images = (rooms[index].images || []).filter((f) => f !== filename)
        saveFallbackRooms(rooms)
        // try to delete file from uploads if exists
        const filePath = path.join(__dirname, '..', 'uploads', 'rooms', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch (e) {}
        return res.status(200).json({ message: 'Image removed' })
    }

    try {
        const room = await Room.findById(id)
        if (!room) return res.status(404).json({ message: 'Room not found' })
        room.images = (room.images || []).filter((f) => f !== filename)
        await room.save()
        const filePath = path.join(__dirname, '..', 'uploads', 'rooms', filename)
        try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath) } catch (e) {}
        return res.status(200).json({ message: 'Image removed' })
    } catch (error) {
        console.error('Error removing image:', error.message)
        return res.status(400).json({ message: 'Error removing image' })
    }
}