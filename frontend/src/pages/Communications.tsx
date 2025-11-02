import { useEffect, useState } from 'react';
import { communicationAPI, customerAPI } from '../services/api';
import toast from 'react-hot-toast';
import { Plus, MessageSquare } from 'lucide-react';
import { format } from 'date-fns';

const Communications = () => {
  const [communications, setCommunications] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [filterType, setFilterType] = useState('');
  const [formData, setFormData] = useState({
    customerId: '',
    type: 'note',
    subject: '',
    content: '',
    isImportant: false,
  });

  useEffect(() => {
    fetchCommunications();
    fetchCustomers();
  }, [filterType]);

  const fetchCommunications = async () => {
    try {
      const params: any = {};
      if (filterType) params.type = filterType;

      const response = await communicationAPI.getAll(params);
      setCommunications(response.data.communications);
    } catch (error) {
      toast.error('Failed to load communications');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCustomers = async () => {
    try {
      const response = await customerAPI.getAll();
      setCustomers(response.data.customers);
    } catch (error) {
      console.error('Failed to load customers');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await communicationAPI.create({
        ...formData,
        customerId: parseInt(formData.customerId),
      });
      toast.success('Communication logged successfully');
      setShowModal(false);
      setFormData({
        customerId: '',
        type: 'note',
        subject: '',
        content: '',
        isImportant: false,
      });
      fetchCommunications();
    } catch (error) {
      toast.error('Failed to log communication');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Communications</h1>
          <p className="text-gray-600 mt-1">Track all customer interactions and conversations</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Log Communication
        </button>
      </div>

      {/* Filter */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="">All Types</option>
          <option value="phone">Phone</option>
          <option value="email">Email</option>
          <option value="meeting">Meeting</option>
          <option value="note">Note</option>
          <option value="other">Other</option>
        </select>
      </div>

      {/* Communications List */}
      <div className="space-y-4">
        {communications.map((comm) => (
          <div key={comm.id} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4">
                <div
                  className={`p-3 rounded-lg ${
                    comm.type === 'phone'
                      ? 'bg-green-100'
                      : comm.type === 'email'
                      ? 'bg-blue-100'
                      : comm.type === 'meeting'
                      ? 'bg-purple-100'
                      : 'bg-gray-100'
                  }`}
                >
                  <MessageSquare
                    className={
                      comm.type === 'phone'
                        ? 'text-green-700'
                        : comm.type === 'email'
                        ? 'text-blue-700'
                        : comm.type === 'meeting'
                        ? 'text-purple-700'
                        : 'text-gray-700'
                    }
                    size={24}
                  />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900">{comm.subject}</h3>
                    {comm.isImportant && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-medium rounded">
                        Important
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{comm.customer.companyName}</p>
                  <p className="text-gray-700">{comm.content}</p>
                </div>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                    comm.type === 'phone'
                      ? 'bg-green-100 text-green-700'
                      : comm.type === 'email'
                      ? 'bg-blue-100 text-blue-700'
                      : comm.type === 'meeting'
                      ? 'bg-purple-100 text-purple-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}
                >
                  {comm.type}
                </span>
                <p className="text-xs text-gray-500 mt-2">
                  {format(new Date(comm.createdAt), 'PPp')}
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  by {comm.user.firstName} {comm.user.lastName}
                </p>
              </div>
            </div>
          </div>
        ))}

        {communications.length === 0 && !isLoading && (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <MessageSquare className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600">No communications logged yet</p>
          </div>
        )}
      </div>

      {/* Log Communication Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold mb-6">Log Communication</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                <select
                  value={formData.customerId}
                  onChange={(e) => setFormData({ ...formData, customerId: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  required
                >
                  <option value="">Select a customer</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.companyName} - {customer.contactName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  placeholder="Brief summary of the communication"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
                  rows={4}
                  placeholder="Detailed notes about the communication..."
                  required
                />
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isImportant"
                  checked={formData.isImportant}
                  onChange={(e) => setFormData({ ...formData, isImportant: e.target.checked })}
                  className="mr-2 h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                />
                <label htmlFor="isImportant" className="text-sm text-gray-700">
                  Mark as important
                </label>
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
                  onClick={() => setShowModal(false)}
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

export default Communications;
