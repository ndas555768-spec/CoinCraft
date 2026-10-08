import api from "./api";

// Income Services
export const getIncomes = async (params = {}) => {
  const response = await api.get("transactions/income/", { params });
  return response.data;
};

export const createIncome = async (data) => {
  const response = await api.post("transactions/income/", data);
  return response.data;
};

export const updateIncome = async (id, data) => {
  const response = await api.patch(`transactions/income/${id}/`, data);
  return response.data;
};

export const deleteIncome = async (id) => {
  const response = await api.delete(`transactions/income/${id}/`);
  return response.data;
};

// Expense Services
export const getExpenses = async (params = {}) => {
  const response = await api.get("transactions/expense/", { params });
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("transactions/expense/", data);
  return response.data;
};

export const updateExpense = async (id, data) => {
  const response = await api.patch(`transactions/expense/${id}/`, data);
  return response.data;
};

export const deleteExpense = async (id) => {
  const response = await api.delete(`transactions/expense/${id}/`);
  return response.data;
};

// Unified Transactions (all incomes + expenses for search & recent feeds)
export const getAllTransactions = async (params = {}) => {
  const response = await api.get("transactions/all/", { params });
  return response.data;
};
