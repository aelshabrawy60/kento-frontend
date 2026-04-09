import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import ClientLoginPage from './pages/Client/ClientLoginPage'
import './App.css'
import ClientRegisterPage from './pages/Client/ClientRegisterPage'
import ClientOnboardPage from './pages/Client/ClientOnboardPage'
import ClientHomePage from './pages/Client/ClientHomePage'
import ClientNavbar from './components/ClientNavbar'
import VendorProfile from './pages/Client/VendorProfile'
import ClientChatsPage from './pages/Client/ClientChatsPage';
import ClientProfilePage from './pages/Client/ClientProfilePage'
import ClientSavesPage from './pages/Client/ClientSavesPage'

function ClientLayout() {
  return (
    <div className='max-w-350 mx-auto p-4 md:p-6 pb-26 md:pb-0'>
      <ClientNavbar />
      <Outlet />
    </div>
  )
}

function ChatLayout() {
  return (
    <div className='max-w-350 mx-auto md:p-6'>
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
          <Route path='chats/:id?' element={<ChatLayout />}>
            <Route path='' element={<ClientChatsPage />} />
          </Route>
          <Route path='/' element={<ClientLayout />}>
            <Route path='' element={<ClientHomePage />} />
            <Route path='vendors/:id' element={<VendorProfile />} />
            <Route path='profile' element={<ClientProfilePage />} />
            <Route path='saved' element={<ClientSavesPage />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
