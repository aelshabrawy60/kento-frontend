import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ClientLoginPage from './pages/Client/ClientLoginPage'
import './App.css'
import ClientRegisterPage from './pages/Client/ClientRegisterPage'
import ClientOnboardPage from './pages/Client/ClientOnboardPage'
import ClientHomePage from './pages/Client/ClientHomePage'
import ClientNavbar from './components/ClientNavbar'
import VendorProfile from './pages/Client/VendorProfile'
import ClientChatsPage from './pages/Client/ClientChatsPage';
import ClientSavesPage from './pages/Client/ClientSavesPage'
import ClientContractPage from './pages/Client/ClientContractPage'
import ClientContractsPage from './pages/Client/ClientContractsPage'
import VendorLoginPage from './pages/Vendor/VendorLoginPage'
import VendorRegisterPage from './pages/Vendor/VendorRegisterPage'
import VendorOnboardPage from './pages/Vendor/VendorOnboardPage'
import VendorDashboardPage from './pages/Vendor/VendorDashboardPage'
import VendorProfilePage from './pages/Vendor/VendorProfilePage'
import VendorContractPage from './pages/Vendor/VendorContractPage'
import VendorContractsPage from './pages/Vendor/VendorContractsPage'
import VendorNavbar from './components/VendorNavbar'
import VendorPackagesPage from './pages/Vendor/VendorPackagesPage'

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

function VendorLayout() {
  return (
    <div className='max-w-350 mx-auto p-4 md:p-6 pb-26 md:pb-0'>
      <VendorNavbar />
      <Outlet />
    </div>
  )
}

function VendorChatLayout() {
  return (
    <div className='max-w-350 mx-auto md:p-6'>
      <VendorNavbar />
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

          <Route path='chats/:id?' element={
            <ProtectedRoute role="CLIENT">
              <ChatLayout />
            </ProtectedRoute>
          }>
            <Route path='' element={<ClientChatsPage />} />
          </Route>

          <Route path='/' element={<ClientLayout />}>
            <Route path='' element={<ClientHomePage />} />
            <Route path='vendors/:id' element={<VendorProfile />} />
            <Route path='contracts' element={
              <ProtectedRoute role="CLIENT">
                <ClientContractsPage />
              </ProtectedRoute>
            } />
            <Route path='saved' element={
              <ProtectedRoute role="CLIENT">
                <ClientSavesPage />
              </ProtectedRoute>
            } />
            <Route path='contracts/:id' element={
              <ProtectedRoute role="CLIENT">
                <ClientContractPage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path='/vendor/login' element={<VendorLoginPage />} />
          <Route path='/vendor/register' element={<VendorRegisterPage />} />
          <Route path='/vendor/onboard' element={<VendorOnboardPage />} />

          <Route path='/vendor' element={
            <ProtectedRoute role="VENDOR">
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path='' element={<VendorDashboardPage />} />
            <Route path='contracts' element={<VendorContractsPage />} />
            <Route path='contracts/:id' element={<VendorContractPage />} />
            <Route path='profile' element={<VendorProfilePage />} />
            <Route path='packages' element={<VendorPackagesPage />} />
          </Route>

          <Route path='/vendor/chats' element={
            <ProtectedRoute role="VENDOR">
              <VendorChatLayout />
            </ProtectedRoute>
          }>
            <Route path='' element={<ClientChatsPage />} />
          </Route>
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
