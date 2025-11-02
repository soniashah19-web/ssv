// Demo service that returns mock data instead of making API calls

import {
  mockCustomers,
  mockBookings,
  mockInvoices,
  mockCommunications,
  mockDashboardStats,
} from '../data/mockData';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

// Simulate API delay
const delay = (ms: number = 300) => new Promise(resolve => setTimeout(resolve, ms));

export const demoCustomerAPI = {
  getAll: async (params?: any) => {
    await delay();
    let customers = [...mockCustomers];

    // Apply filters
    if (params?.search) {
      const search = params.search.toLowerCase();
      customers = customers.filter(c =>
        c.companyName.toLowerCase().includes(search) ||
        c.contactName.toLowerCase().includes(search) ||
        c.email.toLowerCase().includes(search)
      );
    }

    if (params?.paymentStatus) {
      customers = customers.filter(c => c.paymentStatus === params.paymentStatus);
    }

    return { data: { customers } };
  },

  getById: async (id: string) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === parseInt(id));

    if (customer) {
      // Add related data
      const customerWithRelations = {
        ...customer,
        communications: mockCommunications.filter(comm => comm.customerId === customer.id),
        bookings: mockBookings.filter(b => b.customerId === customer.id),
        invoices: mockInvoices.filter(inv => inv.customerId === customer.id),
      };
      return { data: { customer: customerWithRelations } };
    }

    throw new Error('Customer not found');
  },

  create: async (data: any) => {
    await delay();
    const newCustomer = {
      id: mockCustomers.length + 1,
      ...data,
      paymentStatus: 'good',
      outstandingBalance: 0,
      createdAt: new Date().toISOString(),
    };
    return { data: { message: 'Customer created successfully', customer: newCustomer } };
  },

  update: async (id: string, data: any) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === parseInt(id));
    if (customer) {
      return { data: { message: 'Customer updated successfully', customer: { ...customer, ...data } } };
    }
    throw new Error('Customer not found');
  },

  delete: async (_id: string) => {
    await delay();
    return { data: { message: 'Customer deleted successfully' } };
  },

  getPaymentStatus: async (id: string) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === parseInt(id));
    if (customer) {
      const unpaidInvoices = mockInvoices.filter(
        inv => inv.customerId === customer.id && inv.status !== 'paid'
      );

      return {
        data: {
          canBook: customer.paymentStatus !== 'blocked',
          paymentStatus: customer.paymentStatus,
          outstandingBalance: customer.outstandingBalance,
          warnings: customer.paymentStatus === 'blocked'
            ? ['Customer is blocked due to unpaid invoices - cannot create bookings']
            : customer.paymentStatus === 'warning'
            ? ['Customer has outstanding payments']
            : [],
          unpaidInvoices,
        },
      };
    }
    throw new Error('Customer not found');
  },
};

export const demoBookingAPI = {
  getAll: async (params?: any) => {
    await delay();
    let bookings = [...mockBookings];

    if (params?.status) {
      bookings = bookings.filter(b => b.status === params.status);
    }

    if (params?.bookingType) {
      bookings = bookings.filter(b => b.bookingType === params.bookingType);
    }

    return { data: { bookings } };
  },

  getById: async (id: string) => {
    await delay();
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (booking) {
      return { data: { booking } };
    }
    throw new Error('Booking not found');
  },

  create: async (data: any) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === data.customerId);

    if (customer?.paymentStatus === 'blocked') {
      throw {
        response: {
          status: 403,
          data: {
            message: 'Cannot create booking - customer has outstanding payments and is blocked',
            paymentStatus: customer.paymentStatus,
            outstandingBalance: customer.outstandingBalance,
          },
        },
      };
    }

    const newBooking = {
      id: mockBookings.length + 1,
      ...data,
      status: 'pending',
      createdAt: new Date().toISOString(),
      customer,
    };

    const response: any = {
      data: {
        message: 'Booking created successfully',
        booking: newBooking,
      },
    };

    if (customer?.paymentStatus === 'warning') {
      response.data.warning = 'Customer has outstanding payments - please follow up';
    }

    return response;
  },

  update: async (id: string, data: any) => {
    await delay();
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (booking) {
      return { data: { message: 'Booking updated successfully', booking: { ...booking, ...data } } };
    }
    throw new Error('Booking not found');
  },

  cancel: async (id: string) => {
    await delay();
    const booking = mockBookings.find(b => b.id === parseInt(id));
    if (booking) {
      return { data: { message: 'Booking cancelled successfully', booking: { ...booking, status: 'cancelled' } } };
    }
    throw new Error('Booking not found');
  },
};

