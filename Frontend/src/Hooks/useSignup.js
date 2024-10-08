import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { json } from 'react-router-dom'
import { useAuthContext } from '../Context/Authcontext'

const useSignup = () => {
  const [loading, setLoading] = useState(false)
  const {setauthUser} = useAuthContext();

  const Signup = async ({ fullName, username, password, confirmPassword, gender }) => {
    const success = handleInputErrors({ fullName, username, password, confirmPassword, gender })

    if (!success) return;
      setLoading(true)
      try {
        const result = await fetch("/api/auth/signup", {
          method: 'POST',
          headers: { "Content-Type": 'application/json' },
          body: JSON.stringify({ fullName, username, password, confirmPassword, gender })
        })
        // Handle the result as needed here
        const data =  await result.json()
       if(data.error){
        throw new Error(data.error)
       }
       localStorage.setItem("chat-user",JSON.stringify(data))
      setauthUser(data)
  
      } catch (error) {
        toast.error(error.message)
      } finally {
        setLoading(false)
      }
    
  }

  return { loading, Signup }
}

function handleInputErrors({ fullName, username, password, confirmPassword, gender }) {
	if (!fullName || !username || !password || !confirmPassword || !gender) {
		toast.error("Please fill in all fields");
		return false;
	}

	if (password !== confirmPassword) {
		toast.error("Passwords do not match");
		return false;
	}

	if (password.length < 6) {
		toast.error("Password must be at least 6 characters");
		return false;
	}

	return true;
}
export default useSignup;  // <-- Add this line to make useSignup the default export
