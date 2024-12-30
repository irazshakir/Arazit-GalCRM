import React, { useState } from 'react';
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

const UserDropdown = ({ selectedUser, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const users = [
    { id: 1, name: 'Inzmam', avatar: 'I', color: 'bg-red-100' },
    { id: 2, name: 'Aqeel Niazi', avatar: 'AN', color: 'bg-blue-100' },
    { id: 3, name: 'Ayesha', avatar: 'A', color: 'bg-pink-100' },
    { id: 4, name: 'Muhammad Qasim', avatar: 'MQ', color: 'bg-green-100' },
    { id: 5, name: 'Faraz', avatar: 'F', color: 'bg-orange-100' },
    { id: 6, name: 'SAIM', avatar: 'S', color: 'bg-purple-100' }
  ];

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
              {filteredUsers.map(user => (
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
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ChatBox = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [note, setNote] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);
  const [activeTab, setActiveTab] = useState('reply'); // 'reply' or 'notes'
  const [selectedUser, setSelectedUser] = useState({ 
    id: 6, 
    name: 'SAIM', 
    avatar: 'S', 
    color: 'bg-purple-100' 
  });

  const handleSend = () => {
    if (activeTab === 'reply' && message.trim()) {
      // Handle send message
      setMessage('');
    } else if (activeTab === 'notes' && note.trim()) {
      // Handle save note
      setNote('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Chat Header */}
      <div className="px-4 py-2 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium">
              {chat?.avatar || 'M'}
            </span>
          </div>
          <span className="text-sm font-medium">{chat?.name || 'Mylifemyr...'}</span>
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <AiOutlineClockCircle className="w-3 h-3" />
            7th
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-gray-700 hover:bg-gray-100 px-3 py-1 rounded-lg text-sm font-medium flex items-center gap-1">
            <AiOutlineCheck className="w-4 h-4" />
            Resolve
          </button>
          <UserDropdown selectedUser={selectedUser} onSelect={setSelectedUser} />
          <button className="p-1.5 hover:bg-gray-100 rounded-lg">
            <AiOutlineMore className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* Messages will be rendered here */}
      </div>

      {/* Message input area */}
      <div className="border-t">
        {/* Assignment banner */}
        <div className="px-4 py-1.5 bg-orange-50 text-orange-700 border-b flex items-center gap-2 text-sm">
          <span>This conversation is assigned to</span>
          <div className="flex items-center gap-1">
            <span className="w-4 h-4 rounded-full bg-orange-100 flex items-center justify-center text-xs">
              {selectedUser.avatar}
            </span>
            <span className="font-medium">{selectedUser.name}</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b px-4">
          <button 
            onClick={() => setActiveTab('reply')}
            className={`px-4 py-2 text-xs font-medium border-b-2 ${
              activeTab === 'reply' 
                ? 'border-primary-main text-primary-main' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Reply
          </button>
          <button 
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-medium border-b-2 ${
              activeTab === 'notes' 
                ? 'border-yellow-400 text-yellow-400' 
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            Notes
          </button>
        </div>

        {/* Input area */}
        <div className="p-3">
          {activeTab === 'reply' ? (
            <div className="border rounded-lg">
              {/* Message input */}
              <div className="p-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Message Mylifemyruls"
                  className="w-full resize-none outline-none text-sm min-h-[60px]"
                  rows="3"
                />
              </div>

              {/* Formatting options */}
              {showFormatting && (
                <div className="border-t px-2 py-1 flex items-center gap-2">
                  <button className="p-1 hover:bg-gray-100 rounded" title="Bold">
                    <AiOutlineBold className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Italic">
                    <AiOutlineItalic className="w-3.5 h-3.5" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Strikethrough">
                    <AiOutlineStrikethrough className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Action buttons */}
              <div className="border-t px-2 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-gray-100 rounded" title="Add attachment">
                    <AiOutlinePlus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Emoji">
                    <AiOutlineSmile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button 
                    className={`p-1 hover:bg-gray-100 rounded ${showFormatting ? 'bg-gray-100' : ''}`}
                    onClick={() => setShowFormatting(!showFormatting)}
                    title="Formatting"
                  >
                    <AiOutlineFileText className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Canned messages">
                    <BsHash className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Message templates">
                    <BsLightning className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-gray-100 rounded" title="Translate">
                    <AiOutlineTranslation className="w-4 h-4 text-gray-600" />
                  </button>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!message.trim()}
                  className={`px-3 py-1 rounded flex items-center gap-1.5 text-xs ${
                    message.trim() 
                      ? 'bg-[#ac2478] text-white hover:bg-[#961f68]' 
                      : 'bg-[#ac2478]/60 text-white cursor-not-allowed'
                  }`}
                >
                  <span>Send</span>
                  <AiOutlineSend className="w-3 h-3" />
                </button>
              </div>
            </div>
          ) : (
            <div className="border rounded-lg bg-yellow-50">
              <div className="p-2">
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Type your private notes..."
                  className="w-full resize-none outline-none text-sm min-h-[60px] bg-transparent"
                  rows="3"
                />
              </div>
              <div className="border-t px-2 py-1 flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button className="p-1 hover:bg-yellow-100 rounded" title="Add attachment">
                    <AiOutlinePlus className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-yellow-100 rounded" title="Emoji">
                    <AiOutlineSmile className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-yellow-100 rounded" title="Formatting">
                    <AiOutlineFileText className="w-4 h-4 text-gray-600" />
                  </button>
                  <button className="p-1 hover:bg-yellow-100 rounded" title="At mention">
                    <span className="text-gray-600 text-sm font-medium">@</span>
                  </button>
                </div>

                <button
                  onClick={handleSend}
                  disabled={!note.trim()}
                  className={`px-4 py-1.5 rounded text-xs font-medium ${
                    note.trim() 
                      ? 'bg-yellow-400 text-black hover:bg-yellow-500' 
                      : 'bg-yellow-200 text-black/50 cursor-not-allowed'
                  }`}
                >
                  Send
                </button>
              </div>
            </div>
          )}

          <div className="mt-1 text-[10px] text-gray-500 text-right">
            Shift + Enter to add a new line
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
