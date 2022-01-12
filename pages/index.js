import Head from 'next/head'
import { useState } from 'react';
import { Grid, _ } from 'gridjs-react';
import "gridjs/dist/theme/mermaid.css";
import { Input, InputGroup, InputRightElement, Button } from '@chakra-ui/react'
import useSWR, { useSWRConfig } from 'swr'
import { useRouter } from 'next/router';
import { nanoid } from 'nanoid'
function PasswordInput(
  { roomPassword, handlePasswordChange }
) {
  const [show, setShow] = useState(false)
  const handleClick = () => setShow(!show)
  return (
    <InputGroup size='md' >
      <Input
        pr='4.5rem'
        type={show ? 'text' : 'password'}
        value={roomPassword}
        onChange={handlePasswordChange}
        placeholder='Enter password'
      />
      <InputRightElement width='4.5rem'>
        <Button h='1.75rem' size='sm' onClick={handleClick}>
          {show ? 'Hide' : 'Show'}
        </Button>
      </InputRightElement>
    </InputGroup>
  )
}

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
    }
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
    }
  }
]
export default function Home() {
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
      alert('Please enter a room name')
      return
    }
    if (roomPassword.trim() === '') {
      alert('Please enter a room password')
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
      router.push(`/${room.id}`)
    }
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                { id: 'id', name: 'Click ID To Join', formatter: (cell) => _(<a className="underline" href={`/${cell}`} >{cell}</a>) }
              ]}
              search={
                {
                  enabled: true,
                  placeholder: 'Search by room name'
                }
              }
              pagination={{
                enabled: true,
                limit: 10,
              }}
              sort={true}
            />
          </div>
          <div className="flex flex-col flex-wrap -mb-10 text-center lg:py-6 lg:w-1/2 lg:pl-12 lg:text-left">
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Join a room</h2>
                <p className="text-base leading-relaxed">Browse the list of available rooms and click to join</p>
              </div>
            </div>
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Create a room</h2>
                <Input placeholder='Room Name'
                  value={roomName}
                  onChange={handleNameChange}
                  width="50"
                />
                <Input
                  value={roomPassword}
                  onChange={handlePasswordChange}
                  width="50"
                  placeholder='Room Password'
                />
                <p className="text-sm leading-relaxed">*password is required in the room when you want to perform admin actions</p>
                <div className="inline-flex items-center mt-3 text-indigo-500"><Button variant="outline" onClick={handleClick}>GO</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="text-gray-600 body-font">
        <div className="container flex flex-col items-center px-5 py-8 mx-auto sm:flex-row">
          <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0">© 2022  —
            <a href="https://yongliangliu.com" className="ml-1 text-gray-600" rel="noopener noreferrer" target="_blank">@tlylt</a>
          </p>
        </div>
      </footer>
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
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
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
                { id: 'id', name: 'Click ID To Join', formatter: (cell) => _(<a className="underline" href={`/${cell}`} >{cell}</a>) }
              ]}
              search={
                {
                  enabled: true,
                  placeholder: 'Search by room name'
                }
              }
              pagination={{
                enabled: true,
                limit: 10,
              }}
              sort={true}
            />
          </div>
          <div className="flex flex-col flex-wrap -mb-10 text-center lg:py-6 lg:w-1/2 lg:pl-12 lg:text-left">
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Join a room</h2>
                <p className="text-base leading-relaxed">Browse the list of available rooms and click to join</p>
              </div>
            </div>
            <div className="flex flex-col items-center mb-10 lg:items-start">
              <div className="inline-flex items-center justify-center w-12 h-12 mb-5 bg-blue-200 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v3m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="flex-grow">
                <h2 className="mb-3 text-lg font-medium text-gray-900 title-font">Create a room</h2>
                <Input placeholder='Room Name'
                  value={roomName}
                  onChange={handleNameChange}
                  width="50"
                />
                <Input
                  value={roomPassword}
                  onChange={handlePasswordChange}
                  width="50"
                  placeholder='Room Password'
                />
                <p className="text-sm leading-relaxed">*password is required in the room when you want to perform admin actions</p>
                <div className="inline-flex items-center mt-3 text-indigo-500"><Button variant="outline" onClick={handleClick}>GO</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <footer className="text-gray-600 body-font">
        <div className="container flex flex-col items-center px-5 py-8 mx-auto sm:flex-row">
          <p className="mt-4 text-sm text-gray-500 sm:ml-4 sm:pl-4 sm:border-l-2 sm:border-gray-200 sm:py-2 sm:mt-0">© 2022  —
            <a href="https://yongliangliu.com" className="ml-1 text-gray-600" rel="noopener noreferrer" target="_blank">@tlylt</a>
          </p>
        </div>
      </footer>
    </>
  )
}