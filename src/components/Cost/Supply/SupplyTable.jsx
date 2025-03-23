import React from "react";
import {
  Trash2,
  PencilLine,
  Loader2,
  AlertCircle,
  Package,
  DollarSign,
  Info,
  Plus,
  Search,
} from "lucide-react";

const SupplyTable = ({ supplies, loading, error, onEdit, onDelete }) => {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4">
        <Loader2 className="animate-spin text-purple-600" size={48} />
        <p className="text-purple-600 font-medium">Cargando insumos...</p>
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
      {supplies.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <DollarSign size={14} />
                    Valor
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="flex items-center gap-1">
                    <Info size={14} />
                    Detalles
                  </div>
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {supplies.map((supply) => (
                <tr
                  key={supply.id_insumo}
                  className="hover:bg-purple-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-gray-900">
                      {supply.nom_insumo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm bg-green-100 text-green-800 px-2 py-1 rounded-full inline-flex items-center">
                      <DollarSign size={14} className="mr-1" />
                      {new Intl.NumberFormat("es-ES").format(
                        supply.valor_insumo
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {supply.detalle_insumo?.length > 0 ? (
                      <div className="space-y-1">
                        {supply.detalle_insumo?.map((detail) => (
                          <div
                            key={detail.id_detalle_insumo}
                            className="text-xs bg-gray-100 px-2 py-1 rounded flex items-center"
                          >
                            <span className="font-medium text-gray-700">
                              {detail.concepto}
                            </span>
                            <span className="ml-1 text-gray-500">
                              - {detail.peso}kg
                            </span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-gray-400 text-xs italic">
                        Sin detalles
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onEdit(supply)}
                        className="text-indigo-600 hover:text-indigo-900 bg-indigo-100 p-2 rounded-full transition-colors hover:bg-indigo-200"
                        title="Editar"
                      >
                        <PencilLine size={16} />
                      </button>

                      <button
                        onClick={() => onDelete(supply.id_insumo)}
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
          <Package className="mx-auto text-gray-300 mb-3" size={48} />
          <h3 className="text-gray-500 font-medium text-lg mb-2">
            No se encontraron insumos
          </h3>
          <p className="text-gray-400 text-sm max-w-md mx-auto mb-4">
            Agrega nuevos insumos para comenzar a gestionar tu inventario
          </p>
          <button className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md flex items-center gap-2 mx-auto transition-colors">
            <Plus size={16} />
            Agregar Insumo
          </button>
        </div>
      )}
    </div>
  );
};

export default SupplyTable;
