import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import DiningTable from '../models/diningTable.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const menuFilePath = path.join(__dirname, '../data/diningMenu.json')
const tablesFilePath = path.join(__dirname, '../data/diningTables.json')

const loadMenuData = () => {
  try {
    const raw = fs.readFileSync(menuFilePath, 'utf8')
    const data = JSON.parse(raw)
    return data.menu || data
  } catch (err) {
    console.error('Error loading menu data:', err.message)
    return []
  }
}

const loadTablesData = () => {
  try {
    const raw = fs.readFileSync(tablesFilePath, 'utf8')
    return JSON.parse(raw)
  } catch (err) {
    console.error('Error loading tables data:', err.message)
    return []
  }
}

// In-memory data
let diningMenu = loadMenuData()
let diningTables = loadTablesData()

// Get dining menu
export const getDiningMenu = async (req, res) => {
  try {
    res.status(200).json(diningMenu)
  } catch (err) {
    console.error('Error fetching dining menu:', err)
    res.status(500).json({ message: 'Error fetching menu', error: err.message })
  }
}

// Get all dining tables with availability
export const getDiningTables = async (req, res) => {
  try {
    res.status(200).json(diningTables)
  } catch (err) {
    console.error('Error fetching dining tables:', err)
    res.status(500).json({ message: 'Error fetching tables', error: err.message })
  }
}

// Get tables by type
export const getTablesByType = async (req, res) => {
  try {
    const { tableTypeId } = req.params
    const table = diningTables.find(t => t.tableTypeId === tableTypeId)
    
    if (!table) {
      return res.status(404).json({ message: 'Table type not found' })
    }
    
    res.status(200).json(table)
  } catch (err) {
    console.error('Error fetching table type:', err)
    res.status(500).json({ message: 'Error fetching table', error: err.message })
  }
}

// Get available tables of a specific type
export const getAvailableTablesByType = async (req, res) => {
  try {
    const { tableTypeId } = req.params
    const table = diningTables.find(t => t.tableTypeId === tableTypeId)
    
    if (!table) {
      return res.status(404).json({ message: 'Table type not found' })
    }
    
    const availableTables = table.tables.filter(t => !t.isBooked)
    res.status(200).json({
      tableTypeId: table.tableTypeId,
      tableTypeName: table.tableTypeName,
      capacity: table.capacity,
      availableTables: availableTables
    })
  } catch (err) {
    console.error('Error fetching available tables:', err)
    res.status(500).json({ message: 'Error fetching available tables', error: err.message })
  }
}

// Book a table (update booking status)
export const bookTable = async (req, res) => {
  try {
    const { tableTypeId, tableNumber } = req.body
    
    const table = diningTables.find(t => t.tableTypeId === tableTypeId)
    if (!table) {
      return res.status(404).json({ message: 'Table type not found' })
    }
    
    const tableToBook = table.tables.find(t => t.tableNumber === tableNumber)
    if (!tableToBook) {
      return res.status(404).json({ message: 'Table number not found' })
    }
    
    if (tableToBook.isBooked) {
      return res.status(400).json({ message: 'Table is already booked' })
    }
    
    tableToBook.isBooked = true
    res.status(200).json({ message: 'Table booked successfully', table: tableToBook })
  } catch (err) {
    console.error('Error booking table:', err)
    res.status(500).json({ message: 'Error booking table', error: err.message })
  }
}

// Release a table
export const releaseTable = async (req, res) => {
  try {
    const { tableTypeId, tableNumber } = req.body
    
    const table = diningTables.find(t => t.tableTypeId === tableTypeId)
    if (!table) {
      return res.status(404).json({ message: 'Table type not found' })
    }
    
    const tableToRelease = table.tables.find(t => t.tableNumber === tableNumber)
    if (!tableToRelease) {
      return res.status(404).json({ message: 'Table number not found' })
    }
    
    tableToRelease.isBooked = false
    res.status(200).json({ message: 'Table released successfully', table: tableToRelease })
  } catch (err) {
    console.error('Error releasing table:', err)
    res.status(500).json({ message: 'Error releasing table', error: err.message })
  }
}
