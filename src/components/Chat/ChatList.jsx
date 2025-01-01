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
  AiOutlineCheck
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
  const [isNewChatModalOpen, setIsNewChatModalOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterButtonRef = useRef(null);

  // Dummy conversations data
  const dummyConversations = {
    unassigned: [
      {
        id: 1,
        customer: {
          name: 'John Smith',
          email: 'john@example.com'
        },
        messages: [{
          content: 'Hi, I need help with my order #1234',
          created_at: '2025-01-01T08:30:00'
        }],
        status: 'unassigned',
        updated_at: '2025-01-01T08:30:00'
      },
      {
        id: 2,
        customer: {
          name: 'Sarah Wilson',
          email: 'sarah@example.com'
        },
        messages: [{
          content: 'When will my package arrive?',
          created_at: '2025-01-01T07:45:00'
        }],
        status: 'unassigned',
        updated_at: '2025-01-01T07:45:00'
      }
    ],
    assigned: [
      {
        id: 3,
        customer: {
          name: 'Mike Johnson',
          email: 'mike@example.com'
        },
        messages: [{
          content: 'Thanks for your help!',
          created_at: '2025-01-01T06:15:00'
        }],
        status: 'assigned',
        assigned_to: {
          name: 'Support Agent',
          email: 'agent@company.com'
        },
        updated_at: '2025-01-01T06:15:00'
      }
    ],
    open: [
      {
        id: 4,
        customer: {
          name: 'Emma Davis',
          email: 'emma@example.com'
        },
        messages: [{
          content: 'I would like to request a refund',
          created_at: '2025-01-01T05:20:00'
        }],
        status: 'open',
        updated_at: '2025-01-01T05:20:00'
      }
    ],
    resolved: [
      {
        id: 5,
        customer: {
          name: 'Alex Brown',
          email: 'alex@example.com'
        },
        messages: [{
          content: 'Issue has been resolved',
          created_at: '2025-01-01T04:10:00'
        }],
        status: 'resolved',
        updated_at: '2025-01-01T04:10:00'
      }
    ]
  };

  const tabs = [
    { id: 'unassigned', icon: AiOutlineTeam, label: 'Unassigned', count: dummyConversations.unassigned.length },
    { id: 'assigned', icon: AiOutlineUser, label: 'Assigned to me', count: dummyConversations.assigned.length },
    { id: 'mentions', icon: AiOutlineTag, label: 'Mentioned', count: 0 },
    { id: 'pinned', icon: AiOutlineStar, label: 'Pinned', count: 0 },
    { id: 'open', icon: AiOutlineMessage, label: 'Open', count: dummyConversations.open.length },
    { id: 'resolved', icon: AiOutlineCheck, label: 'Resolved', count: dummyConversations.resolved.length }
  ];

  const currentConversations = dummyConversations[activeTab] || [];

  return (
    <>
      <div className="p-4 border-b">
        <div className="relative">
          <input
            type="text"
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-light"
          />
          <AiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
          <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <button 
              onClick={() => setIsNewChatModalOpen(true)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <AiOutlinePlus className="w-4 h-4" />
            </button>
            <button 
              ref={filterButtonRef}
              onClick={() => setIsFilterOpen(!isFilterOpen)}
              className="p-1.5 hover:bg-gray-100 rounded-lg"
            >
              <AiOutlineFilter className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      <div className="border-b">
        <div className="grid grid-cols-6 p-1">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className="group relative p-2 rounded-lg transition-colors hover:bg-gray-100"
              title={tab.label}
            >
              <tab.icon className={`w-5 h-5 mx-auto ${
                activeTab === tab.id ? 'text-primary-main' : 'text-gray-500'
              }`} />
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

      <div className="flex-1 overflow-y-auto">
        {currentConversations.length === 0 ? (
          <div className="p-4 text-gray-500 text-center">No conversations found</div>
        ) : (
          <div className="divide-y">
            {currentConversations.map(chat => (
              <div
                key={chat.id}
                onClick={() => onChatSelect(chat)}
                className={`p-4 hover:bg-gray-50 cursor-pointer ${
                  selectedChat?.id === chat.id ? 'bg-gray-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary-light flex items-center justify-center flex-shrink-0">
                    <span className="text-primary-main font-medium">
                      {chat.customer?.name?.charAt(0) || '?'}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-medium truncate">
                        {chat.customer?.name || 'Unknown'}
                      </span>
                      <span className="text-xs text-gray-500 whitespace-nowrap">
                        {new Date(chat.updated_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {chat.messages?.[0]?.content || 'No messages'}
                    </div>
                    {chat.assigned_to && (
                      <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                        <AiOutlineUser className="w-3 h-3" />
                        <span>Assigned to {chat.assigned_to.name}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <NewChatModal 
        isOpen={isNewChatModalOpen} 
        onClose={() => setIsNewChatModalOpen(false)} 
      />
      
      <FilterDropdown
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        anchorEl={filterButtonRef.current}
      />
    </>
  );
};

export default ChatList;
