import api from '../api';

export const getSalesOrders = async (page?: number, limit?: number, period?: string, status?: string, tableNumber?: string) => {
  try {
    const params: any = {};
    if (page) params.page = page;
    if (limit) params.limit = limit;
    if (period) params.period = period;
    if (status) params.status = status;
    if (tableNumber) params.tableNumber = tableNumber;

    const response = await api.get('/sales-orders', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching sales orders:', error);
    throw error;
  }
};

export const getSalesOrderById = async (id: string) => {
  try {
    const response = await api.get(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching sales order with id ${id}:`, error);
    throw error;
  }
};

export const createSalesOrder = async (salesOrderData: any) => {
  try {
    const response = await api.post('/sales-orders', salesOrderData);
    return response.data;
  } catch (error) {
    console.error('Error creating sales order:', error);
    throw error;
  }
};

export const updateSalesOrder = async (id: string, updateData: any) => {
  try {
    const response = await api.put(`/sales-orders/${id}`, updateData);
    return response.data;
  } catch (error) {
    console.error(`Error updating sales order with id ${id}:`, error);
    throw error;
  }
};

export const deleteSalesOrder = async (id: string) => {
  try {
    const response = await api.delete(`/sales-orders/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting sales order with id ${id}:`, error);
    throw error;
  }
};
