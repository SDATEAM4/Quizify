import { useState, useEffect } from 'react';
import { Search, Send, X, PlusCircle } from 'lucide-react';
import { NavBar } from '../components/navbar';
import { Footer } from '../components/footer';
// Main component
export default function StudentChatApp() {
  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);

  // Dummy data for demonstration
  const subjects = [
    { id: 1, name: 'Mathematics' },
    { id: 2, name: 'Physics' },
    { id: 3, name: 'Chemistry' },
    { id: 4, name: 'Biology' },
    { id: 5, name: 'Computer Science' }
  ];

  const teachers = [
    { id: 1, name: 'Dr. Johnson', subjectIds: [1, 2] },
    { id: 2, name: 'Ms. Williams', subjectIds: [1, 3] },
    { id: 3, name: 'Mr. Davis', subjectIds: [2, 5] },
    { id: 4, name: 'Mrs. Rodriguez', subjectIds: [3, 4] },
    { id: 5, name: 'Prof. Wilson', subjectIds: [4, 5] }
  ];

  // Simulate fetching data from API
  useEffect(() => {
    setTimeout(() => {
      const dummyChats = [
        {
          id: 1,
          teacherName: 'Dr. Johnson',
          teacherId: 1,
          subject: 'Mathematics',
          subjectId: 1,
          lastMessage: 'Remember to practice those integration problems',
          timestamp: '11:45 AM',
          unread: true,
          messages: [
            { sender: 'student', content: 'Hello, I need help with calculus derivatives', time: '10:30 AM' },
            { sender: 'teacher', content: 'Hi there! What specific part of derivatives are you struggling with?', time: '10:45 AM' },
            { sender: 'student', content: 'The chain rule is confusing me. Can you explain with an example?', time: '11:00 AM' },
            { sender: 'teacher', content: 'Sure! The chain rule helps us find the derivative of composite functions. For example, if f(x) = sin(x²), then f\'(x) = cos(x²) · 2x. Remember to practice those integration problems', time: '11:45 AM' }
          ]
        },
        {
          id: 2,
          teacherName: 'Mrs. Rodriguez',
          teacherId: 4,
          subject: 'Chemistry',
          subjectId: 3,
          lastMessage: 'Your lab report looks good. Make sure to submit by Friday!',
          timestamp: 'Yesterday',
          unread: false,
          messages: [
            { sender: 'student', content: 'Hi Mrs. Rodriguez, I\'ve attached my draft lab report. Could you take a look?', time: 'Yesterday' },
            { sender: 'teacher', content: 'Your lab report looks good. Make sure to submit by Friday!', time: 'Yesterday' }
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
    // POST to http://localhost:8080/Quizify/chats/{student}/{teacher}/message
    
    // For now, just update the UI
    const updatedChats = chats.map(chat => {
      if (chat.id === activeChat.id) {
        return {
          ...chat,
          messages: [...chat.messages, { sender: 'student', content: message, time: 'Just now' }]
        };
      }
      return chat;
    });
    
    setChats(updatedChats);
    setMessage('');
  };

  const startNewChat = () => {
    if (!selectedSubject || !selectedTeacher) return;
    
    // In a real app, we would call the API to create a new chat
    // For now, just update the UI
    const newChat = {
      id: chats.length + 1,
      teacherName: teachers.find(t => t.id === selectedTeacher).name,
      teacherId: selectedTeacher,
      subject: subjects.find(s => s.id === selectedSubject).name,
      subjectId: selectedSubject,
      lastMessage: 'Start a new conversation',
      timestamp: 'Just now',
      unread: false,
      messages: []
    };
    
    setChats([newChat, ...chats]);
    setActiveChat(newChat);
    setShowNewChatModal(false);
    setSelectedSubject(null);
    setSelectedTeacher(null);
  };

  const filteredTeachers = selectedSubject 
    ? teachers.filter(teacher => teacher.subjectIds.includes(selectedSubject))
    : [];

  return (
    <div className='flex flex-col h-screen'> 
          <NavBar/>
          <div className="flex flex-1 bg-gray-100 overflow-hidden">
      {/* Sidebar */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-bold">My Teacher Chats</h1>
            <button 
              onClick={() => setShowNewChatModal(true)}
              className="p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600"
            >
              <PlusCircle size={20} />
            </button>
          </div>
          <div className="mt-2 relative">
            <input
              type="text"
              placeholder="Search chats..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md pl-9"
            />
            <Search className="absolute left-2 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center items-center h-full">
              <p>Loading your chats...</p>
            </div>
          ) : chats.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-lg">No active chats</p>
              <p className="text-sm">Click the + button to start a new chat with a teacher</p>
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
                        {chat.teacherName}
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
                <h2 className="font-bold">{activeChat.teacherName}</h2>
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
              {activeChat.messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <p className="text-lg">Start a conversation</p>
                  <p className="text-sm">Send a message to {activeChat.teacherName}</p>
                </div>
              ) : (
                activeChat.messages.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`mb-4 flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-3/4 p-3 rounded-lg ${
                        msg.sender === 'student' 
                          ? 'bg-blue-500 text-white rounded-br-none' 
                          : 'bg-white border border-gray-200 rounded-bl-none'
                      }`}
                    >
                      <p>{msg.content}</p>
                      <p className={`text-xs mt-1 ${msg.sender === 'student' ? 'text-blue-100' : 'text-gray-400'}`}>
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))
              )}
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
            <p className="text-lg">Select a chat or start a new conversation</p>
            <p className="text-sm">Connect with your teachers for questions and help</p>
          </div>
        )}
      </div>

      {/* New Chat Modal */}
{showNewChatModal && (
  <div className="fixed inset-0 bg-transparent bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 shadow-xl">
      <h2 className="text-xl font-bold mb-4">Start a New Chat</h2>
      
      {/* Subject Selection */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
        <select
          value={selectedSubject || ''}
          onChange={(e) => {
            setSelectedSubject(Number(e.target.value));
            setSelectedTeacher(null);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md"
        >
          <option value="">Choose a subject</option>
          {subjects.map(subject => (
            <option key={subject.id} value={subject.id}>{subject.name}</option>
          ))}
        </select>
      </div>
      
      {/* Teacher Selection (only shown after subject is selected) */}
      {selectedSubject && (
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Select Teacher</label>
          <select
            value={selectedTeacher || ''}
            onChange={(e) => setSelectedTeacher(Number(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Choose a teacher</option>
            {filteredTeachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
        </div>
      )}
      
      {/* Buttons */}
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => {
            setShowNewChatModal(false);
            setSelectedSubject(null);
            setSelectedTeacher(null);
          }}
          className="px-4 py-2 text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          onClick={startNewChat}
          disabled={!selectedSubject || !selectedTeacher}
          className={`px-4 py-2 text-white rounded-md ${
            selectedSubject && selectedTeacher
              ? 'bg-blue-500 hover:bg-blue-600'
              : 'bg-blue-300 cursor-not-allowed'
          }`}
        >
          Start Chat
        </button>
      </div>
    </div>
  </div>
)}
    </div>
    <Footer/>
    </div>
  );
}