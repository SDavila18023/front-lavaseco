import React, { useState, useEffect } from "react";
import { Plus, X } from "lucide-react";

const SupplyModal = ({ isOpen, supply, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    nom_insumo: "",
    valor_insumo: "",
    detalle_insumo: [],
  });

  useEffect(() => {
    console.log("Supply recibido en modal:", supply);

    if (supply) {
      setFormData({
        nom_insumo: supply.nom_insumo || "",
        valor_insumo: supply.valor_insumo || "",
        detalle_insumo: Array.isArray(supply.insumo_detalle)
          ? supply.insumo_detalle.map((item) => ({
            id_detalle_insumo: item.id_detalle_insumo,
            concepto: item.detalle?.concepto || "",
            peso: item.detalle?.peso || "",
          }))
          : [],
      });
    } else {
      setFormData({
        nom_insumo: "",
        valor_insumo: "",
        detalle_insumo: [],
      });
    }
  }, [supply]);


  const handleAddDetail = () => {
    setFormData({
      ...formData,
      detalle_insumo: [...formData.detalle_insumo, { concepto: "", peso: "" }],
    });
  };

  const handleRemoveDetail = (index) => {
    setFormData({
      ...formData,
      detalle_insumo: formData.detalle_insumo.filter((_, i) => i !== index),
    });
  };

  const handleDetailChange = (index, field, value) => {
    const newDetails = [...formData.detalle_insumo];
    newDetails[index] = {
      ...newDetails[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      detalle_insumo: newDetails,
    });
  };

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
            {supply ? "Editar" : "Agregar nuevo insumo"}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              required
              value={formData.nom_insumo}
              onChange={(e) => setFormData({ ...formData, nom_insumo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Valor
            </label>
            <input
              type="number"
              min="0"
              required
              value={formData.valor_insumo}
              onChange={(e) => setFormData({ ...formData, valor_insumo: e.target.value })}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Detalles
              </label>
              <button
                type="button"
                onClick={handleAddDetail}
                className="text-purple-600 hover:text-purple-700 text-sm flex items-center gap-1"
              >
                <Plus size={16} /> Agregar detalle
              </button>
            </div>

            {formData.detalle_insumo.map((detail, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <input
                  type="text"
                  placeholder="Concepto"
                  value={detail.concepto}
                  onChange={(e) => handleDetailChange(index, "concepto", e.target.value)}
                  className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <input
                  type="number"
                  step="0.01"
                  placeholder="Peso (kg)"
                  value={detail.peso}
                  onChange={(e) => handleDetailChange(index, "peso", e.target.value)}
                  className="w-24 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveDetail(index)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X size={20} />
                </button>
              </div>
            ))}
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
              {supply ? "Guardar Cambios" : "Agregar"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupplyModal;