
import { useEffect, useRef, useState } from "react";

type User = { id: number; name: string; status: string; };
type Message = { id: number; sender: string; content: string; emoji?: string; };

const usersMock: User[] = [
  { id: 1, name: "Alice", status: "online" },
  { id: 2, name: "Bob", status: "brb" },
  { id: 3, name: "Charlie", status: "busy" }
];

const emojis = ["😀", "😂", "❤️", "👍", "😢", "🎉"];

export default function Home() {
  const [onlineUsers, setOnlineUsers] = useState<User[]>(usersMock);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState<string | null>(null);
  const [currentUser] = useState("You");
  const messageId = useRef(1);

  const handleSend = () => {
    if (input.trim()) {
      setMessages((prev) => [...prev, { id: messageId.current++, sender: currentUser, content: input }]);
      setInput("");
      setTyping(null);
    }
  };

  const handleReact = (msgId: number, emoji: string) => {
    setMessages((msgs) =>
      msgs.map((msg) => (msg.id === msgId ? { ...msg, emoji } : msg))
    );
  };

  useEffect(() => {
    if (input) setTyping(currentUser);
    const timeout = setTimeout(() => setTyping(null), 1000);
    return () => clearTimeout(timeout);
  }, [input]);

  return (
    <div className="flex h-screen text-sm font-sans">
      <aside className="w-1/4 bg-gray-100 p-4 border-r">
        <h2 className="text-lg font-bold mb-4">Online Users</h2>
        <ul className="space-y-2">
          {onlineUsers.map((user) => (
            <li key={user.id} className="flex justify-between">
              <span>{user.name}</span>
              <span className="text-gray-500">{user.status}</span>
            </li>
          ))}
        </ul>
      </aside>

      <main className="flex-1 flex flex-col">
        <header className="p-4 border-b bg-white">
          <h1 className="text-xl font-semibold">Chat Room</h1>
        </header>

        <section className="flex-1 overflow-y-auto p-4 space-y-2 bg-gray-50">
          {messages.map((msg) => (
            <div key={msg.id} className="flex justify-between items-center bg-white rounded p-2 shadow">
              <div>
                <strong>{msg.sender}: </strong>{msg.content}
              </div>
              <div className="flex space-x-1">
                {emojis.map((e) => (
                  <button key={e} className="hover:scale-125" onClick={() => handleReact(msg.id, e)}>{e}</button>
                ))}
                {msg.emoji && <span>{msg.emoji}</span>}
              </div>
            </div>
          ))}
        </section>

        <footer className="p-4 bg-white border-t flex items-center space-x-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            className="border p-2 rounded flex-1"
            placeholder="Type a message..."
          />
          <button onClick={handleSend} className="bg-blue-500 text-white px-4 py-2 rounded">Send</button>
        </footer>

        {typing && <div className="p-2 text-gray-500 text-sm">💬 {typing} is typing...</div>}
      </main>
    </div>
  );
}
