import React, { useEffect } from 'react'
import InputComponent from './UI/InputComponent'
import { PhoneInputComponent } from './UI/PhoneInputComponent'
import SearchableDropdownComponent from './UI/SearchableDropdownComponent'
import ButtonComponent from './UI/ButtonComponent'
import axios from 'axios'

const regions = [
    "Cairo",
    "Giza",
    "Alexandria",
    "Aswan",
    "Luxor",
    "Suez",
    "Port Said",
    "Ismailia",
    "Fayoum",
    "Minya",
    "Assiut",
    "Sohag",
    "Qena",
    "Asyut",
    "Red Sea",
    "New Valley",
    "Matrouh",
    "North Sinai",
    "South Sinai"
]

function ClientOnboard() {
  const [fullName, setFullName] = React.useState('')
  const [phoneNumber, setPhoneNumber] = React.useState('')
  const [region, setRegion] = React.useState('Cairo')
  const [error, setError] = React.useState(null)
  const [loading, setLoading] = React.useState(false)
  const [errors, setErrors] = React.useState([])


  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    setErrors([])

    try {
        await axios.post(
        `${import.meta.env.VITE_API_URL}/clients/onboard`,
        { name : fullName, phone: phoneNumber, region },
        {
            headers: {
            Authorization: `Bearer ${localStorage.getItem('accessToken')}`
            }
        }
        )

        // Redirect to Home page after successful onboarding
        window.location.href = '/client'
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
        <div className='flex flex-col gap-4'>
            <InputComponent label={"Full Name"} placeholder={"Enter your full name"} value={fullName} onChange={(e) => setFullName(e.target.value)}/>
            <PhoneInputComponent onChange={setPhoneNumber} label={"Phone Number"} placeholder={"Enter your phone number"} defaultCountry={"EG"}/>
            <SearchableDropdownComponent label={"Location"} options={regions} handleChange={setRegion} selectedVal={region}/>
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
            <ButtonComponent loading={loading} label={"Send"} onClick={handleSubmit}/>
        </div>
    </div>
  )
}

export default ClientOnboard