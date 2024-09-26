
import './App.css'
import Login from '../src/Pages/Login/Login'
import SignUp from './Pages/SignUp/SignUp'
import Home from './Pages/Home/Home'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuthContext } from './Context/Authcontext'

function App() {
  

  const {authUser} = useAuthContext();
  return (
  <>
<div className='p-4 h-screen flex justify-center items-center'>

 <Routes>
  <Route path='/' element={authUser ? <Home/> : <Navigate to={"/Login"}/>}/>
  <Route path='/Login' element={authUser ? <Navigate to={'/'}/> :<Login/>}/>
  <Route path='/SignUp' element={authUser ?  <Navigate to={'/'}/> : <SignUp/>}/>
 </Routes>
 <Toaster/>
  </div>  
  
  </>
  )
}

export default App
