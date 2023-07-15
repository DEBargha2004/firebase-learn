import React, { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

function Home () {
  const location = useLocation()
  const navigate = useNavigate()
  useEffect(() => {
    if (location.pathname === '/') navigate('/joinroom')
  }, [location.pathname])
  return <></>
}

export default Home
