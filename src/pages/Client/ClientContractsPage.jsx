import React from 'react'
import Contracts from '../../components/Contracts'
import useAuth from '../../hooks/useAuth'
import { Navigate } from 'react-router-dom'

function ClientContractsPage() {
    const { isAuthenticated } = useAuth()
    if (!isAuthenticated) return <Navigate to="/client/login" />
    return (
        <div>
            <Contracts />
        </div>
    )
}

export default ClientContractsPage