import React, { useState, useEffect, useRef } from 'react';
import { 
  AiOutlinePlus,
  AiOutlineSmile,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineUpload,
  AiOutlineFileText,
  AiOutlineTranslation,
  AiOutlineSend,
  AiOutlineSearch,
  AiOutlineClose,
  AiOutlineCheck,
  AiOutlineClockCircle,
  AiOutlineMore,
  AiOutlineDown
} from 'react-icons/ai';
import { BsHash, BsLightning } from 'react-icons/bs';
import userService from '../../services/userService';
import conversationService from '../../services/conversationService';

const UserDropdown = ({ selectedUser, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userData = await userService.getUsers();
        // Only get active users
        const activeUsers = userData.filter(user => user.user_is_active);
        // Transform the data to match our UI needs
        const transformedUsers = activeUsers.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          avatar: user.name.charAt(0),
          color: `bg-${getRandomColor()}-100`
        }));
        setUsers(transformedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const getRandomColor = () => {
    const colors = ['red', 'blue', 'green', 'yellow', 'purple', 'pink', 'orange'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 hover:bg-gray-50 rounded-lg"
      >
        <div className="flex items-center gap-1">
          <span className={`w-6 h-6 rounded-full ${selectedUser.color} flex items-center justify-center text-sm`}>
            {selectedUser.avatar}
          </span>
          <span className="text-sm font-medium">{selectedUser.name}</span>
        </div>
        <AiOutlineDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-64 bg-white rounded-lg shadow-lg border z-50">
          <div className="p-2">
            <div className="mb-2 font-medium text-sm px-2">USERS</div>
            <div className="relative mb-2">
              <input
                type="text"
                placeholder="Search users..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 text-sm border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary-light"
              />
              <AiOutlineSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            </div>
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="text-center py-2 text-sm text-gray-500">Loading users...</div>
              ) : filteredUsers.length > 0 ? (
                filteredUsers.map(user => (
                  <button
                    key={user.id}
                    onClick={() => {
                      onSelect(user);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-2 px-2 py-1.5 text-sm hover:bg-primary-light rounded ${
                      selectedUser.id === user.id ? 'bg-primary-light' : ''
                    }`}
                  >
                    <span className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center`}>
                      {user.avatar}
                    </span>
                    <span>{user.name}</span>
                  </button>
                ))
              ) : (
                <div className="text-center py-2 text-sm text-gray-500">No users found</div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatBox = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState(chat?.assigned_to || null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (chat?.messages) {
      setMessages(chat.messages);
      setSelectedUser(chat.assigned_to);
    }
  }, [chat]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSend = async () => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      const newMessage = await conversationService.sendMessage(chat.id, message.trim());
      
      // Add the new message to the UI
      setMessages(prev => [...prev, {
        id: newMessage.id,
        content: newMessage.content,
        type: newMessage.message_type,
        mediaUrl: newMessage.media_url,
        timestamp: newMessage.timestamp,
        isFromCustomer: false,
        status: newMessage.status
      }]);
      
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
      // Show error toast or notification
    } finally {
      setLoading(false);
    }
  };

  const handleAssign = async (userId) => {
    try {
      await conversationService.assignConversation(chat.id, userId);
      setSelectedUser(userId);
    } catch (error) {
      console.error('Error assigning conversation:', error);
      // Show error toast or notification
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMessageStatusIcon = (status) => {
    switch (status) {
      case 'sent':
        return <AiOutlineCheck className="w-4 h-4 text-gray-400" />;
      case 'delivered':
        return <div className="flex"><AiOutlineCheck className="w-4 h-4 text-blue-500" /><AiOutlineCheck className="w-4 h-4 text-blue-500 -ml-2" /></div>;
      case 'read':
        return <div className="flex"><AiOutlineCheck className="w-4 h-4 text-green-500" /><AiOutlineCheck className="w-4 h-4 text-green-500 -ml-2" /></div>;
      case 'pending':
      default:
        return <AiOutlineClockCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white">
        <div className="flex items-center gap-3">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${chat?.color || 'bg-blue-100'}`}>
            <span className="text-lg font-medium">{chat?.name?.[0]}</span>
          </div>
          <div>
            <h3 className="font-medium">{chat?.name}</h3>
            <p className="text-sm text-gray-500">{chat?.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <UserDropdown selectedUser={selectedUser} onSelect={handleAssign} />
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <AiOutlineMore className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.isFromCustomer ? 'justify-start' : 'justify-end'}`}
          >
            <div
              className={`max-w-[70%] rounded-lg px-4 py-2 ${
                msg.isFromCustomer
                  ? 'bg-white'
                  : 'bg-primary text-white'
              }`}
            >
              {msg.type === 'imageMessage' && msg.mediaUrl && (
                <img 
                  src={msg.mediaUrl} 
                  alt="Shared image" 
                  className="max-w-full rounded-lg mb-2"
                />
              )}
              <p>{msg.content}</p>
              <div className={`text-xs mt-1 flex items-center gap-1 ${
                msg.isFromCustomer ? 'text-gray-500' : 'text-gray-300'
              }`}>
                {formatTimestamp(msg.timestamp)}
                {!msg.isFromCustomer && getMessageStatusIcon(msg.status)}
              </div>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-4 py-3 border-t bg-white">
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-full">
            <AiOutlinePlus className="w-5 h-5" />
          </button>
          <div className="flex-grow">
            <input
              type="text"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="w-full px-4 py-2 bg-gray-50 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
          </div>
          <button
            onClick={handleSend}
            disabled={loading || !message.trim()}
            className={`p-2 rounded-full ${
              loading || !message.trim()
                ? 'text-gray-400 hover:bg-gray-100'
                : 'text-primary hover:bg-primary-light'
            }`}
          >
            <AiOutlineSend className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
