import React from 'react';
import { 
  AiOutlineSearch, 
  AiOutlinePlus, 
  AiOutlineFilter,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineTag,
  AiOutlineStar,
  AiOutlineMessage,
  AiOutlineCheck
} from 'react-icons/ai';

const ChatList = ({ selectedChat, onChatSelect, activeTab, onTabChange }) => {
  const tabs = [
    { id: 'unassigned', icon: AiOutlineTeam, label: 'Unassigned', count: 2 },
    { id: 'assigned', icon: AiOutlineUser, label: 'Assigned to me', count: 1 },
    { id: 'mentions', icon: AiOutlineTag, label: 'Mentions', count: 0 },
    { id: 'pinned', icon: AiOutlineStar, label: 'Pinned', count: 3 },
    { id: 'open', icon: AiOutlineMessage, label: 'Open', count: 5 },
    { id: 'resolved', icon: AiOutlineCheck, label: 'Resolved', count: 0 }
  ];

  // Dummy data for demonstration
  const chatsByCategory = {
    unassigned: [
      {
        id: 1,
        name: 'aerospaceship!',
        lastMessage: 'Hello! Can I get more info on this?',
        time: '10:25 AM',
        unread: 0,
        avatar: 'A',
        isOnline: true
      },
      {
        id: 2,
        name: 'John Doe',
        lastMessage: 'Looking for pricing details',
        time: '09:15 AM',
        unread: 1,
        avatar: 'J',
        isOnline: false
      }
    ],
    assigned: [
      {
        id: 3,
        name: 'Sarah Connor',
        lastMessage: 'Thanks for the help!',
        time: '11:30 AM',
        unread: 0,
        avatar: 'S',
        isOnline: true
      }
    ],
    mentions: [],
    pinned: [
      {
        id: 4,
        name: 'Important Client',
        lastMessage: 'Will get back to you soon',
        time: 'Yesterday',
        unread: 2,
        avatar: 'I',
        isOnline: false
      }
    ],
    open: [
      {
        id: 5,
        name: 'New Lead',
        lastMessage: 'Interested in your services',
        time: '12:45 PM',
        unread: 1,
        avatar: 'N',
        isOnline: true
      }
    ],
    resolved: []
  };

  const currentChats = chatsByCategory[activeTab] || [];

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 mb-4">
          <button className="flex-grow text-left font-medium">New</button>
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <AiOutlinePlus className="w-5 h-5 text-gray-600" />
          </button>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search user or bot"
            className="w-full pl-9 pr-4 py-2 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b">
        <div className="flex items-center px-1 py-2 gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`group relative p-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? 'bg-primary-light text-primary-main' 
                  : 'hover:bg-gray-100 text-gray-600'
              }`}
              title={tab.label}
            >
              <tab.icon className="w-5 h-5" />
              {tab.count > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary-main text-white text-xs rounded-full flex items-center justify-center">
                  {tab.count}
                </span>
              )}
              <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-gray-800 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {tab.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-grow overflow-y-auto">
        {currentChats.length > 0 ? (
          currentChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat)}
              className={`p-3 flex items-start gap-3 cursor-pointer hover:bg-gray-50 ${
                selectedChat?.id === chat.id ? 'bg-primary-light' : ''
              }`}
            >
              {/* Avatar */}
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <span className="text-blue-600 font-medium">{chat.avatar}</span>
                </div>
                {chat.isOnline && (
                  <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                )}
              </div>

              {/* Chat Info */}
              <div className="flex-grow min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-medium truncate">{chat.name}</span>
                  <span className="text-xs text-gray-500 flex-shrink-0">{chat.time}</span>
                </div>
                <p className="text-sm text-gray-500 truncate">{chat.lastMessage}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500">
            No conversations in this category
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatList;
