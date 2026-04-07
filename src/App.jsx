import { BrowserRouter, Route, Routes } from 'react-router-dom'
import ClientLoginPage from '../pages/Client/ClientLoginPage'
import './App.css'
import ClientRegisterPage from '../pages/Client/ClientRegisterPage'
import ClientOnboardPage from '../pages/Client/ClientOnboardPage'
import ClientHomePage from '../pages/Client/ClientHomePage'
import ClientNavbar from '../components/ClientNavbar'
import VendorProfile from '../pages/Client/VendorProfile'

function App() {
  

  return (
    <>
      <BrowserRouter>

        <div className='max-w-[1400px] mx-auto p-4 md:p-6'>
          <ClientNavbar/>
          <Routes>
            <Route path='/client/login' element={<ClientLoginPage/>}/>
            <Route path='/client/register' element={<ClientRegisterPage/>}/>
            <Route path='/client/onboard' element={<ClientOnboardPage/>}/>
            <Route path='/client' element={<ClientHomePage/>}/>
            <Route path='/client/vendors/:id' element={<VendorProfile/>}/>
          </Routes>
        </div>
      </BrowserRouter>
    </>
  )
}

export default App
