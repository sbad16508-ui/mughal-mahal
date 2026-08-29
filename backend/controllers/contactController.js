import Contact from '../models/contact.js'

export const addContact = async (req, res) => {
  try {
    const { name, email, message, honeypot } = req.body

    // simple honeypot spam prevention
    if (honeypot) {
      return res.status(400).json({ message: 'Spam detected' })
    }

    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress
    const userAgent = req.get('User-Agent') || ''

    const contact = await Contact.create({ name, email, message, ipAddress, userAgent })
    res.status(201).json({ message: 'Contact submitted', contact })
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}

export const getContacts = async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 })
    res.json(contacts)
  } catch (err) {
    res.status(500).json({ message: err.message })
  }
}
