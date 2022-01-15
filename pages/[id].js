import { Box } from '@chakra-ui/react'
import {
    Button,
    Input
} from '@chakra-ui/react'
import { Skeleton } from '@chakra-ui/react'
import { useCallback, useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import useSWR, { useSWRConfig } from 'swr'
import { useToast } from '@chakra-ui/react'
import Footer from '../components/Footer'
import FloorPlan from '../components/FloorPlan'
import QRCode from 'qrcode.react'
import { useLocalStorage } from '../lib/useLocalStorage'

const fetcher = (...args) => fetch(...args).then(res => res.json())

const DefaultPage = (
    <>
        <Head>
            <title>The Room</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>
        <header className="text-gray-600 body-font">
            <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
                <nav className="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto">
                    <div className="mr-5 hover:text-gray-900">ID: Hello</div>
                    <div className="mr-5 hover:text-gray-900">|</div>
                    <div className="mr-5 hover:text-gray-900">Name: World</div>
                </nav>
                <div className="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0">
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    <span className="ml-3 text-xl">The Room</span>
                </div>
                <div className="inline-flex ml-5 lg:w-2/5 lg:justify-end lg:ml-0">
                <div className="inline-flex items-center px-3 py-1 mt-4 text-base text-blue-500 border-0 rounded focus:outline-none md:mt-0" ><Button onClick={()=>{}} variant="outline">Refresh</Button></div>
                    <a href="/" className="inline-flex items-center px-3 py-1 mt-4 text-base bg-gray-100 border-0 rounded focus:outline-none hover:bg-gray-200 md:mt-0">Back
                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                            <path d="M5 12h14M12 5l7 7-7 7"></path>
                        </svg>
                    </a>
                </div>
            </div>
        </header>
        <section className="text-gray-600">
            <div className="container px-5 py-4 mx-auto">
                <div className="flex flex-col w-full mb-10 text-center">
                    <p className="w-2/3 mx-auto text-base leading-relaxed text-gray-900 bg-slate-300">Front</p>
                </div>
                <div className="flex justify-center mb-10">
                    <div className="py-2 mb-10 overflow-x-auto rounded-lg lg:mb-0">
                        <Box className="w-96">
                            <Skeleton height='200px' />
                            <Skeleton height='200px' />
                            <Skeleton height='225px' />
                        </Box>
                    </div>
                </div>
                <div className="flex flex-col w-full mb-20 text-center">
                    <p className="w-2/3 mx-auto text-base leading-relaxed text-gray-900 bg-slate-300">Back</p>
                </div>
                <div className="flex flex-wrap">
                    <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                        <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Settings</h2>
                    </div>
                    <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                        <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Actions</h2>
                        <div className="mb-4 text-base leading-relaxed">Go sit down!</div>
                    </div>
                    <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                        <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Room Admin(s)</h2>
                        <p className="mb-4 text-base leading-relaxed">Fill in the room password before executing the following actions</p>
                        <div className="inline-flex items-center text-blue-500">
                            <Button variant="outline">Clear all seats</Button>
                        </div>
                        <div className="inline-flex items-center text-blue-500">
                            <Button variant="outline">Delete Room</Button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
        <Footer />
    </>
)
export default function Room() {
    const [name, setName] = useLocalStorage("name", "");
    const toast = useToast()
    const { mutate } = useSWRConfig()
    const router = useRouter()
    const { id } = router.query
    const [locked, setLocked] = useState(false)
    const [location, setLocation] = useState({ row: -1, col: -1 })
    const handleNameChange = (event) => setName(event.target.value)
    const { data, error } = useSWR(`/api/rooms/room?id=${id}`, fetcher)
    const [password, setPassword] = useState('')
    const handlePasswordChange = (event) => setPassword(event.target.value)
    const handleClick = useCallback(async (row, col) => {
        mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [...data.occupied, { name: name, row: row, col: col }] }, false)
        let res = await fetch(`/api/rooms/room?id=${id}`, {
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
        if (res.status === 200) {
            toast({
                title: `Seated`,
                status: 'success',
                position: 'top',
                isClosable: true,
            })
            setLocked(true)
            setLocation({ row, col })
        }
    },[id, name, data])
    
    const handleExitSeat = useCallback(async ({ row, col }) => {
        mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [...data.occupied.filter(occupied => !(occupied.row === row && occupied.col === col))] }, false)
        let res = await fetch(`/api/rooms/room?id=${id}`, {
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
        if (res.status === 200) {
            toast({
                title: `Exited seat`,
                status: 'success',
                position: 'top',
                isClosable: true,
            })
            setLocked(false)
            setLocation({ row: -1, col: -1 })
        }
    }, [id,data])
    const handleClearSeat = useCallback(async () => {
        if (password.trim() === '') {
            toast({
                title: `Please enter the room password`,
                status: 'warning',
                position: 'top',
                isClosable: true,
            })
            return
        }

        let res = await fetch(`/api/rooms`, {
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
        if (res.status === 200) {
            setLocked(false)
            setLocation({ row: -1, col: -1 })
            toast({
                title: `Room cleared`,
                status: 'success',
                position: 'top',
                isClosable: true,
            })
            mutate(`/api/rooms/room?id=${id}`, { ...data, occupied: [] }, false)
        } else {
            toast({
                title: `Wrong password`,
                status: 'error',
                position: 'top',
                isClosable: true,
            })
        }
    }, [id, password, data])
    const handleDeleteRoom = useCallback(async () => {
        if (password.trim() === '') {
            toast({
                title: `Please enter the room password`,
                status: 'warning',
                position: 'top',
                isClosable: true,
            })
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
            toast({
                title: `Room deleted & back to home page`,
                status: 'success',
                duration: 2000,
                position: 'top',
                isClosable: true,
            })
            // pause a moment before redirecting to homepage
            setTimeout(() => {
                router.push('/')
            }, 2000)
        } else {
            toast({
                title: `Wrong password`,
                status: 'error',
                position: 'top',
                isClosable: true,
            })
        }
    }, [password, id])
    const handleRefresh = useCallback(async () => {
        toast({
            title: `Fetched latest data`,
            status: 'success',
            position: 'top',
            isClosable: true,
        })
        mutate(`/api/rooms/room?id=${id}`)
    }, [id])

    if (!data || error) {
        return DefaultPage
    }
    return (
        <>
            <Head>
                <title>The Room</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <header className="text-gray-600 body-font">
                <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
                    <nav className="flex flex-wrap items-center text-base lg:w-2/5 md:ml-auto">
                        <div className="mr-5 hover:text-gray-900">ID: {data && data.id}</div>
                        <div className="mr-5 hover:text-gray-900">|</div>
                        <div className="mr-5 hover:text-gray-900">Name: {data && data.name}</div>
                    </nav>
                    <div className="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none lg:w-1/5 title-font lg:items-center lg:justify-center md:mb-0">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span className="ml-3 text-xl">The Room</span>
                    </div>

                    <div className="inline-flex ml-5 lg:w-2/5 lg:justify-end lg:ml-0">
                        <div className="inline-flex items-center px-3 py-1 mt-4 text-base text-blue-500 border-0 rounded focus:outline-none md:mt-0" ><Button onClick={handleRefresh} variant="outline">Refresh</Button></div>
                        <a href="/" className="inline-flex items-center px-3 py-1 mt-4 text-base text-blue-500 border-0 rounded focus:outline-none hover:bg-gray-100 md:mt-0">Back
                            <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-4 h-4 ml-1" viewBox="0 0 24 24">
                                <path d="M5 12h14M12 5l7 7-7 7"></path>
                            </svg>
                        </a>
                    </div>
                </div>
            </header>
            <section className="text-gray-600">
                <div className="container px-5 py-4 mx-auto">
                    <div className="flex flex-col w-full mb-10 text-center">
                        <p className="w-2/3 mx-auto text-base leading-relaxed text-gray-900 bg-slate-300">Front</p>
                    </div>
                    <div className="flex justify-center mb-10">
                        <div className="px-2 py-2 mb-10 overflow-x-auto rounded-lg lg:mb-0">
                            <div className="grid gap-2 lg:gap-4">
                                <FloorPlan data={data} gap={data.gap} handleClick={handleClick} name={name} locked={locked} location={location}/>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col w-full mb-20 text-center">
                        <p className="w-2/3 mx-auto text-base leading-relaxed text-gray-900 bg-slate-300">Back</p>
                    </div>
                    <div className="flex flex-wrap">
                        <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                            <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Settings</h2>
                            <Input placeholder='Enter Name'
                                value={name}
                                onChange={handleNameChange}
                                disabled={locked}
                                required
                            />
                        </div>
                        <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                            <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Actions</h2>
                            {location.row === -1 && location.col === -1 ? <div className="mb-4 text-base leading-relaxed">Go sit down!</div> :
                                <div className="mb-4 text-base leading-relaxed">
                                    <div>Sitting at: </div>
                                    <div>Row: {location.row + 1}</div>
                                    <div>Column: {location.col + 1}</div>
                                    <div className="text-blue-500">
                                        <Button onClick={() => handleExitSeat(location)} disabled={!locked} variant="outline">Exit Seat</Button>
                                    </div>
                                </div>}
                            <div>Share:</div>
                            <QRCode value={`${window.location.href}`} />
                        </div>
                        <div className="px-8 py-6 border-l-2 border-gray-200 xl:w-1/4 lg:w-1/2 md:w-full border-opacity-60">
                            <h2 className="mb-2 text-lg font-medium text-gray-900 sm:text-xl title-font">Room Admin(s)</h2>
                            <p className="mb-4 text-base leading-relaxed">Fill in the room password before executing the following actions</p>
                            <Input placeholder='Room Password'
                                value={password}
                                onChange={handlePasswordChange}
                                type="password"
                                required
                            />
                            <div className="inline-flex items-center text-blue-500">
                                <Button onClick={handleClearSeat} variant="outline">Clear all seats</Button>
                            </div>
                            <div className="inline-flex items-center text-blue-500">
                                <Button onClick={handleDeleteRoom} variant="outline">Delete Room</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </>
    )
}
