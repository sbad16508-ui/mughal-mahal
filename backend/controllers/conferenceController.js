import fs from 'fs'
import path from 'path'
import mongoose from 'mongoose'
import { fileURLToPath } from 'url'
import Conference from '../models/conference.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const fallbackFile = path.join(__dirname, '../data/conferences.json')

const loadFallbackConferenceBookings = () => {
    try {
        if (!fs.existsSync(fallbackFile)) {
            fs.writeFileSync(fallbackFile, JSON.stringify([], null, 2), 'utf8')
            return []
        }
        const raw = fs.readFileSync(fallbackFile, 'utf8')
        const parsed = JSON.parse(raw)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error('Failed to read fallback conferences file:', error.message)
        return []
    }
}

const saveFallbackConferenceBookings = (bookings) => {
    try {
        fs.writeFileSync(fallbackFile, JSON.stringify(bookings, null, 2), 'utf8')
    } catch (error) {
        console.error('Failed to write fallback conferences file:', error.message)
    }
}

let databaseAvailable = false

export const setDatabaseAvailable = (available) => {
    databaseAvailable = available
}

export const usingDatabase = () => databaseAvailable && mongoose.connection.readyState === 1

const createFallbackConferenceBooking = (data) => {
    const bookings = loadFallbackConferenceBookings()
    const fallbackBooking = {
        _id: `${Date.now()}`,
        ...data,
        expectedAttendees: Number(data.expectedAttendees),
        pricingBreakdown: data.pricingBreakdown || {},
        status: data.status || 'pending',
        createdAt: new Date().toISOString()
    }
    bookings.unshift(fallbackBooking)
    saveFallbackConferenceBookings(bookings)
    return fallbackBooking
}

// Create a new conference booking
export const addConferenceBooking = async (req, res) => {
    const {
        organizationName,
        eventType,
        conferenceHallId,
        eventDate,
        startTime,
        endTime,
        expectedAttendees,
        contactPerson,
        email,
        phone,
        pricingBreakdown,
        requirements,
        internalNotes,
        status
    } = req.body

    const payload = {
        organizationName,
        eventType,
        conferenceHallId,
        eventDate,
        startTime,
        endTime,
        expectedAttendees,
        contactPerson,
        email,
        phone,
        pricingBreakdown,
        requirements,
        internalNotes,
        status
    }

    if (!usingDatabase()) {
        const fallbackBooking = createFallbackConferenceBooking(payload)
        return res.status(201).json({ message: 'Booking Created', booking: fallbackBooking, storedLocally: true })
    }

    try {
        const booking = new Conference(payload)
        await booking.save()
        return res.status(201).json({ message: 'Booking Created' })
    } catch (error) {
        console.error('Create Conference Booking Error:', error)

        const isObjectIdError = /Cast to ObjectId failed/.test(error.message)
        if (isObjectIdError) {
            const fallbackBooking = createFallbackConferenceBooking(payload)
            return res.status(201).json({ message: 'Booking Created Locally', booking: fallbackBooking, storedLocally: true })
        }

        return res.status(400).json({ message: 'Error creating conference booking', error: error.message })
    }
}

// Get a single conference booking by ID
export const getConference = async (req, res) => {
    const { id } = req.params

    if (!usingDatabase()) {
        const booking = loadFallbackConferenceBookings().find((item) => item._id === id)
        if (!booking) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        return res.status(200).json(booking)
    }

    try {
        const booking = await Conference.findById(id)
        if (!booking) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        return res.status(200).json(booking)
    } catch (error) {
        return res.status(500).json({ message: "Error fetching conference booking" })
    }
}

// Get all conference bookings
export const getConferences = async (req, res) => {
    if (!usingDatabase()) {
        return res.status(200).json(loadFallbackConferenceBookings())
    }

    try {
        const bookings = await Conference.find().populate('conferenceHallId')
        return res.status(200).json(bookings)
    } catch (error) {
        console.error('Error fetching conference bookings:', error)
        return res.status(200).json(loadFallbackConferenceBookings())
    }
}

// Update an existing conference booking
export const updateConference = async (req, res) => {
    const { id } = req.params
    const allowedFields = [
        'organizationName',
        'eventType',
        'conferenceHallId',
        'eventDate',
        'startTime',
        'endTime',
        'expectedAttendees',
        'contactPerson',
        'email',
        'phone',
        'pricingBreakdown',
        'requirements',
        'internalNotes',
        'status'
    ]

    const updatePayload = {}
    allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
            updatePayload[field] = req.body[field]
        }
    })

    if (!usingDatabase()) {
        const bookings = loadFallbackConferenceBookings()
        const index = bookings.findIndex((item) => item._id === id)
        if (index === -1) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        bookings[index] = {
            ...bookings[index],
            ...updatePayload
        }
        saveFallbackConferenceBookings(bookings)
        return res.status(200).json({ message: "Booking Updated" })
    }

    try {
        const booking = await Conference.findByIdAndUpdate(id, updatePayload, { new: true })

        if (!booking) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        return res.status(200).json({ message: "Booking Updated" })
    } catch (error) {
        console.error("Update Conference Booking Error:", error)
        return res.status(400).json({ message: "Error updating conference booking" })
    }
}

// Delete a conference booking
export const deleteConference = async (req, res) => {
    const { id } = req.params

    if (!usingDatabase()) {
        const bookings = loadFallbackConferenceBookings()
        const index = bookings.findIndex((item) => item._id === id)
        if (index === -1) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        bookings.splice(index, 1)
        saveFallbackConferenceBookings(bookings)
        return res.status(200).json({ message: "Booking Deleted Locally" })
    }

    try {
        const booking = await Conference.findByIdAndDelete(id)
        if (!booking) {
            return res.status(404).json({ message: "Conference booking not found" })
        }
        return res.status(200).json({ message: "Booking Deleted" })
    } catch (error) {
        return res.status(400).json({ message: "Error deleting conference booking" })
    }
}