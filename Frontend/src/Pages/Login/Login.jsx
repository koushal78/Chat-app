import { Link } from "react-router-dom";
import uselogin from "../../Hooks/uselogin";
import { useState } from "react";

const Login = () => {
  const [username, setusername] = useState("");
  const [password, setpassword] = useState("");
  const { loading, login } = uselogin();

  const handlesumbit = async (e) => {
    e.preventDefault();
    await login(username, password);
  };

  return (
    <div className="h-screen w-screen flex items-center justify-center px-4">
      
      {/* Card */}
      <div className="w-full max-w-md rounded-2xl border border-white/10 
        bg-white/5 backdrop-blur-xl shadow-2xl p-8">

        {/* Heading */}
        <h1 className="text-3xl font-bold text-center text-white">
          Welcome Back
        </h1>
        <p className="text-center text-gray-400 mt-2">
          Login to continue to <span className="text-violet-400">ChatApp</span>
        </p>

        {/* Form */}
        <form onSubmit={handlesumbit} className="mt-8 space-y-5">
          
          {/* Username */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white 
              placeholder-gray-500 focus:outline-none 
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={username}
              onChange={(e) => setusername(e.target.value)}
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm text-gray-300 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full px-4 py-2.5 rounded-lg 
              bg-black/40 border border-white/10 text-white 
              placeholder-gray-500 focus:outline-none 
              focus:border-violet-500 focus:ring-1 focus:ring-violet-500
              transition"
              value={password}
              onChange={(e) => setpassword(e.target.value)}
            />
          </div>

          {/* Signup Link */}
          <div className="text-sm text-gray-400">
            Don’t have an account?{" "}
            <Link
              to="/SignUp"
              className="text-violet-400 hover:text-violet-300 hover:underline"
            >
              Sign up
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded-lg font-semibold text-white
            bg-gradient-to-r from-violet-500 to-purple-600
            hover:from-violet-600 hover:to-purple-700
            disabled:opacity-60 disabled:cursor-not-allowed
            transition-all"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
