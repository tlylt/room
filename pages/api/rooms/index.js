import clientPromise from '../../../lib/mongodb'
import { nanoid } from 'nanoid'
import bcrypt from 'bcryptjs'
const defaultRoom = {
    id: 123,
    name: 'room1',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
        row: 5,
        col: 5,
    }
}

const defaultUser = {
    name: 'guy1',
    row: -1,
    col: -1
}

export default async (req, res) => {
    const client = await clientPromise
    const db = client.db("the_room");
    switch (req.method) {
        case 'GET':
            const rooms = await db
                .collection("rooms")
                .find({}, { projection: { _id: 0 } })
                .sort({ metacritic: -1 })
                .limit(20)
                .toArray();
            const result = rooms.map((room) => {
                delete room.password
                return room
            })
            res.status(200).json(result);
            break
        case 'POST':
            switch (req.body.operation) {
                case 'add':
                    const room = req.body.room
                    const salt = bcrypt.genSaltSync(10);
                    const hash = bcrypt.hashSync(room.password, salt);
                    const id = nanoid(10)
                    const newRoom = { ...defaultRoom, password: hash, id: id, name: room.name }
                    await db.collection('rooms').insertOne(newRoom);
                    res.status(200).json({ status: 'success', id: id });
                    break
                case 'clear':
                    const roomPw = await db.collection('rooms').findOne({ id: req.body.id }, { projection: { password: 1 } })
                    const correctPw = bcrypt.compareSync(req.body.room.password, roomPw.password)
                    if (correctPw) {
                        await db.collection('rooms').updateOne({ id: req.body.id }, { $set: { occupied: [] } })
                        res.status(200).json({ status: 'success' });
                    } else {
                        res.status(401).json({ status: 'unauthorized' });
                    }
                    break
                case 'remove':
                    const roomPw2 = await db.collection('rooms').findOne({ id: req.body.id }, { projection: { password: 1 } })
                    if (bcrypt.compareSync(req.body.room.password, roomPw2.password)) {
                        await db.collection('rooms').deleteOne({ id: req.body.id })
                        res.status(200).json({ status: 'success' });
                    } else {
                        res.status(401).json({ status: 'unauthorized' });
                    }
                    break
            }
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}