import React, { useState, useEffect } from "react";

const ExpenseModal = ({ isOpen, expense, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom_gasto: "",
    valor_gasto_especifico: "",
  });

  useEffect(() => {
    if (expense) {
      setFormData({
        nom_gasto: expense.nom_gasto,
        valor_gasto_especifico: expense.valor_gasto_especifico,
      });
    } else {
      setFormData({
        nom_gasto: "",
        valor_gasto_especifico: "",
      });
    }
  }, [expense]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-900">
            {expense ? "Editar Gasto" : "Agregar Nuevo Gasto"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del costo
            </label>
            <input
              type="text"
              required
              value={formData.nom_gasto}
              onChange={(e) =>
                setFormData({ ...formData, nom_gasto: e.target.value })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Cantidad
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.valor_gasto_especifico}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  valor_gasto_especifico: e.target.value,
                })
              }
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-white bg-purple-600 rounded-md hover:bg-purple-700"
            >
              {expense ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExpenseModal;
