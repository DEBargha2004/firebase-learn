import { useContext, useState } from 'react'
import { v4 } from 'uuid'
import {
  collection,
  doc,
  getDoc,
  setDoc,
  serverTimestamp
} from 'firebase/firestore'
import { database } from '../firebase'
import { Link } from 'react-router-dom'
import { useUser } from '@clerk/clerk-react'
import AppData from '../hooks/AppData'
import { useNavigate } from 'react-router-dom'
import { hash } from 'bcryptjs'

function CreateRoom () {
  const { setRoomInfo } = useContext(AppData)
  const [credentials, setCredentials] = useState({
    room_name: '',
    password: ''
  })
  const saltRounds = 10
  const { user } = useUser()
  const navigate = useNavigate()
  const createRoom = async () => {
    const roomRef = collection(database, 'rooms')
    const room_id = v4()
    const participantsRef = collection(
      database,
      `/rooms/${room_id}/participants`
    )

    hash(credentials.password, saltRounds, async (err, encryptedPass) => {
      await setDoc(doc(roomRef, room_id), {
        room_name: credentials.room_name,
        room_password: encryptedPass,
        owner_name: user.fullName,
        owner_id: user.id,
        room_id,
        owner_img: user.imageUrl,
        created_at: serverTimestamp()
      })
    })

    await setDoc(doc(participantsRef, user.id), {
      user_name: user.fullName,
      user_id: user.id,
      user_email: user.primaryEmailAddress.emailAddress,
      user_img: user.imageUrl,
      room_id
    })

    setRoomInfo(prev => ({
      ...prev,
      roomId: room_id,
      roomName: credentials.room_name
    }))

    navigate('/room')
  }

  const handleChange = (e, type) => {
    setCredentials(prev => ({ ...prev, [type]: e.target.value }))
  }

  return (
    <div className='flex flex-col justify-center items-center my-10'>
      <input
        type='text'
        className='border-2 border-slate-300 outline-none my-3 p-2 text-slate-500'
        placeholder='Room Name'
        onChange={e => handleChange(e, 'room_name')}
        value={credentials.room_name}
      />
      <input
        type='password'
        className='border-2 border-slate-300 outline-none my-3 p-2 text-slate-500'
        placeholder='Password'
        onChange={e => handleChange(e, 'password')}
        value={credentials.password}
      />
      <div>
        <button
          className='bg-indigo-500 text-white text-lg font-semibold p-1 px-2 rounded-md mx-4'
          onClick={createRoom}
        >
          Create Room
        </button>
      </div>
      <Link to='/joinroom' className='my-[50px] text-slate-500'>
        Join Room
      </Link>
    </div>
  )
}

export default CreateRoom