export const demoInvoiceAPI = {
  getAll: async (params?: any) => {
    await delay();
    let invoices = [...mockInvoices];

    if (params?.status) {
      invoices = invoices.filter(inv => inv.status === params.status);
    }

    if (params?.customerId) {
      invoices = invoices.filter(inv => inv.customerId === parseInt(params.customerId));
    }

    return { data: { invoices } };
  },

  getById: async (id: string) => {
    await delay();
    const invoice = mockInvoices.find(inv => inv.id === parseInt(id));
    if (invoice) {
      return { data: { invoice } };
    }
    throw new Error('Invoice not found');
  },

  create: async (data: any) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === data.customerId);
    const newInvoice = {
      id: mockInvoices.length + 1,
      ...data,
      paidAmount: 0,
      status: 'draft',
      createdAt: new Date().toISOString(),
      customer,
    };
    return { data: { message: 'Invoice created successfully', invoice: newInvoice } };
  },

  update: async (id: string, data: any) => {
    await delay();
    const invoice = mockInvoices.find(inv => inv.id === parseInt(id));
    if (invoice) {
      return { data: { message: 'Invoice updated successfully', invoice: { ...invoice, ...data } } };
    }
    throw new Error('Invoice not found');
  },

  markPaid: async (id: string, paidAmount?: number) => {
    await delay();
    const invoice = mockInvoices.find(inv => inv.id === parseInt(id));
    if (invoice) {
      return {
        data: {
          message: 'Invoice payment recorded successfully',
          invoice: { ...invoice, paidAmount: paidAmount || invoice.amount, status: 'paid' },
        },
      };
    }
    throw new Error('Invoice not found');
  },

  getOverdue: async () => {
    await delay();
    const overdueInvoices = mockInvoices.filter(inv =>
      inv.status === 'overdue' || (new Date(inv.dueDate) < new Date() && inv.status !== 'paid')
    );
    return { data: { invoices: overdueInvoices } };
  },
};

export const demoCommunicationAPI = {
  getAll: async (params?: any) => {
    await delay();
    let communications = [...mockCommunications];

    if (params?.customerId) {
      communications = communications.filter(c => c.customerId === parseInt(params.customerId));
    }

    if (params?.type) {
      communications = communications.filter(c => c.type === params.type);
    }

    return { data: { communications } };
  },

  getById: async (id: string) => {
    await delay();
    const communication = mockCommunications.find(c => c.id === parseInt(id));
    if (communication) {
      return { data: { communication } };
    }
    throw new Error('Communication not found');
  },

  create: async (data: any) => {
    await delay();
    const customer = mockCustomers.find(c => c.id === data.customerId);
    const newCommunication = {
      id: mockCommunications.length + 1,
      ...data,
      userId: 1,
      createdAt: new Date().toISOString(),
      customer,
      user: { id: 1, firstName: 'Demo', lastName: 'User' },
    };
    return { data: { message: 'Communication logged successfully', communication: newCommunication } };
  },

  update: async (id: string, data: any) => {
    await delay();
    const communication = mockCommunications.find(c => c.id === parseInt(id));
    if (communication) {
      return { data: { message: 'Communication updated successfully', communication: { ...communication, ...data } } };
    }
    throw new Error('Communication not found');
  },

  delete: async (_id: string) => {
    await delay();
    return { data: { message: 'Communication deleted successfully' } };
  },

  getRecent: async (limit?: number) => {
    await delay();
    const communications = mockCommunications.slice(0, limit || 10);
    return { data: { communications } };
  },
};

export const demoDashboardAPI = {
  getStats: async () => {
    await delay();
    return { data: mockDashboardStats };
  },
};

// Export wrapper that chooses between demo and real API
export const getDemoOrRealAPI = () => {
  if (isDemoMode) {
    return {
      customerAPI: demoCustomerAPI,
      bookingAPI: demoBookingAPI,
      invoiceAPI: demoInvoiceAPI,
      communicationAPI: demoCommunicationAPI,
      dashboardAPI: demoDashboardAPI,
    };
  }

  // Return real APIs
  const { customerAPI, bookingAPI, invoiceAPI, communicationAPI, dashboardAPI } = require('./api');
  return { customerAPI, bookingAPI, invoiceAPI, communicationAPI, dashboardAPI };
};
