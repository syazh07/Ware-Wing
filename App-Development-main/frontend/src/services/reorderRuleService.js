import api from "./api";

const reorderRuleService = {
  getAll: async () => {
    const response = await api.get("/api/reorder-rules/all");
    return response.data;
  },

  create: async (dto) => {
    const response = await api.post("/api/reorder-rules", dto);
    return response.data;
  },

  update: async (id, dto) => {
    const response = await api.put(`/api/reorder-rules/${id}`, dto);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/api/reorder-rules/${id}`);
    return response.data;
  },

  evaluate: async () => {
    const response = await api.post("/api/reorder-rules/evaluate");
    return response.data;
  },
};

export default reorderRuleService;