
import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  DollarSign, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useAuth } from './auth/AuthProvider';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ collapsed, onToggle }: SidebarProps) => {
  const { logout, user } = useAuth();
  
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Products', path: '/products', icon: Package },
    { name: 'Orders', path: '/orders', icon: ShoppingCart },
    { name: 'Payments', path: '/payments', icon: DollarSign },
    { name: 'Profile', path: '/profile', icon: User },
  ];

  const handleLogout = () => {
    logout();
  };

  return (
    <div className={`bg-white shadow-lg transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'} min-h-screen flex flex-col`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {!collapsed && (
          <h1 className="text-xl font-bold text-gray-800">Lovablr Admin</h1>
        )}
        <button
          onClick={onToggle}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      {/* User Info */}
      {!collapsed && user && (
        <div className="p-4 border-b bg-gray-50">
          <p className="text-sm text-gray-600">Logged in as:</p>
          <p className="text-sm font-medium text-gray-800 truncate">{user.email}</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-blue-100 text-blue-700 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  } ${collapsed ? 'justify-center' : ''}`
                }
              >
                <item.icon size={20} />
                {!collapsed && <span className="ml-3">{item.name}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logout */}
      <div className="p-4 border-t">
        <button 
          onClick={handleLogout}
          className={`flex items-center w-full px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors ${collapsed ? 'justify-center' : ''}`}
        >
          <LogOut size={20} />
          {!collapsed && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
