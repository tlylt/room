const rooms = [{
    id: '123',
    name: 'room1',
    password: 'secret',
    row: 10,
    col: 10,
    occupied: [
        { name: 'guy1', row: 1, col: 2 },
        { name: 'guy2', row: 1, col: 4 },
    ],
    gap: {
        row: 5,
        col: 5,
    }
}]

export async function getAllRoomIds() {
    let res = await fetch("http://localhost:3000/api/rooms", {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let rooms = await res.json()
    return rooms.map(room => {
        return {
            params: {
                id: room.id
            }
        }
    })
}

export async function getRoomData(id) {
    let res = await fetch(`http://localhost:3000/api/rooms/room?id=${id}`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
        },
    });
    let room = await res.json()
    return {
        id,
        ...room
    }
}