import MessageContainer from '../../Component/Message/MessageContainer'
import useConversation from '../../Zustand/getConversation'
import Sidebar from '../../Component/Sidebar/Sidebar'

function Home() {
  const { selectedConversation } = useConversation()

  return (
    <div className="flex h-screen w-screen overflow-hidden">
      
      {/* Sidebar */}
      <div
        className={`
          ${selectedConversation ? 'hidden' : 'flex'}
          md:flex
          w-full md:w-[350px]
        `}
      >
        <Sidebar />
      </div>

      {/* Message Container */}
      <div
        className={`
          ${selectedConversation ? 'flex' : 'hidden'}
          md:flex
          flex-1
        `}
      >
        <MessageContainer />
      </div>

    </div>
  )
}

export default Home
