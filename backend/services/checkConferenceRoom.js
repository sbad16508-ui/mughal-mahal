import mongoose from 'mongoose'
import ConferenceRoom from '../models/conferenceRoom.js'

const checkConferenceRooms = async () => {
    try {
        const conferenceRoom = await ConferenceRoom.findOne()

        if (!conferenceRoom) {
            const conferenceRoomOne = new ConferenceRoom({
                name: "Conference Room A",
                capacity: 20,
                layout: "Theater Style",
                price: 100,
                tags: ["WiFi", "Projector", "Whiteboard"],
                status: "Available"
            })
            await conferenceRoomOne.save()
            const conferenceRoomTwo = new ConferenceRoom({
                name: "Conference Room B",
                capacity: 15,
                layout: "Boardroom Style",
                price: 80,
                tags: ["WiFi", "Projector"],
                status: "Available"
            })
            await conferenceRoomTwo.save()
            const conferenceRoomThree = new ConferenceRoom({
                name: "Conference Room C",
                capacity: 10,
                layout: "Classroom Style",
                price: 60,
                tags: ["WiFi", "Projector"],
                status: "Available"
            })
            await conferenceRoomThree.save()
            console.log('Default Conference Rooms Created')
        }
    } catch (error) {
        console.error('Error in ConferenceRoom:', error)
    }
}

export default checkConferenceRooms