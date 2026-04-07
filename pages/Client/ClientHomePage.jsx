import { data } from 'react-router-dom'
import ClientNavbar from '../../components/ClientNavbar'
import DiscoverVendors from '../../components/DiscoverVendors'
import VendorCard from '../../components/VendorCard'
import VendorMiniProfile from '../../components/VendorMiniProfile'
import VendorProfileSection from '../../components/VendorProfileSection'



function ClientHomePage() {
  return (
    <div>
        <DiscoverVendors/>
    </div>
  )
}

export default ClientHomePage