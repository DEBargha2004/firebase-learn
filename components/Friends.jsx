import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import AppData from '../hooks/AppData'
import profile from '../image/profile-user.png'

function Friends ({ className }) {
  const { friends } = useContext(AppData)
  const [displayInfo, setDisplayInfo] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  })
  const handleResize = () => {
    setDisplayInfo(prev => ({
      ...prev,
      height: window.innerHeight,
      width: window.innerWidth
    }))
  }
  useEffect(() => {
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])
  return (
    <div
      className={`${className} overflow-y-scroll`}
      style={{ height: `${displayInfo.height - 64}px` }}
    >
      {friends.map(friend => (
        <div className='bg-green-300 my-1 flex p-2'>
          <img src={profile} alt='' className='h-10' />
          <p>{friend.name}</p>
        </div>
      ))}
      {friends.map(friend => (
        <div className='bg-green-300 my-1 flex p-2'>
          <img src={profile} alt='' className='h-10' />
          <p>{friend.name}</p>
        </div>
      ))}
      {friends.map(friend => (
        <div className='bg-green-300 my-1 flex p-2'>
          <img src={profile} alt='' className='h-10' />
          <p>{friend.name}</p>
        </div>
      ))}
    </div>
  )
}

export default Friends
