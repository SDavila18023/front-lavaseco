import axios from "axios";
const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_URL = `${VITE_API_URL}/api/cost/supply`;

export const fetchSupplies = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    console.error(
      "Error fetching supplies:",
      error.response?.data || error.message
    );
    throw new Error("Failed to fetch supplies");
  }
};

export const createSupply = async (data) => {
  try {
    const response = await axios.post(API_URL, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error creating supply:",
      error.response?.data || error.message
    );
    throw new Error("Failed to create supply");
  }
};

export const updateSupply = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error(
      "Error updating supply:",
      error.response?.data || error.message
    );
    throw new Error("Failed to update supply");
  }
};

export const deleteSupply = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting supply:",
      error.response?.data || error.message
    );
    throw new Error("Failed to delete supply");
  }
};
