import InputComponent from './UI/InputComponent'
import ButtonComponent from './UI/ButtonComponent'
import axios from "axios";
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { useNavigate } from 'react-router-dom'

function UserLogin({ type = "clients" }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${type}/login`,
        { email, password }
      )

      console.log('Success:', response.data)
      const { user, accessToken, refreshToken, streamChatToken } = response.data
      
      login(user, accessToken, refreshToken, streamChatToken)

      // Redirect to Home page after successful login
      navigate(type === 'clients' ? '/' : '/vendor')

    } catch (err) {
      const problem = err.response?.data

      const message =
        problem.message || 'Something went wrong. Please try again.'

      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div>
        <div className='flex flex-col gap-4'>
          <InputComponent
            label="Email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <InputComponent
            label="Password"
            placeholder="Enter your password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

        </div>

        {error && (
          <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>
        )}
        {!error && (
          <div className='mt-6'></div>
        )}

        <ButtonComponent
          label={'Login'}
          onClick={handleLogin}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default UserLogin