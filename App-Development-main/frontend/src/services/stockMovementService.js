import api from "./api";

const stockMovementService = {
  getAllMovements: async () => {
    const response = await api.get("/api/stock-movements/all");
    return response.data;
  },

  create: async (dto) => {
    const response = await api.post("/api/stock-movements", dto);
    return response.data;
  },
};

export default stockMovementService;