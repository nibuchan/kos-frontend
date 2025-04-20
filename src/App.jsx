import './App.css'
import { Routes, Route } from "react-router-dom"
import Home from './pages/Home'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import DashboardKos from './pages/DashboardKos'
import DetailKos from './pages/KosDetail'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<DashboardKos pemilikId={getPemilikIdFromLocaleStorage()} />} />
          <Route path="/kos/:id" element={<DetailKos />} />
        </Routes>
      </>
      
    </div>
  )
}

function getPemilikIdFromLocaleStorage() {
  const user = JSON.parse(localStorage.getItem("user"));
  return user?.id;
}

export default App
