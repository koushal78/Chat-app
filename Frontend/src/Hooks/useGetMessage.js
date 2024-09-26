import { useEffect, useState } from "react";
import useConversaton from "../Zustand/getConversation";
import toast from "react-hot-toast";

const useGetMessage = () => {
  const [loading, setLoading] = useState(false);
  const { message, setmessage, selectedConversation } = useConversaton();

  useEffect(() => {
    const getMessage = async () => {
      setLoading(true);
     try{
      const res = await fetch(`/api/message/${selectedConversation._id}`);
      const data = await res.json();
      if(data.error) throw new(data.error)
      setmessage(data)
     }
     
      catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    if (selectedConversation?._id) getMessage();
  }, [selectedConversation?._id, setmessage]); // Corrected the dependency

  return { loading, message };
};

export default useGetMessage;
