import {create} from 'zustand'

const useConversaton = create((set)=>({
    selectedConversation:null,
    setselectedConversation: (selectedConversation)=>set({selectedConversation}),
    messages:[],
    setmessage:(messages)=>set({messages})

}))
export default useConversaton;