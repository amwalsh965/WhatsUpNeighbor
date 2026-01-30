import React, { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [number, setNumber] = useState(null)

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/example/').then(res => res.json()).then(data => setNumber(data.number))
  }, [])

  return (
    <h1>Number: {number}</h1>
  )
}

export default App
