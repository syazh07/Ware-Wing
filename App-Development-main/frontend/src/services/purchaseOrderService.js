import api from "./api";

const purchaseOrderService = {
  getAll: async () => {
    const response = await api.get("/api/purchase-orders/all");
    return response.data;
  },

  create: async (dto) => {
    const response = await api.post("/api/purchase-orders", dto);
    return response.data;
  },

  submit: async (id) => {
    const response = await api.put(`/api/purchase-orders/${id}/submit`);
    return response.data;
  },

  approve: async (id) => {
    const response = await api.put(`/api/purchase-orders/${id}/approve`);
    return response.data;
  },

  receive: async (id) => {
    const response = await api.put(`/api/purchase-orders/${id}/receive`);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/purchase-orders/${id}`);
    return response.data;
  },
};

export default purchaseOrderService;