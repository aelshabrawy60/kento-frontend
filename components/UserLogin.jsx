import InputComponent from './UI/InputComponent'
import ButtonComponent from './UI/ButtonComponent'
import axios from "axios";
import { useState } from 'react'

function UserLogin({ type = "clients" }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${type}/login`,
        { email, password }
      )

      console.log('Success:', response.data)
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('userId', response.data.user.id)
      localStorage.setItem('userName', response.data.user.name)
      localStorage.setItem('streamChatToken', response.data.streamChatToken)

      // store the refresh token in the cookies
      document.cookie = `refreshToken=${response.data.refreshToken}; path=/; secure; samesite=strict`

      // Redirect to Home page after successful login
      window.location.href = '/client'

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