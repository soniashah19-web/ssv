import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardAPI } from '../services/api';
import toast from 'react-hot-toast';
import {
  Users,
  AlertTriangle,
  Ban,
  DollarSign,
  Calendar,
  FileText,
} from 'lucide-react';
import { format } from 'date-fns';

const Dashboard = () => {
  const [data, setData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getStats();
      setData(response.data);
    } catch (error: any) {
      toast.error('Failed to load dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading dashboard...</div>;
  }

  const stats = data?.stats || {};

  const statCards = [
    {
      label: 'Total Customers',
      value: stats.totalCustomers,
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Payment Warnings',
      value: stats.customersWithWarnings,
      icon: AlertTriangle,
      color: 'bg-yellow-500',
    },
    {
      label: 'Blocked Customers',
      value: stats.blockedCustomers,
      icon: Ban,
      color: 'bg-red-500',
    },
    {
      label: 'Outstanding Balance',
      value: `$${stats.totalOutstandingBalance}`,
      icon: DollarSign,
      color: 'bg-green-500',
    },
    {
      label: 'Active Bookings',
      value: stats.activeBookings,
      icon: Calendar,
      color: 'bg-purple-500',
    },
    {
      label: 'Overdue Invoices',
      value: stats.overdueInvoices,
      icon: FileText,
      color: 'bg-orange-500',
    },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of your serviced offices business</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {statCards.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.label}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div className={`${stat.color} p-3 rounded-lg`}>
                  <Icon className="text-white" size={24} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Customers Needing Attention */}
      {data?.customersNeedingAttention && data.customersNeedingAttention.length > 0 && (
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Customers Needing Attention</h2>
            <p className="text-gray-600 text-sm mt-1">
              Customers with payment issues or outstanding balances
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Company
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Outstanding
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {data.customersNeedingAttention.map((customer: any) => (
                  <tr key={customer.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">{customer.companyName}</td>
                    <td className="px-6 py-4">{customer.contactName}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          customer.paymentStatus === 'blocked'
                            ? 'bg-red-100 text-red-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}
                      >
                        {customer.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ${parseFloat(customer.outstandingBalance).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <Link
                        to={`/customers/${customer.id}`}
                        className="text-primary-600 hover:underline"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Upcoming Bookings */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Upcoming Bookings</h2>
          </div>
          <div className="p-6">
            {data?.upcomingBookings && data.upcomingBookings.length > 0 ? (
              <div className="space-y-4">
                {data.upcomingBookings.map((booking: any) => (
                  <div key={booking.id} className="border-l-4 border-primary-500 pl-4 py-2">
                    <p className="font-medium text-gray-900">
                      {booking.customer.companyName}
                    </p>
                    <p className="text-sm text-gray-600">{booking.resourceName}</p>
                    <p className="text-sm text-gray-500">
                      {format(new Date(booking.startDate), 'PPP')}
                    </p>
                    {booking.customer.paymentStatus !== 'good' && (
                      <span className="text-xs text-yellow-600 font-medium">
                        Payment warning
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No upcoming bookings</p>
            )}
          </div>
        </div>

        {/* Recent Communications */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-900">Recent Communications</h2>
          </div>
          <div className="p-6">
            {data?.recentCommunications && data.recentCommunications.length > 0 ? (
              <div className="space-y-4">
                {data.recentCommunications.map((comm: any) => (
                  <div key={comm.id} className="border-l-4 border-blue-500 pl-4 py-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{comm.subject}</p>
                        <p className="text-sm text-gray-600">
                          {comm.customer.companyName}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(comm.createdAt), 'PPp')}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 rounded text-xs font-medium ${
                          comm.type === 'phone'
                            ? 'bg-green-100 text-green-700'
                            : comm.type === 'email'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {comm.type}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">No recent communications</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
