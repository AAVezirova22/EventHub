import { connectToDatabase } from '@/utils/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ message: 'Method not allowed' });
    }

    const { id } = req.query;
    const { db } = await connectToDatabase();

    try {
        const event = await db.collection('events').findOne({ _id: new ObjectId(id) });
        if (!event) {
            return res.status(404).json({ message: 'Event not found' });
        }

        // Add logic to add the user to the event's attendees list
        // For example, you can update the event document with the user's ID

        res.status(200).json({ message: 'Joined event successfully' });
    } catch (error) {
        console.error('Error joining event:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}