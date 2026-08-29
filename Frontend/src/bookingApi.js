import axios from 'axios'

const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:3000/api'

const bookingApi = axios.create({
    baseURL: apiBaseUrl,
    withCredentials: true
})

export default bookingApi
