import React, { useEffect } from 'react'
import InputComponent from './UI/InputComponent'
import { PhoneInputComponent } from './UI/PhoneInputComponent'
import ButtonComponent from './UI/ButtonComponent'
import RegionInputComponent from './UI/RegionInputComponent'
import api from '../api/axios'

function ClientOnboard() {
    const [fullName, setFullName] = React.useState('')
    const [phoneNumber, setPhoneNumber] = React.useState('')
    const [region, setRegion] = React.useState('Cairo')
    const [error, setError] = React.useState(null)
    const [loading, setLoading] = React.useState(false)
    const [errors, setErrors] = React.useState([])

    const validateInputs = () => {
        const newErrors = []
        if (!fullName.trim()) newErrors.push("Full Name is required")
        if (!phoneNumber || phoneNumber.length < 10) newErrors.push("Valid Phone Number is required")
        if (!region) newErrors.push("Location is required")
        return newErrors
    }

    const handleSubmit = async () => {
        const validationErrors = validateInputs()
        if (validationErrors.length > 0) {
            setErrors(validationErrors)
            return
        }

        setLoading(true)
        setError(null)
        setErrors([])

        try {
            await api.post(
                '/clients/onboard',
                { name: fullName, phone: phoneNumber, region }
            )

            // Redirect to Home page after successful onboarding
            window.location.href = '/'
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
                <InputComponent label={"Full Name"} placeholder={"Enter your full name"} value={fullName} onChange={(e) => setFullName(e.target.value)} />
                <PhoneInputComponent onChange={setPhoneNumber} label={"Phone Number"} placeholder={"Enter your phone number"} defaultCountry={"EG"} />
                <RegionInputComponent region={region} setRegion={setRegion} label={"Location"} />
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
                <ButtonComponent loading={loading} label={"Send"} onClick={handleSubmit} />
            </div>
        </div>
    )
}

export default ClientOnboard