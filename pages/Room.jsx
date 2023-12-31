import { useContext, useEffect, useState } from 'react'
import AppData from '../hooks/AppData'
import { database } from '../firebase'
import {
  collection,
  doc,
  onSnapshot,
  query,
  where,
  setDoc,
  addDoc,
  serverTimestamp,
  orderBy,
  getDoc
} from 'firebase/firestore'
import { useUser } from '@clerk/clerk-react'
import Message from '../components/Message'

function Room () {
  const { roomInfo, setRoomInfo } = useContext(AppData)
  const { user } = useUser()
  const [messages, setMessages] = useState([])
  const [displayInfo, setDisplayInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  useEffect(() => {
    const q = query(
      collection(database, `rooms/${roomInfo.roomId}/participants`),
      where('room_id', '==', roomInfo.roomId)
    )
    const unsubparticipants = onSnapshot(q, snapshot => {
      const participants = []
      snapshot.forEach(doc => {
        participants.push(doc.data())
      })
      setRoomInfo(prev => ({ ...prev, participants: [...participants] }))
    })

    const unsubroom = onSnapshot(
      doc(database, `rooms/${roomInfo.roomId}`),
      snapshot => {
        if (snapshot.exists()) {
          const roomData = snapshot.data()
          setRoomInfo(prev => ({ ...prev, roomName: roomData.room_name }))
        }
      }
    )
    const messageQuery = query(
      collection(database, `rooms/${roomInfo.roomId}/conversations`),
      where('room_id', '==', roomInfo.roomId),
      orderBy('createdAt')
    )
    const unsubmessage = onSnapshot(messageQuery, snapshot => {
      const messages = []
      snapshot.forEach(doc => {
        messages.push({ ...doc.data(), id: doc.id })
      })
      setMessages([...messages])
    })

    return () => {
      unsubparticipants()
      unsubroom()
      unsubmessage()
    }
  }, [])

  const handleResize = () => {
    setDisplayInfo(prev => ({
      ...prev,
      height: window.innerHeight,
      width: window.innerWidth
    }))
  }
  const handleSubmit = async e => {
    e.preventDefault()

    if (!e.target[0].value) return

    const isInParticipants = await getDoc(
      doc(
        collection(database, `rooms/${roomInfo.roomId}/participants`),
        user.id
      )
    )
    if (isInParticipants.exists()) {
      const messageData = {
        room_id: roomInfo.roomId,
        text: e.target[0].value,
        sender_id: user.id,
        sender_name: user.fullName,
        user_img : user.imageUrl
      }
      await addDoc(
        collection(database, `rooms/${roomInfo.roomId}/conversations`),
        { ...messageData, createdAt: serverTimestamp() }
      )
    } else {
      alert('you are not a participant enter room again with credentials')
    }
    e.target[0].value = ''
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className='flex'>
      <div className='mr-20 w-[30%]'>
        <p className='ml-3 mb-5'>{roomInfo.roomId}</p>
        <p className='ml-3 mb-5 text-xl font-semibold text-red-600'>
          {roomInfo.roomName}
        </p>
        {roomInfo.participants.map((item, index) => (
          <div key={index} className='flex my-3'>
            <img
              src={item.user_img}
              className='h-10 rounded-full mr-4 ml-3'
              alt=''
            />
            <p>{item.user_name}</p>
          </div>
        ))}
      </div>
      <div
        className='overflow-y-scroll w-[70%] relative'
        style={{ height: `${displayInfo.height - 64}px` }}
      >
        {messages.map((item, index) => (
          <Message item={item} />
        ))}
        <div className='h-[50px] w-full'></div>
        <form
          className='fixed h-[50px]'
          style={{
            top: `${displayInfo.height - 50}px`,
            width: `${displayInfo.width * 0.7}px`
          }}
          onSubmit={handleSubmit}
        >
          <input
            type='text'
            name=''
            id=''
            className='w-[85%] bg-yellow-400 h-full p-1'
          />
          <button className='h-full p-1 w-[90px] bg-green-400'>Submit</button>
        </form>
      </div>
    </div>
  )
}

export default Room
