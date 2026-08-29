import mongoose from 'mongoose'
import Banquet from '../models/banquet.js'

const checkBanquetHalls = async () => {
    try {
        const banquet = await Banquet.findOne()

        if (!banquet) {
            const banquetOne = new Banquet({
                name: 'Banquet Hall 1',
                capacity: '100',
                area: '2000 sq ft',
                price: '5000',
                status: 'available',
                tags: ['wedding', 'party']
            })
            await banquetOne.save()
            const banquetTwo = new Banquet({
                name: 'Banquet Hall 2',
                capacity: '200',
                area: '3000 sq ft',
                price: '7500',
                status: 'available',
                tags: ['corporate', 'event']
            })
            await banquetTwo.save()
            const banquetThree = new Banquet({
                name: 'Banquet Hall 3',
                capacity: '400',
                area: '5000 sq ft',
                price: '10000',
                status: 'available',
                tags: ['wedding', 'corporate']
            })
            await banquetThree.save()
            console.log('Default Banquet Halls Created')
        }
    } catch (error) {
        console.error('Error in Banquet:', error)
    }
}

export default checkBanquetHalls