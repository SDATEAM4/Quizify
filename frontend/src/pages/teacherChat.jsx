import { useState, useEffect } from 'react';
import { Search, Send, X, CheckCircle } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import { Footer } from '../components/footer';

// Main component
export default function TeacherChatApp() {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  // Dummy data for demonstration
  useEffect(() => {
    // Simulate fetching data from API
    setTimeout(() => {
      const dummyChats = [
        {
          id: 1,
          studentName: 'John Smith',
          subject: 'Mathematics',
          subjectId: 1,
          lastMessage: 'I need help with calculus derivatives',
          timestamp: '10:30 AM',
          unread: true,
          messages: [
            { sender: 'student', content: 'Hello, I need help with calculus derivatives', time: '10:30 AM' },
            { sender: 'student', content: 'Specifically, I don\'t understand the chain rule application', time: '10:31 AM' },
          ]
        },
        {
          id: 2,
          studentName: 'Emily Johnson',
          subject: 'Physics',
          subjectId: 2,
          lastMessage: 'Can you explain Newton\'s third law?',
          timestamp: '9:45 AM',
          unread: false,
          messages: [
            { sender: 'student', content: 'Hi teacher, I\'m confused about Newton\'s laws', time: '9:43 AM' },
            { sender: 'student', content: 'Can you explain Newton\'s third law?', time: '9:45 AM' },
          ]
        },
        {
          id: 3,
          studentName: 'Michael Brown',
          subject: 'Chemistry',
          subjectId: 3,
          lastMessage: "I'm stuck on balancing this equation",
          timestamp: 'Yesterday',
          unread: true,
          messages: [
            { sender: 'student', content: 'Hello, I need help with chemistry homework', time: 'Yesterday' },
            { sender: 'student', content: "I'm stuck on balancing this equation: H2 + O2 → H2O', time: 'Yesterday" },
          ]
        }
      ];
      setChats(dummyChats);
      setLoading(false);
    }, 1000);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    
    // In a real app, we would send this to the API
    // POST to http://localhost:8080/Quizify/chats/{teacher}/{student}/message
    
    // For now, just update the UI
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, { sender: 'teacher', content: message, time: 'Just now' }]
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setMessage('');
  };

  const handleMarkAsResolved = (chatId) => {
    // In a real app, we would call the API to update status
    // For now, just remove from the list
    const updatedChats = chats.filter(chat => chat.id !== chatId);
    setChats(updatedChats);
    setActiveChat(null);
  };

  return (
    <div className='flex flex-col h-screen'> 
      <TeacherNavbar/>
      <div className="flex flex-1 bg-gray-100 overflow-hidden"> 
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">Student Queries</h1>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search queries..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md pl-9"
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading queries...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">No open queries</p>
              <p className="text-sm">When students send you questions, they'll appear here</p>
            </div>
          ) : (
            <div>
              {chats.map(chat => (
                <div 
                  key={chat.id}
                  onClick={() => setActiveChat(chat)}
                  className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium flex items-center">
                        {chat.studentName}
                        {chat.unread && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
                      </h3>
                      <p className="text-sm text-gray-500">{chat.subject}</p>
                    </div>
                    <span className="text-xs text-gray-400">{chat.timestamp}</span>
                  </div>
                  
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-white">
              <div>
                <h2 className="font-bold">{activeChat.studentName}</h2>
                <p className="text-sm text-gray-500">{activeChat.subject}</p>
              </div>
              <div className="flex space-x-2">
                
                <button 
                  onClick={() => setActiveChat(null)}
                  className="p-1 rounded-md hover:bg-gray-100"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {activeChat.messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`mb-4 flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                >
                  <div 
                    className={`max-w-3/4 p-3 rounded-lg ${
                      msg.sender === 'teacher' 
                        ? 'bg-blue-500 text-white rounded-br-none' 
                        : 'bg-white border border-gray-200 rounded-bl-none'
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p className={`text-xs mt-1 ${msg.sender === 'teacher' ? 'text-blue-100' : 'text-gray-400'}`}>
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <div className="flex">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button
                  onClick={handleSendMessage}
                  className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600"
                >
                  <Send size={20} />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-500">
            <p className="text-lg">Select a query to start chatting</p>
            <p className="text-sm">Choose from the list on the left</p>
          </div>
        )}
      </div>
    </div>
    <Footer/>
    </div>
  );
}