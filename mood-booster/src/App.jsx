// src/App.jsx
import { useContext } from 'react'
import { UserContext } from './context/UserContext'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import './App.css'

function App() {
  const { user } = useContext(UserContext)

  return user ? <Dashboard /> : <Auth />
}

export default App