import './App.css'
import { BrowserRouter,Routes,Route,Outlet } from 'react-router-dom'
import { Auth } from './component/authComponent.jsx'
import { Users } from './component/listUser.jsx'
import { EditUser } from './component/editUser.jsx'

function App() {
 

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Auth />} />
          <Route path="/users" element={<Users />} />
          <Route path='/edit' element={<EditUser />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
