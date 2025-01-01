import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const ChatInfo = ({ chat }) => {
  if (!chat?.customer) return null;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Contact Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary-light flex items-center justify-center">
            <span className="text-primary-main font-medium text-lg">
              {chat.customer.name?.charAt(0) || '?'}
            </span>
          </div>
          <div className="flex-grow">
            <h2 className="font-medium">{chat.customer.name}</h2>
            <span className="text-sm text-gray-500">{chat.customer.email}</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Status</h3>
            <p className="text-sm text-gray-600 capitalize">{chat.status}</p>
          </div>

          {chat.assigned_to && (
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-2">Assigned To</h3>
              <p className="text-sm text-gray-600">{chat.assigned_to.name}</p>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Contact Owner</h3>
            <button className="text-sm text-primary-main hover:underline">
              <AiOutlinePlus className="inline-block mr-1" />
              Add
            </button>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Contact Tags</h3>
            <button className="text-sm text-primary-main hover:underline">
              <AiOutlinePlus className="inline-block mr-1" />
              Add
            </button>
          </div>

          {/* Source Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Source</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Created At</p>
                <p className="text-sm">
                  {new Date(chat.created_at).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm">
                  {new Date(chat.updated_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Additional Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Messages</p>
                <p className="text-sm">{chat.messages?.length || 0}</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Priority</p>
                <p className="text-sm capitalize">{chat.priority || 'Normal'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
