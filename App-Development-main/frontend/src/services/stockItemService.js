import api from "./api";

const stockItemService = {
  getAll: async () => {
    const response = await api.get("/api/stock-items/all");
    return response.data;
  },

  create: async (dto) => {
    const response = await api.post("/api/stock-items", dto);
    return response.data;
  },

  update: async (id, dto) => {
    const response = await api.put(`/api/stock-items/${id}`, dto);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/stock-items/${id}`);
    return response.data;
  },
};

export default stockItemService;