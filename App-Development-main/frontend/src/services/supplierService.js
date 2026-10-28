import api from "./api";

const supplierService = {
  getAll: async () => {
    const response = await api.get("/api/suppliers/all");
    return response.data;
  },

  create: async (dto) => {
    const response = await api.post("/api/suppliers", dto);
    return response.data;
  },

  update: async (id, dto) => {
    const response = await api.put(`/api/suppliers/${id}`, dto);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/suppliers/${id}`);
    return response.data;
  },

  getPerformance: async (id) => {
    const response = await api.get(`/api/suppliers/${id}/performance`);
    return response.data;
  },
};

export default supplierService;