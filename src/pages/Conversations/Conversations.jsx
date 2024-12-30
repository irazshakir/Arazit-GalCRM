import React, { useState } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatBox from '../../components/Chat/ChatBox';
import ChatInfo from '../../components/Chat/ChatInfo';

const Conversations = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState('unassigned');

  return (
    <div className="h-full flex bg-gray-50">
      {/* Chat List */}
      <div className="w-[320px] border-r bg-white flex-shrink-0 h-full flex flex-col">
        <ChatList 
          selectedChat={selectedChat}
          onChatSelect={setSelectedChat}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </div>

      {/* Chat Area */}
      <div className="flex-grow flex h-full">
        <div className="flex-grow flex flex-col">
          {selectedChat ? (
            <ChatBox chat={selectedChat} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>

        {/* Contact Info Panel */}
        {selectedChat && (
          <div className="w-[320px] border-l bg-white flex-shrink-0 h-full overflow-hidden">
            <div className="h-full overflow-y-auto">
              <ChatInfo chat={selectedChat} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
