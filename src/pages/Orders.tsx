import React, { useState, useEffect } from 'react';
import { Search, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useAuth } from '../components/auth/AuthProvider';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";

interface Order {
  id: string;
  customer: string;
  email: string;
  total: number;
  status: string;
  date: string;
  items: number;
}

const Orders = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    console.log('📦 Orders Page Loaded!');
    if (user) {
      console.log('👤 Logged-in Admin Full Object:', user);
      console.log('✅ Email:', user.email);
      console.log('🆔 userId:', user.userId);
      console.log('🌐 Website URL:', user.websiteUrl);
      console.log('🔐 Admin Panel:', user.adminUrl);
      console.log('📢 Message:', user.message);
      console.log('🎯 Success:', user.success);

      // Fetch orders when user data is available
      fetchOrders();
    } else {
      console.warn('⚠️ No user data found in context!');
    }
  }, [user]);

  const fetchOrders = async () => {
    try {
      if (!user?.websiteUrl) {
        console.warn('⚠️ Website URL not available in user data');
        return;
      }

      console.log('🔄 Fetching orders from API...');
      setIsLoading(true);

      const apiUrl = `https://8ed7-106-208-116-1.ngrok-free.app/api/orders/1/key/${user.websiteUrl}`;
      console.log('🌐 API URL:', apiUrl);

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'ngrok-skip-browser-warning': 'true'
        }
      });


      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('📦 Orders fetched successfully:', data);

      // Transform API data to match our interface if needed
      const formattedOrders = data.map((order: any) => ({
        id: order.orderId || `#${Math.floor(1000 + Math.random() * 9000)}`,
        customer: order.customerName || 'Unknown Customer',
        email: order.customerEmail || 'no-email@example.com',
        total: order.totalAmount || 0,
        status: order.orderStatus || 'Pending',
        date: order.orderDate || new Date().toISOString().split('T')[0],
        items: order.itemCount || 1,
        // Add any additional mapping here
      }));

      setOrders(formattedOrders);
    } catch (error) {
      console.error('❌ Error fetching orders:', error);
      toast({
        title: "Error",
        description: "Failed to fetch orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const statuses = ['all', 'Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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

  const handleViewOrder = (order: Order) => {
    console.log('👀 Viewing order:', order);
    setSelectedOrder(order);
    setIsViewDialogOpen(true);
  };

  const handleEditOrder = async (order: Order) => {
    console.log('✏️ Editing order:', order);
    try {
      // Here you would typically make an API call to update the order
      // For now, we'll just show a toast and refresh the data
      toast({
        title: "Order Updated",
        description: `Order ${order.id} has been updated.`,
      });

      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Refresh orders
      fetchOrders();
    } catch (error) {
      console.error('❌ Error updating order:', error);
      toast({
        title: "Error",
        description: "Failed to update order",
        variant: "destructive",
      });
    }
  };

  const handleDeleteOrder = async (orderId: string) => {
    console.log('🗑️ Deleting order:', orderId);
    if (window.confirm(`Are you sure you want to delete order ${orderId}?`)) {
      try {
        // Here you would typically make an API call to delete the order
        // For now, we'll just show a toast and refresh the data
        toast({
          title: "Order Deleted",
          description: `Order ${orderId} has been deleted.`,
        });

        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Refresh orders
        fetchOrders();
      } catch (error) {
        console.error('❌ Error deleting order:', error);
        toast({
          title: "Error",
          description: "Failed to delete order",
          variant: "destructive",
        });
      }
    }
  };

  const orderSummaryStats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'Pending').length,
    processing: orders.filter(o => o.status === 'Processing').length,
    shipped: orders.filter(o => o.status === 'Shipped').length,
    delivered: orders.filter(o => o.status === 'Delivered').length,
    cancelled: orders.filter(o => o.status === 'Cancelled').length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Orders Management</h1>
          <p className="text-gray-600">Track and manage all customer orders</p>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading orders...</p>
        </div>
      )}

      {/* Order Summary Stats - Only show when not loading */}
      {!isLoading && (
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-gray-900">{orderSummaryStats.total}</p>
            <p className="text-sm text-gray-600">Total Orders</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-orange-600">{orderSummaryStats.pending}</p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-yellow-600">{orderSummaryStats.processing}</p>
            <p className="text-sm text-gray-600">Processing</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-blue-600">{orderSummaryStats.shipped}</p>
            <p className="text-sm text-gray-600">Shipped</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-green-600">{orderSummaryStats.delivered}</p>
            <p className="text-sm text-gray-600">Delivered</p>
          </div>
          <div className="bg-white rounded-lg shadow-sm border p-4 text-center">
            <p className="text-2xl font-bold text-red-600">{orderSummaryStats.cancelled}</p>
            <p className="text-sm text-gray-600">Cancelled</p>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search by customer name or order ID..."
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

      {/* Orders Table */}
      {!isLoading && (
        <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customer}</div>
                        <div className="text-sm text-gray-500">{order.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.items} items</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${order.total.toFixed(2)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleViewOrder(order)}
                          className="text-blue-600 hover:text-blue-900 transition-colors p-1 rounded hover:bg-blue-50"
                          title="View Order"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleEditOrder(order)}
                          className="text-green-600 hover:text-green-900 transition-colors p-1 rounded hover:bg-green-50"
                          title="Edit Order"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteOrder(order.id)}
                          className="text-red-600 hover:text-red-900 transition-colors p-1 rounded hover:bg-red-50"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Order ID</p>
                  <p className="text-lg font-semibold">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Status</p>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Customer</p>
                  <p className="font-medium">{selectedOrder.customer}</p>
                  <p className="text-sm text-gray-500">{selectedOrder.email}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Order Date</p>
                  <p>{selectedOrder.date}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Items</p>
                  <p>{selectedOrder.items} items</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-lg font-semibold">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {!isLoading && filteredOrders.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <p className="text-gray-500">No orders found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default Orders;