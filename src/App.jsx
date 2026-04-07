import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import ClientLoginPage from '../pages/Client/ClientLoginPage'
import './App.css'
import ClientRegisterPage from '../pages/Client/ClientRegisterPage'
import ClientOnboardPage from '../pages/Client/ClientOnboardPage'
import ClientHomePage from '../pages/Client/ClientHomePage'
import ClientNavbar from '../components/ClientNavbar'
import VendorProfile from '../pages/Client/VendorProfile'

function ClientLayout() {
  return (
    <div className='max-w-350 mx-auto p-4 md:p-6'>
      <ClientNavbar />
      <Outlet />
    </div>
  )
}

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/client/login' element={<ClientLoginPage />} />
          <Route path='/client/register' element={<ClientRegisterPage />} />
          <Route path='/client/onboard' element={<ClientOnboardPage />} />
          <Route element={<ClientLayout />}>
            <Route path='/client' element={<ClientHomePage />} />
            <Route path='/client/vendors/:id' element={<VendorProfile />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
