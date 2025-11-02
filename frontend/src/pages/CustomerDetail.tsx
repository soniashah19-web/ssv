import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { customerAPI, communicationAPI } from '../services/api';
import toast from 'react-hot-toast';
import { ArrowLeft, Mail, Phone, MapPin, Plus } from 'lucide-react';
import { format } from 'date-fns';

const CustomerDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCommModal, setShowCommModal] = useState(false);
  const [commFormData, setCommFormData] = useState({
    type: 'note',
    subject: '',
    content: '',
    isImportant: false,
  });

  useEffect(() => {
    fetchCustomerDetails();
  }, [id]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await customerAPI.getById(id!);
      setCustomer(response.data.customer);
    } catch (error) {
      toast.error('Failed to load customer details');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddCommunication = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await communicationAPI.create({
        customerId: id,
        ...commFormData,
      });
      toast.success('Communication logged successfully');
      setShowCommModal(false);
      setCommFormData({
        type: 'note',
        subject: '',
        content: '',
        isImportant: false,
      });
      fetchCustomerDetails();
    } catch (error) {
      toast.error('Failed to log communication');
    }
  };

  if (isLoading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  if (!customer) {
    return <div className="text-center py-12">Customer not found</div>;
  }

  return (
    <div>
      <button
        onClick={() => navigate('/customers')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft size={20} />
        Back to Customers
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Customer Info */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">{customer.companyName}</h2>

            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <Mail className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Phone className="text-gray-400 mt-1" size={18} />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
              </div>

              {customer.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="text-gray-400 mt-1" size={18} />
                  <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-900">{customer.address}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Type</p>
                  <p className="font-medium capitalize">{customer.customerType.replace('_', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      customer.paymentStatus === 'good'
                        ? 'bg-green-100 text-green-700'
                        : customer.paymentStatus === 'warning'
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {customer.paymentStatus}
                  </span>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gray-500">Outstanding Balance</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${parseFloat(customer.outstandingBalance).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            {customer.notes && (
              <div className="mt-6 pt-6 border-t">
                <p className="text-sm text-gray-500 mb-2">Notes</p>
                <p className="text-gray-700">{customer.notes}</p>
              </div>
            )}
          </div>
        </div>

        {/* Activity Sections */}
        <div className="lg:col-span-2 space-y-6">
          {/* Communications */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Communications</h3>
              <button
                onClick={() => setShowCommModal(true)}
                className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700"
              >
                <Plus size={18} />
                Log Communication
              </button>
            </div>
            <div className="p-6">
              {customer.communications && customer.communications.length > 0 ? (
                <div className="space-y-4">
                  {customer.communications.map((comm: any) => (
                    <div key={comm.id} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{comm.subject}</p>
                          <p className="text-sm text-gray-600 mt-1">{comm.content}</p>
                          <p className="text-xs text-gray-500 mt-2">
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
                <p className="text-gray-500 text-center py-8">No communications logged</p>
              )}
            </div>
          </div>

          {/* Bookings */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Bookings</h3>
            </div>
            <div className="p-6">
              {customer.bookings && customer.bookings.length > 0 ? (
                <div className="space-y-4">
                  {customer.bookings.map((booking: any) => (
                    <div key={booking.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{booking.resourceName}</p>
                          <p className="text-sm text-gray-600">
                            {format(new Date(booking.startDate), 'PPP')} -{' '}
                            {format(new Date(booking.endDate), 'PPP')}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            ${parseFloat(booking.totalAmount).toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            booking.status === 'confirmed'
                              ? 'bg-green-100 text-green-700'
                              : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {booking.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No bookings</p>
              )}
            </div>
          </div>

          {/* Invoices */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-xl font-bold text-gray-900">Invoices</h3>
            </div>
            <div className="p-6">
              {customer.invoices && customer.invoices.length > 0 ? (
                <div className="space-y-4">
                  {customer.invoices.map((invoice: any) => (
                    <div key={invoice.id} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{invoice.invoiceNumber}</p>
                          <p className="text-sm text-gray-600">
                            Due: {format(new Date(invoice.dueDate), 'PPP')}
                          </p>
                          <p className="text-sm font-medium text-gray-900 mt-2">
                            ${parseFloat(invoice.amount).toFixed(2)}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            invoice.status === 'paid'
                              ? 'bg-green-100 text-green-700'
                              : invoice.status === 'overdue'
                              ? 'bg-red-100 text-red-700'
                              : 'bg-yellow-100 text-yellow-700'
                          }`}
                        >
                          {invoice.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No invoices</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Communication Modal */}
      {showCommModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Log Communication</h2>
            <form onSubmit={handleAddCommunication} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={commFormData.type}
                  onChange={(e) => setCommFormData({ ...commFormData, type: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                >
                  <option value="phone">Phone Call</option>
                  <option value="email">Email</option>
                  <option value="meeting">Meeting</option>
                  <option value="note">Note</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
                <input
                  type="text"
                  value={commFormData.subject}
                  onChange={(e) => setCommFormData({ ...commFormData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={commFormData.content}
                  onChange={(e) => setCommFormData({ ...commFormData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  required
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={commFormData.isImportant}
                  onChange={(e) => setCommFormData({ ...commFormData, isImportant: e.target.checked })}
                  className="mr-2"
                />
                <label className="text-sm text-gray-700">Mark as important</label>
              </div>
              <div className="flex gap-4">
                <button
                  type="submit"
                  className="flex-1 bg-primary-600 text-white py-3 rounded-lg hover:bg-primary-700"
                >
                  Log Communication
                </button>
                <button
                  type="button"
                  onClick={() => setShowCommModal(false)}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomerDetail;
