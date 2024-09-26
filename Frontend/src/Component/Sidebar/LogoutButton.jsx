import { BiLogOut } from "react-icons/bi";
import useLogout from "../../Hooks/useLogout";

const LogoutButton = () => {
  const{loading,logout} = useLogout();
  return (
    <div className="my-4">
{!loading?(<BiLogOut  className="w-8 h-6 text-white cursor-pointer"

onClick={logout}
/>):(
  <span className='loading loading-spinner'></span>
)}

    </div>
  )
}

export default LogoutButton