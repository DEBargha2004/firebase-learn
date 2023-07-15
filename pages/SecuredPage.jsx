import React, { useEffect, useState } from 'react'
import AppData from '../hooks/AppData'
import { useUser } from '@clerk/clerk-react'
import { database } from '../firebase'
import { collection, doc, getDoc, setDoc } from 'firebase/firestore'
import JoinRoom from './JoinRoom'
import CreateRoom from './CreateRoom'
import Home from './Home'
import Room from './Room'
import Navbar from '../components/Navbar'
import { Route, Routes } from 'react-router-dom'

function SecuredPage () {
  const { user, isSignedIn } = useUser()
  const [roomInfo, setRoomInfo] = useState({
    roomId: null,
    roomName: null,
    participants: [],
    messages: []
  })

  const addUserIfDoesnotExist = async (docRef) => {
    const docSnap = await getDoc(docRef)
    if (!docSnap.exists()) {
      const usersRef = collection(database, 'users')
      await setDoc(doc(usersRef, user.id), {
        user_id: user.id,
        user_fullname: user.fullName,
        user_email: user.primaryEmailAddress.emailAddress,
        user_img : user.imageUrl
      })
    }
  }

  useEffect(() => {
    if (isSignedIn) {
      const docRef = doc(database, 'users', user.id)
      addUserIfDoesnotExist(docRef, user)
    }
  }, [])

  return (
    <>
      <AppData.Provider value={{ roomInfo, setRoomInfo }}>
        <Navbar />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/joinroom' element={<JoinRoom />} />
          <Route path='/createroom' element={<CreateRoom />} />
          <Route path='/room' element={<Room />} />
        </Routes>
      </AppData.Provider>
    </>
  )
}

export default SecuredPage
