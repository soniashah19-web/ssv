// Hook to use either demo or real API based on environment
import { customerAPI as realCustomerAPI, bookingAPI as realBookingAPI, invoiceAPI as realInvoiceAPI, communicationAPI as realCommunicationAPI, dashboardAPI as realDashboardAPI } from '../services/api';
import { demoCustomerAPI, demoBookingAPI, demoInvoiceAPI, demoCommunicationAPI, demoDashboardAPI } from '../services/demoService';

const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';

export const useAPI = () => {
  if (isDemoMode) {
    return {
      customerAPI: demoCustomerAPI,
      bookingAPI: demoBookingAPI,
      invoiceAPI: demoInvoiceAPI,
      communicationAPI: demoCommunicationAPI,
      dashboardAPI: demoDashboardAPI,
    };
  }

  return {
    customerAPI: realCustomerAPI,
    bookingAPI: realBookingAPI,
    invoiceAPI: realInvoiceAPI,
    communicationAPI: realCommunicationAPI,
    dashboardAPI: realDashboardAPI,
  };
};
