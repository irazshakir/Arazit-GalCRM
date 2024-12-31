import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  AiOutlineHome,
  AiOutlineMessage,
  AiOutlineContacts,
  AiOutlineRobot,
  AiOutlineShoppingCart,
  AiOutlineApi,
  AiOutlineBarChart,
  AiOutlineSetting,
  AiOutlineMenu,
  AiOutlineRight,
  AiOutlineDown,
  AiOutlineEllipsis
} from 'react-icons/ai';
import logo from '../../assets/images/crm-logo.svg';
import { theme } from '../../theme/theme';
import './Sidebar.css';

const menuItems = [
  { icon: AiOutlineHome, label: 'Home', path: '/' },
  { icon: AiOutlineMessage, label: 'Conversations', path: '/conversations' },
  { icon: AiOutlineContacts, label: 'Contacts', path: '/contacts' },
  { icon: AiOutlineRobot, label: 'Bots', path: '/bots' },
  { icon: AiOutlineShoppingCart, label: 'Commerce', path: '/commerce', hasSubmenu: true },
  { icon: AiOutlineApi, label: 'Integration', path: '/integration' },
  { icon: AiOutlineBarChart, label: 'Analytics', path: '/analytics', hasSubmenu: true },
  { icon: AiOutlineSetting, label: 'Settings', path: '/settings', hasSubmenu: true }
];

