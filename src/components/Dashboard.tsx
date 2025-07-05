import React, { useEffect } from 'react';
import StatsCard from './StatsCard';
import { useAuth } from './auth/AuthProvider';
import { Package, ShoppingCart, DollarSign } from 'lucide-react';

const Dashboard = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('📦 Dashboard Loaded!');
    if (user) {
      console.log('👤 Logged-in Admin Full Object:', user);
      console.log('✅ Email:', user.email);
      console.log('🆔 userId:', user.userId);
      console.log('🌐 Website URL:', user.websiteUrl);
      console.log('🔐 Admin Panel:', user.adminUrl);
      console.log('📢 Message:', user.message);
      console.log('🎯 Success:', user.success);
    } else {
      console.warn('⚠️ No user data found in context!');
    }
  }, [user]);

  const productStats = [
    { title: 'Total Products', value: '1,247', change: '+12%', changeType: 'positive' as const, icon: Package, iconColor: 'text-blue-600' },
    { title: 'Categories', value: '24', change: '+2', changeType: 'positive' as const, icon: Package, iconColor: 'text-purple-600' },
    { title: 'Low Stock Items', value: '18', change: '-5', changeType: 'positive' as const, icon: Package, iconColor: 'text-orange-600' },
    { title: 'Out of Stock', value: '3', change: '+1', changeType: 'negative' as const, icon: Package, iconColor: 'text-red-600' },
  ];

  const orderStats = [
    { title: "Today's Orders", value: '47', change: '+18%', changeType: 'positive' as const, icon: ShoppingCart, iconColor: 'text-green-600' },
    { title: 'Weekly Sales', value: '284', change: '+24%', changeType: 'positive' as const, icon: ShoppingCart, iconColor: 'text-blue-600' },
    { title: 'Pending Orders', value: '12', change: '-3', changeType: 'positive' as const, icon: ShoppingCart, iconColor: 'text-yellow-600' },
    { title: 'Cancelled Orders', value: '5', change: '+2', changeType: 'negative' as const, icon: ShoppingCart, iconColor: 'text-red-600' },
  ];

  const paymentStats = [
    { title: 'Total Revenue', value: '$24,847', change: '+15%', changeType: 'positive' as const, icon: DollarSign, iconColor: 'text-green-600' },
    { title: 'Success Rate', value: '98.5%', change: '+0.3%', changeType: 'positive' as const, icon: DollarSign, iconColor: 'text-blue-600' },
    { title: 'Pending Payments', value: '$1,234', change: '-$200', changeType: 'positive' as const, icon: DollarSign, iconColor: 'text-yellow-600' },
    { title: 'Refunds Issued', value: '$567', change: '+$123', changeType: 'negative' as const, icon: DollarSign, iconColor: 'text-red-600' },
  ];

  const recentOrders = [
    { id: '#1001', customer: 'John Smith', amount: '$149.99', status: 'Delivered', date: '2024-01-15' },
    { id: '#1002', customer: 'Sarah Johnson', amount: '$89.50', status: 'Shipped', date: '2024-01-15' },
    { id: '#1003', customer: 'Mike Davis', amount: '$199.99', status: 'Processing', date: '2024-01-14' },
    { id: '#1004', customer: 'Emily Brown', amount: '$75.25', status: 'Pending', date: '2024-01-14' },
    { id: '#1005', customer: 'Chris Wilson', amount: '$129.99', status: 'Cancelled', date: '2024-01-13' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-100 text-green-800';
      case 'Shipped': return 'bg-blue-100 text-blue-800';
      case 'Processing': return 'bg-yellow-100 text-yellow-800';
      case 'Pending': return 'bg-orange-100 text-orange-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, <span className="font-medium text-gray-900">{user?.name || 'Admin'}</span>!
        </p>
        <div className="text-sm text-gray-500 mt-1">
          <p><strong>📧 Email:</strong> {user?.email || 'N/A'}</p>
          <p><strong>🆔 User ID:</strong> {user?.userId || 'N/A'}</p>
          <p><strong>🌐 Website URL:</strong> {user?.websiteUrl || 'N/A'}</p>
          <p><strong>🔐 Admin URL:</strong> {user?.adminUrl || 'N/A'}</p>
        </div>
      </div>

      {/* Product Statistics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Product Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {productStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Order Statistics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Order Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {orderStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Payment Statistics */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Payment Statistics</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {paymentStats.map((stat, index) => (
            <StatsCard key={index} {...stat} />
          ))}
        </div>
      </section>

      {/* Recent Orders */}
      <section>
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Orders</h2>
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.customer}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
