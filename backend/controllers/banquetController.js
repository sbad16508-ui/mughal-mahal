import Banquet from '../models/Banquet.js';

export const addBanquet = async (req, res) => {
    const {
        name,
        capacity,
        area,
        price,
        status,
        tags
    } = req.body

    try {
        const banquet = new Banquet({
            name,
            capacity,
            area,
            price,
            status,
            tags
        })

        await banquet.save()
        return res.status(201).json({ message: "Banquet Created" })
    } catch (error) {
        console.error("Create Banquet Error:", error)
        return res.status(400).json({ message: "Error creating banquet", error: error.message })
    }
}

export const getBanquet = async (req, res) => {
    const { id } = req.params
    try {
        const banquet = await Banquet.findById(id)
        if (!banquet) {
            return res.status(404).json({ message: "Banquet not found" })
        }
        return res.status(200).json(banquet)
    } catch (error) {
        return res.status(500).json({ message: "Error fetching banquet" })
    }
}

export const getBanquets = async (req, res) => {
    try {
        const banquets = await Banquet.find()
        return res.status(200).json(banquets)
    } catch (error) {
        return res.status(500).json({ message: error.message || "Error fetching banquets" })
    }
}

export const updateBanquet = async (req, res) => {
    const { id } = req.params
    const {
        name,
        capacity,
        area,
        price,
        status,
        tags
    } = req.body

    try {
        const banquet = await Banquet.findByIdAndUpdate(id, {
            name,
            capacity,
            area,
            price,
            status,
            tags
        })

        if (!banquet) {
            return res.status(404).json({ message: "Banquet not found" })
        }
        return res.status(200).json({ message: "Banquet Updated" })
    } catch (error) {
        console.error("Update Banquet Error:", error)
        return res.status(400).json({ message: "Error updating banquet" })
    }
}