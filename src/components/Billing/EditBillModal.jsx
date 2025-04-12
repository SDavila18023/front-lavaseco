import React, { useState } from "react";
import axios from "axios";
import { X } from "lucide-react";

const EditBillModal = ({ factura, onClose }) => {
  const [formData, setFormData] = useState({
    id_factura: factura.id_factura,
    cod_factura: factura.cod_factura,
    fecha_final_fact: factura.fecha_final_fact,
    valor_fact: factura.valor_fact,
    estado: factura.estado, // Añadir estado
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_URL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedFormData = {
      ...formData,
      [name]: name === "valor_fact" ? parseFloat(value) : value,
    };

    // Si se modifica la fecha de entrega, cambiar el estado a "Entregado"
    if (name === "fecha_final_fact" && value) {
      updatedFormData.estado = "Entregado";
    }

    setFormData(updatedFormData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.put(`${API_URL}/api/bill/${formData.id_factura}`, formData);
      window.location.reload();  // Recargar la página después de la actualización
    } catch (err) {
      setError("Error al actualizar la factura. Inténtalo de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-5 w-5" />
        </button>

        <h2 className="text-xl font-bold text-purple-700 mb-4">
          Editar Factura
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Código de Factura
              </label>
              <input
                type="text"
                name="cod_factura"
                value={formData.cod_factura}
                disabled
                className="w-full p-2 border rounded-lg bg-gray-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha Final
              </label>
              <input
                type="date"
                name="fecha_final_fact"
                value={formData.fecha_final_fact ? formData.fecha_final_fact.split('T')[0] : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Valor Total
              </label>
              <input
                type="number"
                name="valor_fact"
                value={formData.valor_fact}
                onChange={handleChange}
                className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>
          </div>

          <div className="mt-6 flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-sm font-medium text-white bg-purple-600 rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBillModal;
