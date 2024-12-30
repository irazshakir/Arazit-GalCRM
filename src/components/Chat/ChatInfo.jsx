import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';

const ChatInfo = ({ chat }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Contact Header - Fixed */}
      <div className="flex-shrink-0 p-4 border-b bg-white">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-medium text-lg">{chat.avatar}</span>
          </div>
          <div className="flex-grow">
            <h2 className="font-medium">{chat.name}</h2>
            <span className="text-sm text-gray-500">Online</span>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-6">
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Marketing Opt-in</h3>
            <p className="text-sm text-gray-600">Yes</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Phone Number</h3>
            <p className="text-sm text-gray-600">+971 56 657 8407</p>
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Email</h3>
            <p className="text-sm text-gray-600">contact@example.com</p>
          </div>

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

          {/* Company Details Section */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium">Company Details</h3>
              <button className="text-xs text-primary-main hover:underline">Link company</button>
            </div>
          </div>

          {/* Source Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Source</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Contact Created Source</p>
                <p className="text-sm">CTWA</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Source ID</p>
                <p className="text-sm">120214339011120186</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Source URL</p>
                <a href="#" className="text-sm text-primary-main hover:underline">
                  https://fb.me/2QFku2YNt
                </a>
              </div>
            </div>
          </div>

          {/* Additional Details Section */}
          <div className="mb-6">
            <h3 className="text-sm font-medium mb-4">Additional Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Lead Stage</p>
                <p className="text-sm">-</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Appointment Date</p>
                <p className="text-sm">-</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Preferred Language</p>
                <p className="text-sm">-</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;
