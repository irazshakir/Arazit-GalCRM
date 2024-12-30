import React, { useState, useRef } from 'react';
import { 
  AiOutlineSearch, 
  AiOutlinePlus, 
  AiOutlineFilter,
  AiOutlineUser,
  AiOutlineTeam,
  AiOutlineTag,
  AiOutlineStar,
  AiOutlineMessage,
  AiOutlineCheck,
  AiOutlineClose,
  AiOutlineWhatsApp
} from 'react-icons/ai';

const NewChatModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;
  
  const contacts = [
    { id: 1, name: 'Vikas', phone: '+971 56 238 1322', avatar: 'V', color: 'bg-blue-100' },
    { id: 2, name: "Ai's Parfum", phone: '+63 966 665 2104', avatar: 'AP', color: 'bg-yellow-100' },
    { id: 3, name: 'Neelofer Munir', phone: '+971 55 203 8497', avatar: 'NM', color: 'bg-green-100' },
    { id: 4, name: 'Mona', phone: '+971 50 677 2393', avatar: 'M', color: 'bg-purple-100' },
    { id: 5, name: 'Shakiv Husain', phone: '+971 54 362 3035', avatar: 'SH', color: 'bg-pink-100' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-[480px] max-h-[600px] flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-medium">Initiate new conversation on</h2>
            <div className="flex items-center gap-1 px-2 py-1 bg-gray-100 rounded">
              <AiOutlineWhatsApp className="text-green-600 w-5 h-5" />
              <span className="text-sm whitespace-nowrap">Indego Travel ai</span>
            </div>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full">
            <AiOutlineClose className="w-5 h-5" />
          </button>
        </div>
        
        <div className="p-4">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
            />
            <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          </div>

          <div className="mb-4">
            <button className="flex items-center gap-2 text-primary-main hover:underline">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                <AiOutlinePlus className="w-5 h-5" />
              </div>
              <span>Create contact</span>
            </button>
          </div>

          <div className="overflow-y-auto max-h-[400px]">
            {contacts.map(contact => (
              <div key={contact.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer">
                <div className={`w-8 h-8 rounded-full ${contact.color} flex items-center justify-center flex-shrink-0`}>
                  <span className="text-sm font-medium">{contact.avatar}</span>
                </div>
                <div className="min-w-0">
                  <div className="font-medium truncate">{contact.name}</div>
                  <div className="text-sm text-gray-500 truncate">{contact.phone}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const FilterDropdown = ({ isOpen, onClose, anchorEl }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute right-0 top-full mt-2 bg-white rounded-lg shadow-lg border w-64 z-10">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">Filter</h3>
          <button onClick={onClose} className="text-primary-main text-sm">Reset</button>
        </div>

        <div className="space-y-4">
          <label className="flex items-center gap-2">
            <input type="radio" name="chatStatus" className="text-primary-main" defaultChecked />
            <span>Open chats</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="radio" name="chatStatus" className="text-primary-main" />
            <span>Resolved chats</span>
          </label>
          <label className="flex items-center gap-2">
            <input type="checkbox" className="text-primary-main" />
            <span>Unread chats</span>
          </label>

          <div>
            <h4 className="font-medium mb-2">Tags</h4>
            <input
              type="text"
              placeholder="Search tags"
              className="w-full p-2 border rounded mb-2 text-sm"
            />
            <div className="space-y-2">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-main" />
                <span>No tags</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-main" />
                <span>whatsapp</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-main" />
                <span>SAMI RAJA</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-main" />
                <span>TEST</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="text-primary-main" />
                <span>visa</span>
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-4 pt-4 border-t">
          <button onClick={onClose} className="px-4 py-2 text-sm hover:bg-gray-100 rounded">
            Cancel
          </button>
          <button className="px-4 py-2 text-sm bg-primary-main text-white rounded hover:bg-primary-dark">
            Apply
          </button>
        </div>
      </div>
    </div>
  );
};

const ChatList = ({ selectedChat, onChatSelect, activeTab, onTabChange }) => {
  const [isNewChatOpen, setIsNewChatOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef(null);

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
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsNewChatOpen(true)}
              className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 px-3 py-1.5 rounded-lg"
            >
              <span>New</span>
              <AiOutlinePlus className="w-4 h-4" />
            </button>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className={`p-1.5 rounded-lg ${isFilterOpen ? 'bg-primary-light text-primary-main' : 'hover:bg-gray-100'}`}
            >
              <AiOutlineFilter className="w-5 h-5" />
            </button>
            <FilterDropdown 
              isOpen={isFilterOpen} 
              onClose={() => setIsFilterOpen(false)}
              anchorEl={filterButtonRef.current}
            />
          </div>
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
        <div className="grid grid-cols-6 px-1 py-2">
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
              <tab.icon className="w-5 h-5 mx-auto" />
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

      {/* Modals */}
      <NewChatModal isOpen={isNewChatOpen} onClose={() => setIsNewChatOpen(false)} />
    </div>
  );
};

export default ChatList;
