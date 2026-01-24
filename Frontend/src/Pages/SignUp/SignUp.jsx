import { Link } from "react-router-dom";
import GenderCheckbox from "./GenderCheckbox.jsx";
import { useState } from "react";
import useSignup from "../../Hooks/useSignup.js";

const SignUp = () => {
  const [input, setinput] = useState({
    fullName: "",
    username: "",
    password: "",
    confirmPassword: "",
    gender: "",
  });

  const { loading, Signup } = useSignup();

  const handlecheckbox = (gender) => {
    setinput({ ...input, gender });
  };

  const handleInputsumbit = async (e) => {
    e.preventDefault();
    await Signup(input);
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center 
     px-4">

      {/* Card */}
      <div className="w-full max-w-md rounded-2xl 
        border border-white/10 bg-white/5 backdrop-blur-xl 
        shadow-2xl p-8">

        {/* Header */}
        <h1 className="text-3xl font-bold text-center text-white">
          Create Account
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Join <span className="text-violet-400">ChatApp</span> today
        </p>

        {/* Form */}
        <form onSubmit={handleInputsumbit} className="mt-8 space-y-4">

          {/* Full Name */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Ravi kumar"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white
              placeholder-gray-500 focus:outline-none
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={input.fullName}
              onChange={(e) =>
                setinput({ ...input, fullName: e.target.value })
              }
            />
          </div>

          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Ravikumar"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white
              placeholder-gray-500 focus:outline-none
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={input.username}
              onChange={(e) =>
                setinput({ ...input, username: e.target.value })
              }
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter password"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white
              placeholder-gray-500 focus:outline-none
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={input.password}
              onChange={(e) =>
                setinput({ ...input, password: e.target.value })
              }
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm password"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white
              placeholder-gray-500 focus:outline-none
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={input.confirmPassword}
              onChange={(e) =>
                setinput({ ...input, confirmPassword: e.target.value })
              }
            />
          </div>

          {/* Gender */}
          <div className="pt-2">
            <GenderCheckbox
              oncheckboxChange={handlecheckbox}
              selectedGender={input.gender}
            />
          </div>

          {/* Login Link */}
          <p className="text-sm text-gray-400 mt-2">
            Already have an account?{" "}
            <Link
              to="/Login"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Login
            </Link>
          </p>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 py-2.5 rounded-lg font-semibold text-white
            bg-gradient-to-r from-violet-500 to-purple-600
            hover:from-violet-600 hover:to-purple-700
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all"
          >
            {loading ? "Creating account..." : "Sign Up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
