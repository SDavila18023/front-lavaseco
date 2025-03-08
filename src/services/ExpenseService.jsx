import axios from "axios";

const API_URL = "http://localhost:5000/api/cost/specific";

export const fetchExpenses = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw new Error("Failed to fetch expenses");
  }
};

export const createExpense = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to create expense");
  }
};

export const updateExpense = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    throw new Error("Failed to update expense");
  }
};

export const deleteExpense = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete expense");
  }
};
