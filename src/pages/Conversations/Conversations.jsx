import React, { useState, useEffect } from 'react';
import ChatList from '../../components/Chat/ChatList';
import ChatBox from '../../components/Chat/ChatBox';
import ChatInfo from '../../components/Chat/ChatInfo';
import conversationService from '../../services/conversationService';

const Conversations = () => {
  const [selectedChat, setSelectedChat] = useState(null);
  const [activeTab, setActiveTab] = useState('unassigned');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const syncChats = async () => {
      try {
        setIsLoading(true);
        await conversationService.syncWhatsAppChats();
      } catch (error) {
        console.error('Error syncing chats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial sync
    syncChats();

    // Set up periodic sync every 30 seconds
    const syncInterval = setInterval(syncChats, 30000);

    return () => clearInterval(syncInterval);
  }, []);

  return (
    <div className="h-screen flex bg-gray-50">
      {/* Chat List */}
      <div className="w-[320px] border-r bg-white flex-shrink-0 h-full">
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
          <div className="w-[320px] border-l bg-white flex-shrink-0 h-full">
            <ChatInfo chat={selectedChat} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Conversations;
