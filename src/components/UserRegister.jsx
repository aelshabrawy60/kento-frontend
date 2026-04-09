import InputComponent from './UI/InputComponent'
import ButtonComponent from './UI/ButtonComponent'
import axios from "axios";
import { useState } from 'react'

function UserRegister({ type = "clients" }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [errors, setErrors] = useState([]) // for validation errors

  const handleLogin = async () => {
    setLoading(true)
    setError(null)
    setErrors([])

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_API_URL}/${type}/register`,
        { email, password }
      )

      console.log('Success:', response.data)
      localStorage.setItem('accessToken', response.data.accessToken)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      localStorage.setItem('streamChatToken', response.data.streamChatToken)

      document.cookie = `refreshToken=${response.data.refreshToken}; path=/; secure; samesite=strict`

      // Redirect to onboarding page

      window.location.href = `/${type == "clients" ? "client" : "provider"}/onboard`

    } catch (err) {
      const problem = err.response?.data

      console.log("problem", problem)
      // Check for validation errors in 'body'
      if (problem?.errors?.body && Array.isArray(problem.errors?.body)) {
        setErrors(problem.errors.body)
      } else {
        setError(problem?.message || 'Something went wrong. Please try again.')
      }
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

        {/* Display validation errors if any */}
        {errors.length > 0 && (
          <ul className="text-red-500 text-sm mt-1 mb-2 list-disc list-inside">
            {errors.map((errMsg, idx) => (
              <li key={idx}>{errMsg}</li>
            ))}
          </ul>
        )}

        {error && (
          <p className="text-red-500 text-sm mt-1 mb-2">{error}</p>
        )}
        {!error && !errors.length && (
          <div className='mt-6'></div>
        )}

        <ButtonComponent
          label={'Register'}
          onClick={handleLogin}
          disabled={loading}
          loading={loading}
        />
      </div>
    </div>
  )
}

export default UserRegister