import api from "@/utils/api";

// GET foods
export const getFoods = async () => {
  const res = await api.get("/foods");
  return res.data;
};

// ADD food
export const addFood = async (data: any) => {
  const res = await api.post("/foods", data);
  return res.data;
};