import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const diningApi = axios.create({
    baseURL: `${apiBaseUrl}/dining`,
    withCredentials: true
})

export const getDiningMenu = async () => {
    try {
        const response = await diningApi.get('/menu')
        return response.data
    } catch (error) {
        console.error('Error fetching dining menu:', error)
        throw error
    }
}

export const getDiningTables = async () => {
    try {
        const response = await diningApi.get('/tables')
        return response.data
    } catch (error) {
        console.error('Error fetching dining tables:', error)
        throw error
    }
}

export const getTablesByType = async (tableTypeId) => {
    try {
        const response = await diningApi.get(`/tables/${tableTypeId}`)
        return response.data
    } catch (error) {
        console.error('Error fetching table by type:', error)
        throw error
    }
}

export const getAvailableTablesByType = async (tableTypeId) => {
    try {
        const response = await diningApi.get(`/tables/${tableTypeId}/available`)
        return response.data
    } catch (error) {
        console.error('Error fetching available tables:', error)
        throw error
    }
}

export const bookTable = async (tableTypeId, tableNumber) => {
    try {
        const response = await diningApi.post('/tables/book', {
            tableTypeId,
            tableNumber
        })
        return response.data
    } catch (error) {
        console.error('Error booking table:', error)
        throw error
    }
}

export const releaseTable = async (tableTypeId, tableNumber) => {
    try {
        const response = await diningApi.post('/tables/release', {
            tableTypeId,
            tableNumber
        })
        return response.data
    } catch (error) {
        console.error('Error releasing table:', error)
        throw error
    }
}

export default diningApi
