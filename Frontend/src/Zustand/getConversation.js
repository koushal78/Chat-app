import {create} from 'zustand'

const useConversaton = create((set)=>({
    selectedConversation:null,
    setselectedConversation: (selectedConversation)=>set({selectedConversation}),
    message:[],
    setmessage:(message)=>set({message})

}))
export default useConversaton;