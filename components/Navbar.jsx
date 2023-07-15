import { UserButton, useUser } from '@clerk/clerk-react'
import { useContext } from 'react'
import AppData from '../hooks/AppData'
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  query,
  where
} from 'firebase/firestore'
import { database } from '../firebase'
import { useNavigate } from 'react-router-dom'

function Navbar () {
  const { roomInfo, setRoomInfo } = useContext(AppData)
  const { user } = useUser()
  const navigate = useNavigate()
  const exitFromRoom = async e => {
    const existance = query(
      collection(database, `rooms/${roomInfo.roomId}/participants`),
      where('user_id', '==', user.id)
    )
    const doesExists = await getDoc(
      doc(database, `rooms/${roomInfo.roomId}/participants`, user.id)
    )
    if (doesExists.exists()) {
      await deleteDoc(
        doc(
          collection(database, `rooms/${roomInfo.roomId}/participants`),
          user.id
        )
      )
      navigate('/')
    }
  }
  return (
    <nav className='p-4 flex w-full justify-between'>
      <UserButton />
      <button
        className='bg-slate-600 text-white px-2 py-1 rounded-md'
        onClick={exitFromRoom}
      >
        Exit Room
      </button>
    </nav>
  )
}

export default Navbar
