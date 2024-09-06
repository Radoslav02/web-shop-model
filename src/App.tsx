import { Outlet } from 'react-router-dom'
import './App.css'
import Header from './components/Header/Header'

function App() {


  return (
    <div className="container-fluid">
      <Header />
      <Outlet />
    </div>
  )
}

export default App
