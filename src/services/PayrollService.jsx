const VITE_API_URL = import.meta.env.VITE_API_URL;
const API_URL = `${VITE_API_URL}/api/cost/payroll`;

export const fetchPayrollExpenses = async () => {
  const response = await fetch(API_URL);
  if (!response.ok) {
    throw new Error("Failed to fetch payroll expenses");
  }
  return response.json();
};

export const createPayrollExpense = async (expenseData) => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) {
    throw new Error("Failed to create payroll expense");
  }
  return response.json();
};

export const updatePayrollExpense = async (id, expenseData) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expenseData),
  });
  if (!response.ok) {
    throw new Error("Failed to update payroll expense");
  }
  return response.json();
};

export const deletePayrollExpense = async (id) => {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) {
    throw new Error("Failed to delete payroll expense");
  }
  return response.json();
};

export const fetchEmployees = async () => {
  const response = await fetch("/api/employees");
  if (!response.ok) {
    throw new Error("Failed to fetch employees");
  }
  return response.json();
};
