import { getAllRoomIds, getRoomData } from '../lib/rooms'
import { Avatar, AvatarBadge, AvatarGroup, Stack } from '@chakra-ui/react'
import { Tooltip } from '@chakra-ui/react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverBody,
    PopoverFooter,
    PopoverArrow,
    PopoverCloseButton,
    PopoverAnchor,
    Button,
    Input
} from '@chakra-ui/react'
import { Skeleton, SkeletonCircle, SkeletonText } from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR, { useSWRConfig } from 'swr'

function makeGrid(row, col, occupied) {
    const initialGrid = []
    for (let i = 0; i < row; i++) {
        initialGrid[i] = []
        for (let j = 0; j < col; j++) {
            initialGrid[i][j] = {
                row: i,
                col: j,
                occupied: false,
                name: '',
            }
        }
    }
    occupied.forEach(occupied => {
        if (occupied.row !== -1 && occupied.col !== -1) {
            initialGrid[occupied.row][occupied.col].occupied = true
            initialGrid[occupied.row][occupied.col].name = occupied.name
        }
    })
    return initialGrid
}

const defaultGrid = () => {
    const initialGrid = []
    for (let i = 0; i < 10; i++) {
        initialGrid[i] = []
        for (let j = 0; j < 10; j++) {
            initialGrid[i][j] = {
                row: i,
                col: j,
                occupied: false,
                name: '',
            }
        }
    }
    return initialGrid
}

