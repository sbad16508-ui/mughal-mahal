import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const diningsFilePath = path.join(__dirname, '..', 'data', 'dinings.json')

const loadDiningsFromFile = () => {
    try {
        const data = fs.readFileSync(diningsFilePath, 'utf-8')
        return JSON.parse(data)
    } catch (error) {
        console.error('Error reading dinings.json:', error)
        return []
    }
}

const saveDiningsToFile = (dinings) => {
    try {
        fs.writeFileSync(diningsFilePath, JSON.stringify(dinings, null, 2), 'utf-8')
        return true
    } catch (error) {
        console.error('Error writing dinings.json:', error)
        return false
    }
}

const generateDiningId = () => `dining_${Date.now()}_${Math.floor(Math.random() * 10000)}`

const getBrowseMenuItem = (id) => {
    const match = /^menu_(\d+)_(\d+)$/.exec(id)
    if (!match) return null
    const categoryIndex = diningMenu.findIndex((category) => String(category.categoryId) === match[1])
    const itemIndex = Number(match[2])
    if (categoryIndex === -1 || !diningMenu[categoryIndex]?.items[itemIndex]) return null
    return { categoryIndex, itemIndex }
}

const loadBrowseMenu = () => {
    try {
        const menuPath = path.join(__dirname, '..', 'data', 'diningMenu.json')
        const data = JSON.parse(fs.readFileSync(menuPath, 'utf-8'))
        return data.menu || data
    } catch (error) {
        console.error('Error reading diningMenu.json:', error)
        return []
    }
}

const saveBrowseMenu = (menu) => {
    try {
        const menuPath = path.join(__dirname, '..', 'data', 'diningMenu.json')
        fs.writeFileSync(menuPath, JSON.stringify({ menu }, null, 2), 'utf-8')
        return true
    } catch (error) {
        console.error('Error writing diningMenu.json:', error)
        return false
    }
}

export const addDining = async (req, res) => {
    const { itemName, category, price, preparationTime, servingSize, calories, description, ingredients, allergens, availability } = req.body
    const dinings = loadDiningsFromFile()
    const newDining = {
        _id: generateDiningId(),
        itemName,
        category,
        price: Number(price) || 0,
        preparationTime,
        servingSize,
        calories: Number(calories) || 0,
        description,
        ingredients: Array.isArray(ingredients)
            ? ingredients
            : typeof ingredients === 'string'
            ? ingredients.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
        allergens: Array.isArray(allergens)
            ? allergens
            : typeof allergens === 'string'
            ? allergens.split(',').map((item) => item.trim()).filter(Boolean)
            : [],
        availability: availability || 'available',
        createdAt: new Date().toISOString()
    }

    dinings.push(newDining)

    if (!saveDiningsToFile(dinings)) {
        return res.status(500).json({ message: 'Error saving dining item' })
    }

    return res.status(201).json({ message: 'Dining Created', item: newDining })
}

export const getDining = async (req, res) => {
    const { id } = req.params
    const dinings = loadDiningsFromFile()
    const dining = dinings.find((item) => item._id === id)

    if (!dining) {
        return res.status(404).json({ message: 'Dining item not found' })
    }

    return res.status(200).json(dining)
}

export const getDinings = async (req, res) => {
    const dinings = loadDiningsFromFile()
    return res.status(200).json(dinings)
}

export const updateDining = async (req, res) => {
    const { id } = req.params
    const { itemName, category, price, preparationTime, servingSize, calories, description, ingredients, allergens, availability } = req.body
    const browseItem = getBrowseMenuItem(id)

    if (browseItem) {
        const menu = loadBrowseMenu()
        const item = menu[browseItem.categoryIndex].items[browseItem.itemIndex]
        item.name = itemName ?? item.name
        item.price = price !== undefined ? (Number(price) || 0) : item.price
        if (!saveBrowseMenu(menu)) return res.status(500).json({ message: 'Error updating dining item' })
        return res.status(200).json({ message: 'Dining Updated', item: { ...item, _id: id, itemName: item.name, category: menu[browseItem.categoryIndex].categoryName } })
    }

    const dinings = loadDiningsFromFile()
    const index = dinings.findIndex((item) => item._id === id)

    if (index === -1) {
        return res.status(404).json({ message: 'Dining item not found' })
    }

    dinings[index] = {
        ...dinings[index],
        itemName: itemName ?? dinings[index].itemName,
        category: category ?? dinings[index].category,
        price: price !== undefined ? Number(price) || 0 : dinings[index].price,
        preparationTime: preparationTime ?? dinings[index].preparationTime,
        servingSize: servingSize ?? dinings[index].servingSize,
        calories: calories !== undefined ? Number(calories) || 0 : dinings[index].calories,
        description: description ?? dinings[index].description,
        ingredients: Array.isArray(ingredients)
            ? ingredients
            : typeof ingredients === 'string'
            ? ingredients.split(',').map((item) => item.trim()).filter(Boolean)
            : dinings[index].ingredients,
        allergens: Array.isArray(allergens)
            ? allergens
            : typeof allergens === 'string'
            ? allergens.split(',').map((item) => item.trim()).filter(Boolean)
            : dinings[index].allergens,
        availability: availability || dinings[index].availability
    }

    if (!saveDiningsToFile(dinings)) {
        return res.status(500).json({ message: 'Error updating dining item' })
    }

    return res.status(200).json({ message: 'Dining Updated', item: dinings[index] })
}

export const deleteDining = async (req, res) => {
    const { id } = req.params
    const browseItem = getBrowseMenuItem(id)

    if (browseItem) {
        const menu = loadBrowseMenu()
        menu[browseItem.categoryIndex].items.splice(browseItem.itemIndex, 1)
        if (!saveBrowseMenu(menu)) return res.status(500).json({ message: 'Error deleting dining item' })
        return res.status(200).json({ message: 'Dining Deleted' })
    }

    const dinings = loadDiningsFromFile()
    const index = dinings.findIndex((item) => item._id === id)

    if (index === -1) {
        return res.status(404).json({ message: 'Dining item not found' })
    }

    dinings.splice(index, 1)

    if (!saveDiningsToFile(dinings)) {
        return res.status(500).json({ message: 'Error deleting dining item' })
    }

    return res.status(200).json({ message: 'Dining Deleted' })
}
