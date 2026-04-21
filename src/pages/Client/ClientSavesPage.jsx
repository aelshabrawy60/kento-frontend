import React from 'react'
import SavedPosts from '../../components/SavedPosts'
import { Navigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'

function ClientSavesPage() {
    const { isAuthenticated } = useAuth()

    if (!isAuthenticated) return <Navigate to="/client/login" />
    return (
        <div>
            <SavedPosts />
        </div>
    )
}

export default ClientSavesPage