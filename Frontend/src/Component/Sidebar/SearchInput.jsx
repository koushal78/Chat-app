import { useState } from "react";
import { IoSearchSharp } from "react-icons/io5";
import useConversaton from "../../Zustand/getConversation";
import useConversations from "../../Hooks/useConversations";
import toast from "react-hot-toast";
const SearchInput = () => {

  const [Search,setSearch] = useState()

  const { setselectedConversation } =  useConversaton();
 const {conversations} = useConversations();
 
 const handleSumbit =(e)=>{
  e.preventDefault();
  if(!Search) return;
  
  const conversation = conversations.find((c)=>c.fullName.toLowerCase().includes(Search.toLowerCase()));
  if(conversation){
    setselectedConversation(conversation);
    setSearch("");
  }else toast.error("No such user found!")
 }

  return (
    <div>
        <form onSubmit={handleSumbit} className="flex items-center gap-2">
        <input type="text" placeholder=" Search " className="input input-bordered rounded-full" 
        value={Search}

        onChange={(e)=>setSearch(e.target.value)}
        
        
        />
        <button type="submit" className="btn btn-circle bg-sky-500 text-white">
        <IoSearchSharp />
        </button>

        </form>

    </div>
  )
}

export default SearchInput
