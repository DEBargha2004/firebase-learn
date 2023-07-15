import { useUser } from '@clerk/clerk-react'
import React, { useEffect, useRef, useState } from 'react'

function Message ({ item }) {
  const messageBox = useRef(null)
  const [boxDimensions, setBoxDimensions] = useState({ height: 30 })
  const { user } = useUser()
  useEffect(() => {
    const dimensions = {
      height: messageBox.current.offsetHeight,
      width: messageBox.current.offsetWidth
    }
    console.log(dimensions)
    setBoxDimensions(dimensions)
  }, [])
  return (
    <div
      className={`w-full relative mb-1`}
      style={{ height: boxDimensions.height }}
    >
      <div
        ref={messageBox}
        className={`absolute h-fit flex text-white py-1 px-2 ${
          item.sender_id === user.id ? ' right-2' : ' left-2'
        }`}
      >
        <img src={item.user_img} className='h-6 rounded-full' alt='' />
        <span className='bg-slate-800 max-w-[300px] ml-1 px-2 py-1 rounded-lg'>{item.text}</span>
      </div>
    </div>
  )
}

export default Message
