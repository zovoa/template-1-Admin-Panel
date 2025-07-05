
import React, { useState } from 'react';
import { Search, Filter, DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const Payments = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const payments = [
    { id: 'PAY-1001', orderId: '#1001', customer: 'John Smith', amount: 149.99, status: 'Success', method: 'Credit Card', date: '2024-01-15', refund: 0 },
    { id: 'PAY-1002', orderId: '#1002', customer: 'Sarah Johnson', amount: 89.50, status: 'Success', method: 'PayPal', date: '2024-01-15', refund: 0 },
    { id: 'PAY-1003', orderId: '#1003', customer: 'Mike Davis', amount: 199.99, status: 'Pending', method: 'Credit Card', date: '2024-01-14', refund: 0 },
    { id: 'PAY-1004', orderId: '#1004', customer: 'Emily Brown', amount: 75.25, status: 'Failed', method: 'Debit Card', date: '2024-01-14', refund: 0 },
    { id: 'PAY-1005', orderId: '#1005', customer: 'Chris Wilson', amount: 129.99, status: 'Refunded', method: 'Credit Card', date: '2024-01-13', refund: 129.99 },
    { id: 'PAY-1006', orderId: '#1006', customer: 'Anna Taylor', amount: 245.50, status: 'Success', method: 'Credit Card', date: '2024-01-13', refund: 0 },
    { id: 'PAY-1007', orderId: '#1007', customer: 'David Lee', amount: 95.99, status: 'Success', method: 'Apple Pay', date: '2024-01-12', refund: 0 },
    { id: 'PAY-1008', orderId: '#1008', customer: 'Lisa Martinez', amount: 179.99, status: 'Pending', method: 'Google Pay', date: '2024-01-12', refund: 0 },
  ];

  const statuses = ['all', 'Success', 'Pending', 'Failed', 'Refunded'];

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customer.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || payment.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Success': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Failed': return 'bg-red-100 text-red-800';
      case 'Refunded': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const paymentStats = {
    totalRevenue: payments.filter(p => p.status === 'Success').reduce((sum, p) => sum + p.amount, 0),
    totalRefunds: payments.reduce((sum, p) => sum + p.refund, 0),
    successfulPayments: payments.filter(p => p.status === 'Success').length,
    failedPayments: payments.filter(p => p.status === 'Failed').length,
    pendingPayments: payments.filter(p => p.status === 'Pending').length,
    successRate: ((payments.filter(p => p.status === 'Success').length / payments.length) * 100).toFixed(1),
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Payments Overview</h1>
        <p className="text-gray-600">Monitor payment transactions and revenue</p>
      </div>

      {/* Payment Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-green-50 text-green-600">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} className="mr-1" />
              +15%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">${paymentStats.totalRevenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-600">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center text-green-600 text-sm">
              <TrendingUp size={16} className="mr-1" />
              +0.3%
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-gray-900">{paymentStats.successRate}%</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-yellow-50 text-yellow-600">
              <DollarSign size={24} />
            </div>
            <div className="text-sm text-gray-600">
              {paymentStats.pendingPayments} pending
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Successful Payments</p>
            <p className="text-2xl font-bold text-gray-900">{paymentStats.successfulPayments}</p>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 rounded-lg bg-red-50 text-red-600">
              <DollarSign size={24} />
            </div>
            <div className="flex items-center text-red-600 text-sm">
              <TrendingDown size={16} className="mr-1" />
              ${paymentStats.totalRefunds.toFixed(2)}
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Failed Payments</p>
            <p className="text-2xl font-bold text-gray-900">{paymentStats.failedPayments}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer, order ID, or payment ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div className="sm:w-48">
            <div className="relative">
              <Filter size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status === 'all' ? 'All Statuses' : status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Refund</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {filteredPayments.map((payment) => (
                <tr key={payment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payment.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">{payment.orderId}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.customer}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.method}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(payment.status)}`}>
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.refund > 0 ? `$${payment.refund}` : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {filteredPayments.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500">No payments found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Payments;
