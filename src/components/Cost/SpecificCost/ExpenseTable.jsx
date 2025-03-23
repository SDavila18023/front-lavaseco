import React from "react";
import {
  Trash2,
  PencilLine,
  Loader2,
  AlertCircle,
  DollarSign,
  Receipt,
} from "lucide-react";

const ExpenseTable = ({ expenses, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="animate-spin text-purple-600" size={48} />
        <p className="text-purple-600 font-medium">Cargando gastos...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg flex items-center gap-3 shadow-sm">
        <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
        <p className="font-medium">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-100 overflow-hidden">
      {expenses.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Receipt size={14} />
                    Nombre
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    Valor
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {expenses.map((expense) => (
                <tr
                  key={expense.id_gasto_esp}
                  className="hover:bg-red-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {expense.nom_gasto}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm bg-red-100 text-red-800 px-2 py-1 rounded-full inline-flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {new Intl.NumberFormat("es-ES").format(
                        expense.valor_gasto_especifico
                      )}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(expense)}
                        className="text-purple-600 hover:text-purple-900 bg-purple-100 p-2 rounded-full transition-colors hover:bg-purple-200"
                        title="Editar"
                      >
                        <PencilLine size={16} />
                      </button>
                      <button
                        onClick={() => onDelete(expense.id_gasto_esp)}
                        className="text-red-600 hover:text-red-900 bg-red-100 p-2 rounded-full transition-colors hover:bg-red-200"
                        title="Eliminar"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-16 px-4">
          <Receipt className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-gray-500 font-medium text-lg mb-2">
            No se encontraron gastos
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto">
            Cuando registres gastos específicos, aparecerán listados aquí.
          </p>
        </div>
      )}
    </div>
  );
};

export default ExpenseTable;
