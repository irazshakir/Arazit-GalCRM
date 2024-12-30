import React, { useState } from 'react';
import {
  AiOutlineSmile,
  AiOutlinePaperClip,
  AiOutlineSend,
  AiOutlineBold,
  AiOutlineItalic,
  AiOutlineStrikethrough,
  AiOutlineOrderedList,
  AiOutlineUnorderedList,
  AiOutlineLink,
  AiOutlineMore
} from 'react-icons/ai';

const ChatBox = ({ chat }) => {
  const [message, setMessage] = useState('');
  const [showFormatting, setShowFormatting] = useState(false);

  const formatButtons = [
    { icon: AiOutlineBold, tooltip: 'Bold' },
    { icon: AiOutlineItalic, tooltip: 'Italic' },
    { icon: AiOutlineStrikethrough, tooltip: 'Strikethrough' },
    { icon: AiOutlineOrderedList, tooltip: 'Numbered list' },
    { icon: AiOutlineUnorderedList, tooltip: 'Bullet list' },
    { icon: AiOutlineLink, tooltip: 'Link' }
  ];

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Chat Header */}
      <div className="px-4 py-3 bg-white border-b flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium">{chat.avatar}</span>
          </div>
          <div>
            <h2 className="font-medium">{chat.name}</h2>
            <span className="text-xs text-gray-500">Online</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded-lg">
            <AiOutlineMore className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-grow overflow-y-auto p-4">
        {/* Messages will be rendered here */}
        <div className="bg-white rounded-lg p-3 max-w-[80%] mb-4 shadow-sm">
          <div className="text-sm">{chat.lastMessage}</div>
          <div className="text-xs text-gray-500 mt-1">{chat.time}</div>
        </div>
      </div>

      {/* Message Input */}
      <div className="p-4 bg-white border-t">
        {showFormatting && (
          <div className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-lg">
            {formatButtons.map((button, index) => (
              <button
                key={index}
                className="p-1.5 hover:bg-gray-200 rounded"
                title={button.tooltip}
              >
                <button.icon className="w-4 h-4 text-gray-600" />
              </button>
            ))}
          </div>
        )}
        
        <div className="flex items-end gap-2">
          <button
            onClick={() => setShowFormatting(!showFormatting)}
            className="p-2 hover:bg-gray-100 rounded-lg"
          >
            <AiOutlineBold className="w-5 h-5 text-gray-600" />
          </button>
          
          <div className="flex-grow">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message aerospaceship!"
              className="w-full px-4 py-2 bg-gray-100 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary-light"
              rows="1"
              style={{ minHeight: '40px', maxHeight: '120px' }}
            />
          </div>

          <div className="flex items-center gap-1">
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <AiOutlineSmile className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-lg">
              <AiOutlinePaperClip className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 bg-primary-main text-white rounded-lg hover:bg-primary-dark">
              <AiOutlineSend className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
