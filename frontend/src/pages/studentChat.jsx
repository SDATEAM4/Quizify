import { useState, useEffect } from "react";
import { Search, Send, X, PlusCircle, CheckCircle } from "lucide-react";
import { NavBar } from "../components/navbar";
import { Footer } from "../components/footer";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";

// Main component
export default function StudentChatApp() {
  const { user, enrolledSubjects } = useAuth();

  const [activeChat, setActiveChat] = useState(null);
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [subjectTeachers, setSubjectTeachers] = useState([]);
  const [teachersLoading, setTeachersLoading] = useState(false);

  // Load chat history with the new flow
  const loadChatHistory = async () => {
    setLoading(true);
    try {
      // Step 1: Get all users that are in communication with the current user
      const userResponse = await fetch(
        `http://localhost:8080/Quizify/chats/unresolved/users?userId=${user.Uid}`
      );

      if (!userResponse.ok) {
        throw new Error("Failed to load chat users");
      }

      const chatUsers = await userResponse.json();

      // Step 2: For each user, get the messages between them and the current user
      const chatPromises = chatUsers.map(async (chatUser) => {
        try {
          const messagesResponse = await fetch(
            `http://localhost:8080/Quizify/chats/${user.Uid}/${chatUser.userId}`
          );

          if (!messagesResponse.ok) {
            return null;
          }

          const messages = await messagesResponse.json();

          if (messages && messages.length > 0) {
            // Sort messages by timestamp
            const sortedMessages = messages.sort(
              (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
            );

            // Format messages for display
            const formattedMessages = sortedMessages.map((msg) => ({
              id: msg.chatId,
              sender: msg.senderId === user.Uid ? "student" : "teacher",
              content: msg.message,
              time: new Date(msg.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              }),
              timestamp: msg.timestamp,
            }));

            // Get the last message for preview
            const lastMessage = formattedMessages[formattedMessages.length - 1];

            return {
              id: chatUser.userId,
              teacherName: chatUser.fullName,
              teacherId: chatUser.userId,
              subject: chatUser.subjectName,
              lastMessage: lastMessage.content,
              timestamp: formatTimestamp(lastMessage.timestamp),
              unread: false, // In a real app, you would track this
              messages: formattedMessages,
            };
          }
          return null;
        } catch (error) {
          console.error(
            `Error fetching chat with teacher ${chatUser.fullName}:`,
            error
          );
          return null;
        }
      });

      const results = await Promise.all(chatPromises);
      const activeChats = results.filter((chat) => chat !== null);

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
      console.error("Error loading chat history:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format timestamp for display in chat list
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();

    // Same day
    if (date.toDateString() === now.toDateString()) {
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    }

    // Yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Within last week
    const lastWeek = new Date(now);
    lastWeek.setDate(now.getDate() - 7);
    if (date > lastWeek) {
      return date.toLocaleDateString([], { weekday: "long" });
    }

    // Older
    return date.toLocaleDateString();
  };

  // Initial load
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Load teachers for a subject
  const loadTeachersForSubject = async (subjectId) => {
    setTeachersLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/admin/subjects/${subjectId}/teachers`
      );

      if (!response.ok) {
        throw new Error("Failed to load teachers");
      }

      const teachers = await response.json();
      setSubjectTeachers(teachers);
    } catch (error) {
      console.error("Error loading teachers:", error);
      setSubjectTeachers([]);
    } finally {
      setTeachersLoading(false);
    }
  };

  // Send a message to the backend
  const handleSendMessage = async () => {
    if (!message.trim() || !activeChat) return;

    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/chats/${user.Uid}/${activeChat.teacherId}/message`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: message.trim(),
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      // Update the UI optimistically
      const now = new Date();
      const newMessage = {
        id: Date.now(), // temporary ID
        sender: "student",
        content: message,
        time: now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: now.toISOString(),
      };

      const updatedChats = chats.map((chat) => {
        if (chat.id === activeChat.id) {
          return {
            ...chat,
            messages: [...chat.messages, newMessage],
            lastMessage: message,
            timestamp: formatTimestamp(now),
          };
        }
        toast.success("Message Sent!");
        return chat;
      });

      setChats(updatedChats);
      setMessage("");

      // You could reload the chat to get the server-assigned ID
      // loadChatWithTeacher(activeChat.teacherId);
    } catch (error) {
      toast.success("Could not send message!");
      console.error("Error sending message:", error);
      // alert('Failed to send message. Please try again.');
    }
  };

  // Resolve a query (delete message)
  const resolveQuery = async (teacherId) => {
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/chats/resolve?senderId=${user.Uid}&receiverId=${teacherId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to resolve query");
      }

      // Reload chat history after resolution
      loadChatHistory();
      toast.success("Query resolved successfully!");
      setActiveChat(null); // Close the chat after resolving
    } catch (error) {
      console.error("Error resolving query:", error);
      toast.error("Failed to resolve query. Please try again.");
    }
  };

  // Load chat with specific teacher
  const loadChatWithTeacher = async (teacherId, teacherName, subjectName) => {
    try {
      const response = await fetch(
        `http://localhost:8080/Quizify/chats/${user.Uid}/${teacherId}`
      );

      if (!response.ok) {
        throw new Error("Failed to load chat history");
      }

      const messages = await response.json();
      
      // Format messages for display
      const formattedMessages = messages.map((msg) => ({
        id: msg.chatId,
        sender: msg.senderId === user.Uid ? "student" : "teacher",
        content: msg.message,
        time: new Date(msg.timestamp).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
        timestamp: msg.timestamp,
      }));

      const newChat = {
        id: teacherId,
        teacherName: teacherName,
        teacherId: teacherId,
        subject: subjectName,
        messages: formattedMessages,
      };

      setActiveChat(newChat);

      // Also update in the chats list
      const chatExists = chats.some((chat) => chat.id === teacherId);
      if (chatExists) {
        const updatedChats = chats.map((chat) =>
          chat.id === teacherId ? newChat : chat
        );
        setChats(updatedChats);
      } else if (formattedMessages.length > 0) {
        // Only add to chat list if there are messages
        const lastMessage = formattedMessages[formattedMessages.length - 1];
        const chatToAdd = {
          ...newChat,
          lastMessage: lastMessage.content,
          timestamp: formatTimestamp(lastMessage.timestamp),
        };
        setChats([chatToAdd, ...chats]);
      }
    } catch (error) {
      console.error("Error loading chat with teacher:", error);
    }
  };

  // Handle subject selection change
  const handleSubjectChange = (subjectId) => {
    const id = Number(subjectId) || null;
    setSelectedSubject(id);
    setSelectedTeacher(null);

    if (id) {
      loadTeachersForSubject(id);
    } else {
      setSubjectTeachers([]);
    }
  };

  // Start a new chat
  const startNewChat = () => {
    if (!selectedSubject || !selectedTeacher) return;

    const teacher = subjectTeachers.find(
      (t) => t.teacherId === Number(selectedTeacher)
    );
    const subject = enrolledSubjects.find((s) => s.id === selectedSubject);

    if (!teacher || !subject) return;

    // Get teacher's full name
    const teacherName = `${teacher.firstName} ${teacher.lastName}`;

    // Load any existing chat with this teacher
    loadChatWithTeacher(teacher.userId, teacherName, subject.name);

    // Close the modal
    setShowNewChatModal(false);
    setSelectedSubject(null);
    setSelectedTeacher(null);
    setSubjectTeachers([]);
  };

  return (
    <div className="flex flex-col h-screen">
      <NavBar />
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
              <Search
                className="absolute left-2 top-2.5 text-gray-400"
                size={20}
              />
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
                <p className="text-sm">
                  Click the + button to start a new chat with a teacher
                </p>
              </div>
            ) : (
              <div>
                {chats.map((chat) => (
                  <div
                    key={chat.id}
                    onClick={() => setActiveChat(chat)}
                    className={`p-4 border-b border-gray-200 cursor-pointer hover:bg-gray-50 ${
                      activeChat?.id === chat.id ? "bg-blue-50" : ""
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium flex items-center">
                          {chat.teacherName}
                          {chat.unread && (
                            <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full"></span>
                          )}
                        </h3>
                        <p className="text-sm text-gray-500">{chat.subject}</p>
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {chat.lastMessage}
                        </p>
                      </div>
                      <span className="text-xs text-gray-400">
                        {chat.timestamp}
                      </span>
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
                    onClick={(e) => {
                      e.stopPropagation();
                      resolveQuery(activeChat.teacherId);
                    }}
                    className="text-green-800 flex flex-row gap-2 items-center bg-green-200 p-2 rounded-m cursor-pointer ml-2"
                    title="Mark as resolved"
                  >
                    Mark As Resolved
                    <CheckCircle size={16} />
                  </button>
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
                    <p className="text-sm">
                      Send a message to {activeChat.teacherName}
                    </p>
                  </div>
                ) : (
                  activeChat.messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`mb-4 flex ${
                        msg.sender === "student"
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-3/4 p-3 rounded-lg ${
                          msg.sender === "student"
                            ? "bg-blue-500 text-white rounded-br-none"
                            : "bg-white border border-gray-200 rounded-bl-none"
                        }`}
                      >
                        <p>{msg.content}</p>
                        <div className="flex justify-between items-center mt-1">
                          <p
                            className={`text-xs ${
                              msg.sender === "student"
                                ? "text-blue-100"
                                : "text-gray-400"
                            }`}
                          >
                            {msg.time}
                          </p>
                        </div>
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
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
              <p className="text-lg">
                Select a chat or start a new conversation
              </p>
              <p className="text-sm">
                Connect with your teachers for questions and help
              </p>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Subject
                </label>
                <select
                  value={selectedSubject || ""}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                >
                  <option value="">Choose a subject</option>
                  {enrolledSubjects.map((subject) => (
                    <option key={subject.id} value={subject.id}>
                      {subject.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher Selection (only shown after subject is selected) */}
              {selectedSubject && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Select Teacher
                  </label>
                  {teachersLoading ? (
                    <p className="text-sm text-gray-500">Loading teachers...</p>
                  ) : subjectTeachers.length === 0 ? (
                    <p className="text-sm text-gray-500">
                      No teachers available for this subject
                    </p>
                  ) : (
                    <select
                      value={selectedTeacher || ""}
                      onChange={(e) => setSelectedTeacher(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value="">Choose a teacher</option>
                      {subjectTeachers.map((teacher) => (
                        <option
                          key={teacher.teacherId}
                          value={teacher.teacherId}
                        >
                          {teacher.firstName} {teacher.lastName}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
              )}

              {/* Buttons */}
              <div className="flex justify-end space-x-2 mt-6">
                <button
                  onClick={() => {
                    setShowNewChatModal(false);
                    setSelectedSubject(null);
                    setSelectedTeacher(null);
                    setSubjectTeachers([]);
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
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-blue-300 cursor-not-allowed"
                  }`}
                >
                  Start Chat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