const MenuItem = ({ icon: Icon, label, path, hasSubmenu, isCollapsed, submenuItems }) => {
  const location = useLocation();
  const isActive = location.pathname === path;
  
  return (
    <div>
      <Link 
        to={path} 
        className={`flex items-center px-3 py-2.5 mb-2 text-sm text-gray-600 rounded-lg transition-colors group
          ${isActive ? 'bg-primary-light text-primary-main' : 'hover:bg-primary-light'}`}
        style={{
          '--tw-bg-opacity': '0.1',
          color: isActive ? theme.colors.primary.main : 'inherit',
          backgroundColor: isActive ? theme.colors.primary.light : 'transparent',
          fontFamily: 'Inter, sans-serif'
        }}
      >
        <Icon className="w-4 h-4 mr-3 flex-shrink-0" />
        {!isCollapsed && (
          <>
            <span className="flex-grow whitespace-nowrap">{label}</span>
            {hasSubmenu && <AiOutlineDown className="w-2.5 h-2.5 ml-2" />}
          </>
        )}
        {isCollapsed && hasSubmenu && (
          <AiOutlineRight className="w-2.5 h-2.5 ml-2 opacity-0 group-hover:opacity-100" />
        )}
      </Link>
      {hasSubmenu && submenuItems && !isCollapsed && (
        <div className="pl-8">
          {submenuItems.map((submenuItem, index) => (
            <Link 
              key={index} 
              to={submenuItem.path} 
              className={`flex items-center px-3 py-2.5 mb-2 text-sm text-gray-600 rounded-lg transition-colors group
                ${isActive && location.pathname === submenuItem.path ? 'bg-primary-light text-primary-main' : 'hover:bg-primary-light'}`}
              style={{
                '--tw-bg-opacity': '0.1',
                color: isActive && location.pathname === submenuItem.path ? theme.colors.primary.main : 'inherit',
                backgroundColor: isActive && location.pathname === submenuItem.path ? theme.colors.primary.light : 'transparent',
                fontFamily: 'Inter, sans-serif'
              }}
            >
              <span className="flex-grow whitespace-nowrap">{submenuItem.label}</span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const UserProfile = ({ isCollapsed }) => {
  const [showOptions, setShowOptions] = useState(false);
  
  return (
    <div className="relative">
      <div className="flex items-center p-3 hover:bg-gray-50 cursor-pointer">
        <div className="w-8 h-8 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
          <span className="text-blue-600 text-sm font-medium">I</span>
        </div>
        {!isCollapsed && (
          <>
            <div className="ml-3 flex-grow min-w-0">
              <p className="text-sm font-medium text-gray-700 truncate">INDEGO TRAVEL AND TOURISM</p>
              <p className="text-xs text-gray-500 truncate">inzamamulhaqoficial@gmail.com</p>
            </div>
            <button 
              onClick={(e) => {
                e.preventDefault();
                setShowOptions(!showOptions);
              }}
              className="ml-1 p-1 hover:bg-gray-100 rounded-full"
            >
              <AiOutlineEllipsis className="w-4 h-4 text-gray-500" />
            </button>
          </>
        )}
      </div>
      
      {showOptions && !isCollapsed && (
        <div className="absolute bottom-full left-0 min-w-[300px] w-full mb-2 bg-white rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center">
                <span className="text-blue-600 text-sm font-medium">IT</span>
              </div>
              <div className="ml-3 flex-grow">
                <p className="text-sm font-medium text-gray-700">INDEGO TRAVEL AND TOURISM</p>
                <a href="https://www.indegotourism.com/" className="text-xs text-gray-500 hover:underline break-all">https://www.indegotourism.com/</a>
              </div>
            </div>
          </div>
          <div className="py-2">
            <div className="px-4 py-2.5 hover:bg-gray-50">
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-grow">Account Details</span>
              </div>
            </div>
            <Link to="/users" className="block">
              <div className="px-4 py-2.5 hover:bg-gray-50">
                <div className="flex items-center text-sm text-gray-700">
                  <span className="flex-grow">Users & roles</span>
                </div>
              </div>
            </Link>
            <div className="px-4 py-2.5 hover:bg-gray-50">
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-grow">Push Notification</span>
                <div className="relative inline-block w-10 mr-2 align-middle select-none">
                  <input type="checkbox" className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"/>
                  <label className="toggle-label block overflow-hidden h-6 rounded-full bg-gray-300 cursor-pointer"></label>
                </div>
              </div>
              <div className="mt-1.5 flex items-center text-xs text-blue-500">
                <span className="cursor-pointer hover:underline">Failed please retry?</span>
                <span className="mx-2 text-gray-400">|</span>
                <span className="cursor-pointer hover:underline">Need Help?</span>
              </div>
            </div>
            <div className="px-4 py-2.5 hover:bg-gray-50">
              <div className="flex items-center text-sm text-gray-700">
                <span className="flex-grow">Profile</span>
              </div>
            </div>
            <div className="px-4 py-2.5 hover:bg-gray-50">
              <div className="flex items-center text-sm text-red-500">
                <span className="flex-grow">Logout</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`h-screen bg-white shadow-lg flex flex-col transition-all duration-300 ${isCollapsed ? 'w-14' : 'w-56'}`}>
      <div className="flex items-center justify-between p-4 border-b">
        <div className="flex items-center">
          <img src={logo} alt="ArazitCRM Logo" className="h-8 w-8" />
          {!isCollapsed && (
            <span className="ml-2 text-xl font-semibold text-gray-800">ArazitCRM</span>
          )}
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1.5 rounded-lg hover:bg-gray-100"
        >
          <AiOutlineMenu className="w-5 h-5 text-gray-500" />
        </button>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-3 space-y-0.5">
        {menuItems.map((item, index) => (
          <MenuItem key={index} {...item} isCollapsed={isCollapsed} />
        ))}
      </nav>

      <div className="border-t">
        <div className={`p-3 ${isCollapsed ? 'px-2' : ''}`}>
          <div className="flex items-center px-3 py-1.5 text-gray-600 bg-gray-50 rounded-lg">
            {!isCollapsed && <span className="text-xs">Quick Search</span>}
            {!isCollapsed && <span className="ml-auto text-xs text-gray-400">Ctrl + K</span>}
          </div>
        </div>
        <UserProfile isCollapsed={isCollapsed} />
      </div>
    </div>
  );
};

export default Sidebar;
