import { useState, useEffect } from 'react';
import { Search, Send, X, CheckCircle } from 'lucide-react';
import { TeacherNavbar } from '../components/teacherNavbar';
import { Footer } from '../components/footer';
import { useAuth } from '../context/authContext';

// Main component
export default function TeacherChatApp() {
  const { user } = useAuth();

  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState('');
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Load chat history with the same flow as StudentChatApp
  const loadChatHistory = async () => {
    setLoading(true);
    try {
      const userResponse = await fetch(`http://localhost:8080/Quizify/chats/unresolved/users?userId=${user.Uid}`);
      
      if (!userResponse.ok) {
        throw new Error('Failed to load chat users');
      }
      
      const chatUsers = await userResponse.json();
      
      // Step 2: For each user, get the messages between them and the current teacher
      const chatPromises = chatUsers.map(async (chatUser) => {
        try {
          const messagesResponse = await fetch(`http://localhost:8080/Quizify/chats/${user.Uid}/${chatUser.userId}`);
          
          if (!messagesResponse.ok) {
            return null;
          }
          
          const messages = await messagesResponse.json();
          
          if (messages && messages.length > 0) {
            // Sort messages by timestamp
            const sortedMessages = messages.sort((a, b) => 
              new Date(a.timestamp) - new Date(b.timestamp)
            );
            
            // Format messages for display
            const formattedMessages = sortedMessages.map(msg => ({
              id: msg.chatId,
              sender: msg.senderId === user.Uid ? 'teacher' : 'student',  // Fixed: Use user.Uid instead of user.id
              content: msg.message,
              time: new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              timestamp: msg.timestamp
            }));
            
            // Get the last message for preview
            const lastMessage = formattedMessages[formattedMessages.length - 1];
            
            return {
              id: chatUser.userId,
              studentName: chatUser.fullName,
              studentId: chatUser.userId,
              subjectName: chatUser.subjectName,
              subjectId: chatUser.subjectId,
              lastMessage: lastMessage.content,
              timestamp: formatTimestamp(lastMessage.timestamp),
              unread: false, // In a real app, you would track this
              messages: formattedMessages
            };
          }
          return null;
        } catch (error) {
          console.error(`Error fetching chat with student ${chatUser.fullName}:`, error);
          return null;
        }
      });
      
      const results = await Promise.all(chatPromises);
      const activeChats = results.filter(chat => chat !== null);
      
      // Sort chats by the most recent message
      activeChats.sort((a, b) => {
        if (!a.messages.length) return 1;
        if (!b.messages.length) return -1;
        
        const aTime = a.messages[a.messages.length - 1].timestamp;
        const bTime = b.messages[b.messages.length - 1].timestamp;
        return new Date(bTime) - new Date(aTime);
      });
      
      setChats(activeChats);
    } catch (error) {
      console.error('Error loading chat history:', error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp (similar to StudentChatApp)
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    const now = new Date();
    
    // Same day
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    }
    
    // Within last week
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    if (date > lastWeek) {
      return date.toLocaleDateString([], { weekday: 'long' });
    }
    
    // Older
    return date.toLocaleDateString();
  };

  // Initial load
  useEffect(() => {
    if (user && user.Uid) {
      loadChatHistory();
    }
  }, [user]);

  // Send a message to the backend
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;
    
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/chats/${user.Uid}/${activeChat.studentId}/message`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: message.trim()
          }),
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to send message');
      }
      
      // Update the UI optimistically
      const now = new Date();
      const newMessage = {
        id: Date.now(), // temporary ID
        sender: 'teacher',
        content: message,
        time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        timestamp: now.toISOString()
      };
      
      // Update active chat with new message
      setActiveChat(prevChat => ({
        ...prevChat,
        messages: [...prevChat.messages, newMessage]
      }));
      
      // Update chat in list
      const updatedChats = chats.map(chat => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message,
            timestamp: formatTimestamp(now)
          };
        }
        return chat;
      });
      
      setChats(updatedChats);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    }
  };

  // Load chat with specific student
  const loadChatWithStudent = async (studentId) => {
    const chat = chats.find(c => c.id === studentId);
    if (chat) {
      setActiveChat(chat);
      
      // If there are unread messages, mark them as read
      if (chat.unread) {
        try {
          await fetch(
            `http://localhost:8080/Quizify/chats/${user.Uid}/${studentId}/read`,  // Fixed: Use user.Uid instead of user.id
            { method: 'PUT' }
          );
          
          // Update unread status in chat list
          const updatedChats = chats.map(c => 
            c.id === studentId ? { ...c, unread: false } : c
          );
          
          setChats(updatedChats);
        } catch (error) {
          console.error('Error marking messages as read:', error);
        }
      }
    }
  };

  
  // Filter chats based on search query
  const filteredChats = chats.filter(chat => 
    chat.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (chat.subjectName && chat.subjectName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    chat.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-2 top-2.5 text-gray-400" size={20} />
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <p>Loading queries...</p>
              </div>
            ) : filteredChats.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                <p className="text-lg">No open queries</p>
                <p className="text-sm">When students send you questions, they'll appear here</p>
              </div>
            ) : (
              <div>
                {filteredChats.map(chat => (
                  <div 
                    key={chat.id}
                    onClick={() => loadChatWithStudent(chat.id)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${activeChat?.id === chat.id ? 'bg-blue-50' : ''}`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {chat.studentName}
                          {chat.unread && <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>}
                        </h3>
                        <p className="text-sm text-gray-600 truncate mt-1">{chat.lastMessage}</p>
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
              <div className="flex-1 overflow-y-auto p-4 bg-gray-50" id="messagesContainer">
                {activeChat.messages && activeChat.messages.length > 0 ? (
                  activeChat.messages.map((msg, index) => (
                    <div 
                      key={msg.id || index} 
                      className={`mb-4 flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div 
                        className={`max-w-xs md:max-w-md lg:max-w-lg p-3 rounded-lg ${
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
                  ))
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-gray-400">No messages yet</p>
                  </div>
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