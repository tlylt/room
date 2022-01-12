import Head from 'next/head'
import { useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { Input, Button } from '@chakra-ui/react'
import useSWR, { useSWRConfig } from 'swr'
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid'
import { useToast } from '@chakra-ui/react'
import Footer from '../components/Footer';
import { getReadableDate } from '../utils';

const sampleRooms = [
  {
    id: 'hello',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'world',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'hello',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'world',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'hello',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'world',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'hello',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  },
  {
    id: 'world',
    name: 'Loading...',
    password: 'password',
    row: 10,
    col: 10,
    occupied: [],
    gap: {
      row: 5,
      col: 5,
    },
    creationTime: 'January 1'
  }
]
export default function Home() {
  const toast = useToast()
  const { mutate } = useSWRConfig()
  const router = useRouter()
  const fetcher = (...args) => fetch(...args).then(res => res.json())
  const { data, error } = useSWR('/api/rooms', fetcher)
  const [roomName, setRoomName] = useState('')
  const handleNameChange = (event) => setRoomName(event.target.value)
  const [roomPassword, setRoomPassword] = useState('')
  const handlePasswordChange = (event) => setRoomPassword(event.target.value)
  const handleClick = async () => {
    if (roomName.trim() === '') {
      toast({
        title: `Please enter a room name`,
        status: 'warning',
        position: 'top',
        isClosable: true,
      })
      return
    }
    if (roomPassword.trim() === '') {
      toast({
        title: `Please enter a room password`,
        status: 'warning',
        position: 'top',
        isClosable: true,
      })
      return
    }
    const id = nanoid(10)
    mutate('/api/rooms', [...data, { id: id, name: roomName }, false])
    let res = await fetch(`/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        operation: 'add',
        room: {
          name: roomName,
          id: id,
          password: roomPassword
        }
      })
    });
    let room = await res.json()
    if (room.status === 'success') {
      toast({
        title: `Room created`,
        status: 'success',
        position: 'top',
        duration: 1000,
        isClosable: true,
      })
      setTimeout(() => {
        router.push(`/${room.id}`)
      }, 1000)
    }
  }

  const handleRefresh = async () => {
    toast({
      title: `Fetched latest data`,
      status: 'success',
      position: 'top',
      isClosable: true,
    })
    mutate(`/api/rooms`)
  }
  if (error) return <div>failed to load</div>
  if (!data) {
    return (<>
      <Head>
        <title>The Room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="text-gray-600 body-font">
        <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
          <div className="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none title-font lg:items-center lg:justify-center md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="ml-3 text-xl">The Room</span>
          </div>
        </div>
      </header>
      <section className="text-gray-600 body-font">
        <div className="container flex flex-wrap px-5 py-24 mx-auto">
          <div className="w-full mb-10 overflow-hidden rounded-lg lg:w-1/2 lg:mb-0">
            <Grid
              data={sampleRooms}
              columns={[
                { id: 'name', name: 'Room Name' },
                { id: 'id', name: 'Click ID To Join', formatter: (cell) => _(<a className="underline" href="#" >{cell}</a>) },
                { id: 'creationTime', name: 'Created' },
              ]}
              search={
                {
                  enabled: true,
                  placeholder: 'Search by room name'
                }
              }
              pagination={{
                enabled: true,
                limit: 8,
              }}
              sort={true}
            />
          </div>
          <div className="flex flex-col flex-wrap -mb-10 text-center lg:py-16 lg:w-1/2 lg:pl-12 lg:text-left">
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Join a room</h2>
                <p className="text-base leading-relaxed">Browse the list of available rooms and click to join</p>
                <div className="inline-flex items-center pt-1 mt-4 text-base text-blue-500 border-0 rounded focus:outline-none md:mt-0" ><Button variant="outline">Refresh</Button></div>
              </div>
            </div>
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Create a room</h2>
                <Input placeholder='Room Name'
                  value={roomName}
                  onChange={() => { }}
                  width="50"
                />
                <Input
                  value={roomPassword}
                  onChange={() => { }}
                  width="50"
                  placeholder='Room Password'
                />
                <p className="text-sm leading-relaxed">*password is required to perform room admin actions</p>
                <div className="inline-flex items-center mt-2 text-blue-500"><Button variant="outline" >GO</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>)
  }
  return (
    <>
      <Head>
        <title>The Room</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <header className="text-gray-600 body-font">
        <div className="container flex flex-col flex-wrap items-center p-5 mx-auto md:flex-row">
          <div className="flex items-center order-first mb-4 font-medium text-gray-900 lg:order-none title-font lg:items-center lg:justify-center md:mb-0">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <span className="ml-3 text-xl">The Room</span>
          </div>
        </div>
      </header>
      <section className="text-gray-600 body-font">
        <div className="container flex flex-wrap px-5 py-24 mx-auto">
          <div className="w-full mb-10 overflow-hidden rounded-lg lg:w-1/2 lg:mb-0">
            <Grid
              data={data}
              columns={[
                { id: 'name', name: 'Room Name' },
                { id: 'id', name: 'Click ID To Join', formatter: (cell) => _(<a className="underline" href={`/${cell}`} >{cell}</a>) },
                { id: 'creationTime', name: 'Created', formatter: (cell) => getReadableDate(cell) },
              ]}
              search={
                {
                  enabled: true,
                  placeholder: 'Search by room name'
                }
              }
              pagination={{
                enabled: true,
                limit: 8,
              }}
              sort={true}
            />
          </div>
          <div className="flex flex-col flex-wrap -mb-10 text-center lg:py-16 lg:w-1/2 lg:pl-12 lg:text-left">
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Join a room</h2>
                <p className="text-base leading-relaxed">Browse the list of available rooms and click to join</p>
                <div className="inline-flex items-center pt-1 mt-4 text-base text-blue-500 border-0 rounded focus:outline-none md:mt-0" ><Button onClick={handleRefresh} variant="outline">Refresh</Button></div>
              </div>
            </div>
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Create a room</h2>
                <Input placeholder='Room Name'
                  value={roomName}
                  onChange={handleNameChange}
                  width="50"
                  required
                />
                <Input
                  value={roomPassword}
                  type='password'
                  onChange={handlePasswordChange}
                  width="50"
                  placeholder='Room Password'
                  required
                />
                <p className="text-sm leading-relaxed">*password is required to perform room admin actions</p>
                <div className="inline-flex items-center mt-2 text-indigo-500"><Button variant="outline" onClick={handleClick}>GO</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}