const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_URL = `${VITE_API_URL}/api/cost/employee`;

export const fetchEmployees = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};

export const createEmployee = async (employeeData) => {
  console.log(employeeData);

  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  if (!response.ok) {
    throw new Error("Failed to create employee");
  }
  return response.json();
};

export const updateEmployee = async (id, employeeData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(employeeData),
  });
  if (!response.ok) {
    throw new Error("Failed to update employee");
  }
  return response.json();
};

export const deleteEmployee = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete employee");
  }
  return response.json();
};

export const getEmployeeById = async (id) => {
  const response = await fetch(`${API_URL}/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee");
  }
  return response.json();
};

export const getEmployeeExpenses = async (id) => {
  const response = await fetch(`${API_URL}/${id}/expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee expenses");
  }
  return response.json();
};

export const searchEmployees = async (searchTerm) => {
  const response = await fetch(
    `${API_URL}/search?term=${encodeURIComponent(searchTerm)}`
  );
  if (!response.ok) {
    throw new Error("Failed to search employees");
  }
  return response.json();
};

export const getEmployeeStats = async () => {
  const response = await fetch(`${API_URL}/stats`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee statistics");
  }
  return response.json();
};

export const filterEmployeesByType = async (type) => {
  const response = await fetch(
    `${API_URL}/filter?type=${encodeURIComponent(type)}`
  );
  if (!response.ok) {
    throw new Error("Failed to filter employees");
  }
  return response.json();
};

export const getEmployeeTotalExpenses = async (id) => {
  const response = await fetch(`${API_URL}/${id}/total-expenses`);
  if (!response.ok) {
    throw new Error("Failed to fetch employee total expenses");
  }
  return response.json();
};
