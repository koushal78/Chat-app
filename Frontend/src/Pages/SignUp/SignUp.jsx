import { Link } from "react-router-dom";
import GenderCheckbox from './GenderCheckbox.jsx';
import { useState } from "react";
import useSignup  from "../../Hooks/useSignup.js";


const SignUp = () => {
 
	
	const [input,setinput] = useState({
		fullName:"",
		username:"",
		password:"",
		confirmPassword:"",
		gender:''
	})
	// console.log(input)
	const {loading,Signup}= useSignup();
	
	const handlecheckbox= (gender)=>{
		setinput({...input,gender})
	}
	const handleInputsumbit= async (e)=>{
		e.preventDefault();
	      await	Signup(input)
	}

	return (
		<div className='flex flex-col items-center justify-center min-w-96 mx-auto'>
			<div className='w-full p-6 rounded-lg shadow-md bg-gray-400 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-0'>
				<h1 className='text-3xl font-semibold text-center text-gray-300'>
					Sign Up <span className='text-blue-500'> ChatApp</span>
				</h1>

				<form onSubmit={handleInputsumbit}>
					<div>
						<label className='label p-2'>
							<span className='text-base label-text'>Full Name</span>
						</label>
						<input type='text' placeholder='John Doe' className='w-full input input-bordered  h-10'
						 value={input.fullName}
						 onChange={(e)=>setinput({...input,fullName:e.target.value})}
						
						/>
					</div>

					<div>
						<label className='label p-2 '>
							<span className='text-base label-text'>Username</span>
						</label>
						<input type='text' placeholder='johndoe' className='w-full input input-bordered h-10' 
						 value={input.username}
						 onChange={(e)=>setinput({...input,username:e.target.value})}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Password</span>
						</label>
						<input
							type='password'
							placeholder='Enter Password'
							className='w-full input input-bordered h-10'
							value={input.password}
							onChange={(e)=>setinput({...input,password:e.target.value})}
						/>
					</div>

					<div>
						<label className='label'>
							<span className='text-base label-text'>Confirm Password</span>
						</label>
						<input
							type='password'
							placeholder='Confirm Password'
							className='w-full input input-bordered h-10'
							value={input.confirmPassword}
							onChange={(e)=>setinput({...input,confirmPassword:e.target.value})}
						/>
					</div>

					<GenderCheckbox oncheckboxChange={handlecheckbox} selectedGender={input.gender} />

					<Link className='text-sm hover:underline hover:text-blue-600 mt-2 inline-block' to={'/Login'}>
						Already have an account?
					</Link>

					<div>
						<button type="submit" className='btn btn-block btn-sm mt-2 border border-slate-700' disabled={loading}>
							{loading?<span className="loading loading-spinner"></span> : "Sign Up"}
						</button>
					</div>
				</form>
			</div>
		</div>
	);
};
export default SignUp;