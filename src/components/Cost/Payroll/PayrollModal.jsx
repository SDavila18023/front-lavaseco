import React, { useState, useEffect } from "react";
import { updateEmployee } from "../../../services/EmployeeService";
import {
  X,
  Save,
  DollarSign,
  CreditCard,
  AlertCircle,
  FileText,
  Award,
  CheckCircle
} from "lucide-react";

const PayrollModal = ({ isOpen, onClose, employee }) => {
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("liquidacion");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setAmount("");
      setType("liquidacion");
      setSaving(false);
      setSuccess(false);
      setError(null);
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      setError("Por favor ingrese un monto válido mayor a cero");
      return;
    }

    setSaving(true);
    setError(null);

    try {
      await updateEmployee(employee.id_empleado, {
        tipo_pago: type,
        monto: parseFloat(amount),
      });

      setSuccess(true);
      setSaving(false);

      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error al registrar:", error);
      setError("Error al registrar la liquidación o prima.");
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-purple-800">
                Registrar Pago
              </h2>
              <p className="text-sm text-gray-600">
                Para: <span className="font-medium text-purple-700">{employee.nom_empleado}</span>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6">
          {success ? (
            <div className="flex flex-col items-center justify-center py-4">
              <div className="bg-green-100 p-3 rounded-full mb-3">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-green-800 mb-1">¡Pago registrado correctamente!</h3>
              <p className="text-sm text-green-600">El registro se ha actualizado en el sistema.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  {type === "liquidacion" ? (
                    <FileText className="h-4 w-4 mr-2 text-purple-600" />
                  ) : (
                    <Award className="h-4 w-4 mr-2 text-purple-600" />
                  )}
                  Tipo de Pago
                </label>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${type === "liquidacion"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-400"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    onClick={() => setType("liquidacion")}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Liquidación
                  </button>
                  <button
                    type="button"
                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center ${type === "prima"
                        ? "bg-purple-100 text-purple-800 border-2 border-purple-400"
                        : "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200"
                      }`}
                    onClick={() => setType("prima")}
                  >
                    <Award className="h-4 w-4 mr-2" />
                    Prima
                  </button>
                </div>
              </div>

              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                  <CreditCard className="h-4 w-4 mr-2 text-purple-600" />
                  Monto
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <DollarSign className="h-4 w-4 text-gray-500" />
                  </div>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full py-3 px-4 pl-10 border border-purple-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
                    placeholder="0.00"
                    min="0"
                    required
                  />
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600 flex items-center">
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {error}
                  </p>
                )}
              </div>

              <div className="pt-2">
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex items-start">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                    <div className="text-sm text-blue-800">
                      <p className="font-medium mb-1">Información importante</p>
                      <p className="text-blue-700">
                        {type === "liquidacion"
                          ? "La liquidación se calculará según las leyes laborales vigentes y el tiempo de servicio del empleado."
                          : "La prima corresponde al beneficio semestral establecido por ley para el trabajador."}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer with buttons */}
          {!success && (
            <div className="flex justify-end gap-3 mt-6">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
                disabled={saving}
              >
                <X className="h-4 w-4 mr-2" />
                Cancelar
              </button>
              <button
                type="submit"
                className={`px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center ${saving ? "opacity-70 cursor-not-allowed" : ""
                  }`}
                disabled={saving}
              >
                {saving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Procesando...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Registrar Pago
                  </>
                )}
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default PayrollModal;