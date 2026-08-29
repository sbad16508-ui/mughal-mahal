import Event from '../models/event.js'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { usingDatabase } from './conferenceController.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/events.json')

const loadFallbackEvents = () => {
    try {
        if (!fs.existsSync(fallbackFile)) {
            fs.writeFileSync(fallbackFile, JSON.stringify([], null, 2), 'utf8')
            return []
        }
        const raw = fs.readFileSync(fallbackFile, 'utf8')
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to read fallback events file:', error.message)
        return []
    }
}

const saveFallbackEvents = (items) => {
    try {
        fs.writeFileSync(fallbackFile, JSON.stringify(items, null, 2), 'utf8')
    } catch (error) {
        console.error('Failed to write fallback events file:', error.message)
    }
}

const createFallbackEvent = (data) => {
    const items = loadFallbackEvents()
    const fallback = {
        _id: `${Date.now()}`,
        eventName: data.eventName || '',
        eventType: data.eventType || '',
        banquetHall: data.banquetHall || '',
        eventDate: data.eventDate || null,
        startTime: data.startTime || '',
        endTime: data.endTime || '',
        expectedGuests: Number(data.expectedGuests) || 0,
        contactPerson: data.contactPerson || '',
        email: data.email || '',
        phone: data.phone || '',
        hallRental: data.hallRental || '',
        catering: data.catering || '',
        decoration: data.decoration || '',
        paidAmount: data.paidAmount || 0,
        specialRequests: data.specialRequests || '',
        internalNotes: data.internalNotes || '',
        status: data.status || 'pending',
        createdAt: new Date().toISOString()
    }
    items.unshift(fallback)
    saveFallbackEvents(items)
    return fallback
}

// Create a new event
export const addEvent = async (req, res) => {
    const {
        eventName,
        eventType,
        banquetHall,
        eventDate,
        startTime,
        endTime,
        expectedGuests,
        contactPerson,
        email,
        phone,
        hallRental,
        catering,
        decoration,
        paidAmount,
        specialRequests,
        internalNotes,
        status
    } = req.body

    const payload = {
        eventName,
        eventType,
        banquetHall,
        eventDate,
        startTime,
        endTime,
        expectedGuests,
        contactPerson,
        email,
        phone,
        hallRental,
        catering,
        decoration,
        paidAmount,
        specialRequests,
        internalNotes,
        status
    }

    if (!usingDatabase()) {
        const fallback = createFallbackEvent(payload)
        return res.status(201).json({ message: 'Event Created', event: fallback, storedLocally: true })
    }

    try {
        const event = new Event(payload)

        await event.save()
        return res.status(201).json({ message: "Event Created" })
    } catch (error) {
        console.error("Create Event Error:", error)
        return res.status(400).json({ message: "Error creating event", error: error.message })
    }
}

// Get a single event by ID
export const getEvent = async (req, res) => {
    const { id } = req.params
    if (!usingDatabase()) {
        const item = loadFallbackEvents().find((it) => it._id === id)
        if (!item) return res.status(404).json({ message: 'Event not found' })
        return res.status(200).json(item)
    }

    try {
        const event = await Event.findById(id)
        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }
        return res.status(200).json(event)
    } catch (error) {
        return res.status(500).json({ message: "Error fetching event" })
    }
}

// Get all events
export const getEvents = async (req, res) => {
    if (!usingDatabase()) {
        return res.status(200).json(loadFallbackEvents())
    }

    try {
        const events = await Event.find()
        return res.status(200).json(events)
    } catch (error) {
        console.error('Error fetching events:', error)
        return res.status(200).json(loadFallbackEvents())
    }
}

// Update an existing event
export const updateEvent = async (req, res) => {
    const { id } = req.params
    console.log('updateEvent called for id=', id, 'body=', JSON.stringify(req.body).slice(0,200))
    const {
        eventName,
        eventType,
        banquetHall,
        eventDate,
        startTime,
        endTime,
        expectedGuests,
        contactPerson,
        email,
        phone,
        hallRental,
        catering,
        decoration,
        paidAmount,
        specialRequests,
        internalNotes,
        status
    } = req.body

    const updatePayload = {}
    ;[ 'eventName','eventType','banquetHall','eventDate','startTime','endTime','expectedGuests','contactPerson','email','phone','hallRental','catering','decoration','paidAmount','specialRequests','internalNotes','status' ].forEach((f) => {
        if (req.body[f] !== undefined) updatePayload[f] = req.body[f]
    })

    if (!usingDatabase()) {
        const items = loadFallbackEvents()
        const index = items.findIndex((it) => it._id === id)
        if (index === -1) return res.status(404).json({ message: 'Event not found' })
        items[index] = { ...items[index], ...updatePayload }
        saveFallbackEvents(items)
        return res.status(200).json({ message: 'Event Updated' })
    }

    try {
        const event = await Event.findByIdAndUpdate(id, updatePayload, { new: true })

        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }
        return res.status(200).json({ message: "Event Updated" })
    } catch (error) {
        console.error("Update Event Error:", error)
        return res.status(400).json({ message: "Error updating event" })
    }
}

// Delete a event
export const deleteEvent = async (req, res) => {
    const { id } = req.params
    if (!usingDatabase()) {
        const items = loadFallbackEvents()
        const index = items.findIndex((it) => it._id === id)
        if (index === -1) return res.status(404).json({ message: 'Event not found' })
        items.splice(index, 1)
        saveFallbackEvents(items)
        return res.status(200).json({ message: 'Event Deleted Locally' })
    }

    try {
        const event = await Event.findByIdAndDelete(id)
        if (!event) {
            return res.status(404).json({ message: "Event not found" })
        }
        return res.status(200).json({ message: "Event Deleted" })
    } catch (error) {
        return res.status(400).json({ message: "Error deleting event" })
    }
}