export default function Post() {
    const { mutate } = useSWRConfig()
    const router = useRouter()
    const { id } = router.query
    const [name, setName] = useState('')
    const [locked, setLocked] = useState(false)
    const [location, setLocation] = useState({ row: -1, col: -1 })
    const handleNameChange = (event) => setName(event.target.value)
    const fetcher = (...args) => fetch(...args).then(res => res.json())
    const { data, error } = useSWR(`/api/rooms/room?id=${id}`, fetcher)
    const [password, setPassword] = useState('')
    const handlePasswordChange = (event) => setPassword(event.target.value)
    const handleClick = (row, col) => {
        // send POST request to the API with row and col and operation
        // if operation is 'add', add the user to the room
        // if operation is 'remove', remove the user from the room
        mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [...data.occupied, { name: name, row: row, col: col }] }, false)
        let res = fetch(`/api/rooms/room?id=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: 'add',
                location: {
                    row,
                    col
                },
                user: {
                    name: name
                }
            })
        })
        setLocked(true)
        setLocation({ row, col })
    }
    const handleExitSeat = ({ row, col }) => {
        mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [...data.occupied.filter(occupied => !(occupied.row === row && occupied.col === col))] }, false)
        fetch(`http://localhost:3000/api/rooms/room?id=${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: 'remove',
                location: {
                    row,
                    col
                }
            })
        })
        setLocked(false)
        setLocation({ row: -1, col: -1 })
    }
    const handleClearSeat = async () => {
        if (password.trim() === '') {
            alert('Please enter a password')
            return
        }
        mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [] }, false)
        fetch(`/api/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: 'clear',
                id: id,
                room: {
                    password: password
                }
            })
        })
        setLocked(false)
        setLocation({ row: -1, col: -1 })
    }
    const handleDeleteRoom = async () => {
        if (password.trim() === '') {
            alert('Please enter a password')
            return
        }
        let res = await fetch(`/api/rooms`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                operation: 'remove',
                id: id,
                room: {
                    password: password
                }
            })
        });
        //redirect back to home page after deletion
        if (res.status === 200) {
            router.push('/')
        }
    }
    useEffect(() => {
        if (data) {
            setGridData(makeGrid(data.row, data.col, data.occupied))
        }
    }, [data])

    const [grid, setGridData] = useState(defaultGrid())
    return (
        <>
            <Head>
                <title>The Room</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="text-gray-600 body-font">
                <div className="container mx-auto flex flex-wrap p-5 flex-col md:flex-row items-center">
                    <nav class="flex lg:w-2/5 flex-wrap items-center text-base md:ml-auto">
                        <div class="mr-5 hover:text-gray-900">ID: {data && data.id}</div>
                        <div class="mr-5 hover:text-gray-900">|</div>
                        <div class="mr-5 hover:text-gray-900">Name: {data && data.name}</div>
                    </nav>
                    <div className="flex order-first lg:order-none lg:w-1/5 title-font font-medium items-center text-gray-900 lg:items-center lg:justify-center mb-4 md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="ml-3 text-xl">The Room</span>
                    </div>
                    <div class="lg:w-2/5 inline-flex lg:justify-end ml-5 lg:ml-0">
                        <a href="/" class="inline-flex items-center bg-gray-100 border-0 py-1 px-3 focus:outline-none hover:bg-gray-200 rounded text-base mt-4 md:mt-0">Back
                            <svg fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" class="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </header>
            <section className="text-gray-600">
                <div className="container px-5 py-4 mx-auto">
                    <div className="flex flex-col text-center w-full mb-10">
                        <p className="w-2/3 mx-auto leading-relaxed text-base bg-slate-300 text-gray-900">Front</p>
                    </div>
                    <div className="flex justify-center mb-10">
                        <div className="mb-10 lg:mb-0 rounded-lg overflow-x-auto py-2">
                            <div className="grid lg:gap-4 gap-2">
                                {grid && data ? grid.map((row, rowIdx) => {
                                    return <AvatarGroup spacing='1rem' key={"row" + rowIdx}>
                                        {row.map((col, colIdx) => {
                                            return <Popover key={"col" + colIdx} >
                                                <PopoverTrigger >
                                                    <div className={`${colIdx === data.gap.col ? 'pl-10' : ''}`}>
                                                        {col.occupied ?
                                                            <Tooltip label={col.name} hasArrow placement='auto'>
                                                                <Avatar textColor={'white'} name={col.name ? col.name : rowIdx + ' ' + colIdx} bg={col.occupied ? 'teal' : 'gray'} >
                                                                    <AvatarBadge boxSize='1.25em' bg='green.500' />
                                                                </Avatar>
                                                            </Tooltip> : <Avatar />}
                                                    </div>
                                                </PopoverTrigger>
                                                <PopoverContent>
                                                    <PopoverArrow />
                                                    <PopoverCloseButton />
                                                    <PopoverHeader>Row-{rowIdx + 1} Col-{colIdx + 1}</PopoverHeader>
                                                    <PopoverBody>
                                                        <div>{grid[rowIdx][colIdx].name ? `Occupant: ${grid[rowIdx][colIdx].name}` : ''}</div>
                                                        {grid[rowIdx][colIdx].occupied ? undefined : name === '' ? <div>Enter your name below first!</div> :
                                                            locked ? <div>Exit seat before you can switch!</div> :
                                                                <Button onClick={() => handleClick(rowIdx, colIdx)}>Sit</Button>}
                                                    </PopoverBody>
                                                </PopoverContent>
                                            </Popover>;
                                        })}
                                    </AvatarGroup>
                                }) : <Stack>
                                    <Skeleton height='200px' />
                                    <Skeleton height='200px' />
                                    <Skeleton height='200px' />
                                </Stack>}
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col text-center w-full mb-20">
                        <p className="w-2/3 mx-auto leading-relaxed text-base bg-slate-300 text-gray-900">Back</p>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Settings</h2>
                            <Input placeholder='My Name'
                                value={name}
                                onChange={handleNameChange}
                                disabled={locked}
                            />
                        </div>
                        <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Actions</h2>
                            {location.row === -1 && location.col === -1 ? <div className="leading-relaxed text-base mb-4">Go sit down!</div> :
                                <div className="leading-relaxed text-base mb-4">
                                    <div>Sitting at: </div>
                                    <div>Row: {location.row + 1}</div>
                                    <div>Column: {location.col + 1}</div>
                                    <div className="text-blue-500">
                                        <Button onClick={() => handleExitSeat(location)} disabled={!locked} variant="outline">Exit Seat</Button>
                                    </div>
                                </div>}
                        </div>
                        <div className="xl:w-1/4 lg:w-1/2 md:w-full px-8 py-6 border-l-2 border-gray-200 border-opacity-60">
                            <h2 className="text-lg sm:text-xl text-gray-900 font-medium title-font mb-2">Room Admin(s)</h2>
                            <p className="leading-relaxed text-base mb-4">Fill in the room password before executing the following actions</p>
                            <Input placeholder='Room Password'
                                value={password}
                                onChange={handlePasswordChange}
                            />
                            <div className="text-blue-500 inline-flex items-center">
                                <Button onClick={handleClearSeat} variant="outline">Clear all seats</Button>
                            </div>
                            <div className="text-blue-500 inline-flex items-center">
                                <Button onClick={handleDeleteRoom} variant="outline">Delete Room</Button>
                            </div>
                        </div>
                    </div>

                </div>
            </section>
            <main className="justify-center container mx-auto">
                <div className="flex gap-10">

                </div>
            </main>
        </>
    )
}
