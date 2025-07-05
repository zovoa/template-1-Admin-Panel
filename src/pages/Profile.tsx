
import React from 'react';
import { User, Settings, Shield, Bell } from 'lucide-react';

const Profile = () => {
  const adminInfo = {
    name: 'Admin User',
    email: 'admin@lovablr.com',
    role: 'Super Administrator',
    joinDate: 'January 2024',
    lastLogin: '2024-01-15 09:30 AM',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face'
  };

  const recentActivity = [
    { action: 'Updated product inventory', time: '2 hours ago' },
    { action: 'Processed 12 orders', time: '4 hours ago' },
    { action: 'Added new product category', time: '1 day ago' },
    { action: 'Generated sales report', time: '2 days ago' },
  ];

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Profile</h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Information */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <div className="flex items-center space-x-6 mb-6">
              <div className="relative">
                <img
                  src={adminInfo.avatar}
                  alt={adminInfo.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white"></div>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{adminInfo.name}</h2>
                <p className="text-gray-600">{adminInfo.email}</p>
                <p className="text-sm text-blue-600 font-medium">{adminInfo.role}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  value={adminInfo.name}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={adminInfo.email}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
                <input
                  type="text"
                  value={adminInfo.role}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Member Since</label>
                <input
                  type="text"
                  value={adminInfo.joinDate}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                Update Profile
              </button>
            </div>
          </div>

          {/* Security Settings */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Security Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Shield className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                    <p className="text-sm text-gray-600">Add an extra layer of security</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full">
                  Enabled
                </button>
              </div>
              <div className="flex items-center justify-between py-3 border-b">
                <div className="flex items-center space-x-3">
                  <Settings className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Password</p>
                    <p className="text-sm text-gray-600">Last changed 30 days ago</p>
                  </div>
                </div>
                <button className="px-3 py-1 text-sm border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Change
                </button>
              </div>
              <div className="flex items-center justify-between py-3">
                <div className="flex items-center space-x-3">
                  <Bell className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium text-gray-900">Login Notifications</p>
                    <p className="text-sm text-gray-600">Get notified of new logins</p>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Account Info & Activity */}
        <div className="space-y-6">
          {/* Account Status */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Status</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-green-600 font-medium">Active</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Last Login</span>
                <span className="text-gray-900">{adminInfo.lastLogin}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Session</span>
                <span className="text-gray-900">Online</span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="text-sm text-gray-900">{activity.action}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Download Data Export
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                View Audit Logs
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors">
                Backup Settings
              </button>
              <button className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                Sign Out All Devices
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
