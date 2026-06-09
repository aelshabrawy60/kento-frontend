import { BrowserRouter, Outlet, Route, Routes } from 'react-router-dom'
import ProtectedRoute from './components/ProtectedRoute'
import ClientLoginPage from './pages/Client/ClientLoginPage'
import './App.css'
import ClientRegisterPage from './pages/Client/ClientRegisterPage'
import ClientOnboardPage from './pages/Client/ClientOnboardPage'
import ClientHomePage from './pages/Client/ClientHomePage'
import ClientNavbar from './components/ClientNavbar'
import VendorProfile from './pages/Client/VendorProfile'
import ChatsPage from './pages/Shared/ChatsPage';
import ClientSavesPage from './pages/Client/ClientSavesPage'
import ClientContractPage from './pages/Client/ClientContractPage'
import ClientBookingsPage from './pages/Client/ClientBookingsPage'
import PaymentSuccessPage from './pages/Client/PaymentSuccessPage'
import VendorLoginPage from './pages/Vendor/VendorLoginPage'
import VendorRegisterPage from './pages/Vendor/VendorRegisterPage'
import VendorOnboardPage from './pages/Vendor/VendorOnboardPage'
import VendorDashboardPage from './pages/Vendor/VendorDashboardPage'
import VendorProfilePage from './pages/Vendor/VendorProfilePage'
import VendorContractPage from './pages/Vendor/VendorContractPage'
import VendorNavbar from './components/VendorNavbar'
import VendorPackagesPage from './pages/Vendor/VendorPackagesPage'
import AdminLoginPage from './pages/Admin/AdminLoginPage'
import AdminDashboard from './pages/Admin/AdminDashboard'

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
    <div className='max-w-350 mx-auto h-[100dvh] flex flex-col md:p-4'>
      <div className='flex-1 overflow-hidden min-h-0'>
        <Outlet />
      </div>
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
    <div className='max-w-350 mx-auto h-[100dvh] flex flex-col md:p-4'>
      <div className='flex-1 overflow-hidden min-h-0'>
        <Outlet />
      </div>
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
            <Route path='' element={<ChatsPage />} />
          </Route>

          <Route path='/' element={<ClientLayout />}>
            <Route path='' element={<ClientHomePage />} />
            <Route path='vendors/:id' element={<VendorProfile />} />
            <Route path='saved' element={
              <ProtectedRoute role="CLIENT">
                <ClientSavesPage />
              </ProtectedRoute>
            } />
            <Route path='bookings' element={
              <ProtectedRoute role="CLIENT">
                <ClientBookingsPage />
              </ProtectedRoute>
            } />
          </Route>

          <Route path='/vendor/login' element={<VendorLoginPage />} />
          <Route path='/vendor/register' element={<VendorRegisterPage />} />
          <Route path='/vendor/onboard' element={<VendorOnboardPage />} />

          {/* Payment callback pages — public so Kashier can redirect here */}
          <Route path='/payment/success' element={<PaymentSuccessPage />} />
          <Route path='/payment/failure' element={<PaymentSuccessPage />} />

          <Route path='/vendor' element={
            <ProtectedRoute role="VENDOR">
              <VendorLayout />
            </ProtectedRoute>
          }>
            <Route path='' element={<VendorDashboardPage />} />
            <Route path='profile' element={<VendorProfilePage />} />
            <Route path='packages' element={<VendorPackagesPage />} />
          </Route>

          <Route path='/vendor/chats' element={
            <ProtectedRoute role="VENDOR">
              <VendorChatLayout />
            </ProtectedRoute>
          }>
            <Route path='' element={<ChatsPage />} />
          </Route>

          {/* Admin routes */}
          <Route path='/admin/login' element={<AdminLoginPage />} />
          <Route path='/admin' element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter >
    </>
  )
}

export default App
