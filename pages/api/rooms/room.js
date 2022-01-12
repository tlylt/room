import clientPromise from '../../../lib/mongodb'

export default async function userHandler(req, res) {
    const client = await clientPromise
    const db = client.db();
    switch (req.method) {
        case 'GET':
            const room = await db
                .collection("rooms")
                .findOne({ id: req.query.id }, { projection: { _id: 0, password: 0 } });
            res.status(200).json(room)
            break
        case 'POST':
            switch (req.body.operation) {
                case 'add':
                    db.collection('rooms').updateOne({ id: req.query.id },
                        { $addToSet: { occupied: { name: req.body.user.name, row: req.body.location.row, col: req.body.location.col } } },
                        { upsert: true })
                    res.status(200).json({ status: "success" })
                    break
                case 'remove':
                    db.collection('rooms').updateOne({ id: req.query.id },
                        { $pull: { occupied: { row: req.body.location.row, col: req.body.location.col } } })
                    res.status(200).json({ status: "success" })
                    break
            }
            break
        default:
            res.setHeader('Allow', ['GET', 'POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}