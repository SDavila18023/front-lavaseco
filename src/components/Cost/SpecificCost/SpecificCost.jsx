import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import {
  fetchExpenses,
  deleteExpense,
  createExpense,
  updateExpense,
} from "../../../services/ExpenseService";
import SearchBar from "./SearchBar";
import ExpenseTable from "./ExpenseTable";
import ExpenseModal from "./ExpenseModal";

const SpecificCost = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentExpense, setCurrentExpense] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = async () => {
    try {
      setLoading(true);
      const data = await fetchExpenses();
      setExpenses(data);
    } catch (err) {
      setError("Error al cargar los gastos");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteExpense(id);
      await loadExpenses();
    } catch (err) {
      setError("Error al borrar");
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentExpense) {
        await updateExpense(currentExpense.id_gasto_esp, formData);
      } else {
        await createExpense(formData);
      }

      await loadExpenses();

      setIsModalOpen(false);
      setCurrentExpense(null);
    } catch (err) {
      setError("Error al guardar");
    }
  };

  const handleEdit = (expense) => {
    setCurrentExpense(expense);
    setIsModalOpen(true);
  };

  const filteredExpenses = expenses.filter((expense) =>
    expense.nom_gasto.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Gastos Específicos
          </h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={20} />
            Agregar Gasto
          </button>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <ExpenseTable
          expenses={filteredExpenses}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <ExpenseModal
          isOpen={isModalOpen}
          expense={currentExpense}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentExpense(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default SpecificCost;
