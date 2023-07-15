import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { database } from '../firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import AppData from '../hooks/AppData'
import { compare } from 'bcryptjs'
import { useUser } from '@clerk/clerk-react'

function JoinRoom () {
  const { roomInfo, setRoomInfo } = useContext(AppData)
  const [credentials, setCredentials] = useState({
    password: '',
    room_id: ''
  })
  const { user } = useUser()
  const navigate = useNavigate()

  const joinRoom = async () => {
    const docRef = doc(database, 'rooms', credentials.room_id)
    const docSnap = await getDoc(docRef)
    const participantsRef = collection(
      database,
      `rooms/${credentials.room_id}/participants`
    )

    if (docSnap.exists()) {
      compare(
        credentials.password,
        docSnap.data().room_password,
        async (err, res) => {
          if (res) {
            await setDoc(doc(participantsRef, user.id), {
              user_name: user.fullName,
              user_id: user.id,
              user_email: user.primaryEmailAddress.emailAddress,
              user_img: user.imageUrl,
              room_id: credentials.room_id
            })
            setRoomInfo(prev => ({
              ...prev,
              roomId: credentials.room_id,
              roomName: credentials.room_name
            }))
            navigate('/room')
          } else {
            alert('invalid password')
          }
        }
      )
    } else {
      alert(`Room doesnot with id ${roomInfo.roomId} doesn't exists`)
    }
  }

  const handleChange = (e, type) => {
    setCredentials(prev => ({ ...prev, [type]: e.target.value }))
  }
  return (
    <div className='flex flex-col justify-center items-center my-10'>
      <input
        type='text'
        className='border-2 border-slate-300 outline-none my-3 p-2 text-slate-500'
        placeholder='Room ID'
        onChange={e => handleChange(e, 'room_id')}
        value={credentials.room_id}
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
          onClick={joinRoom}
        >
          Join Room
        </button>
      </div>
      <Link to='/createroom' className='text-slate-500 my-[50px]'>
        Create Room
      </Link>
    </div>
  )
}

export default JoinRoom
