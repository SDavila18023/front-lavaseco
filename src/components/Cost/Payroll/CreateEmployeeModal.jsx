import React, { useState, useEffect } from "react";
import { X, Save, User, Briefcase, DollarSign, Phone, Calendar, AlertCircle } from "lucide-react";

const CreateEmployeeModal = ({ isOpen, onClose, onCreate }) => {
  const [name, setName] = useState("");
  const [tipo_emp, setTipo_emp] = useState("");
  const [salary, setSalary] = useState("");
  const [phone, setPhone] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("quincenal");
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "auto";
    };
  }, [isOpen, onClose]);

  const validateForm = () => {
    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es obligatorio";
    }

    if (!tipo_emp.trim()) {
      newErrors.tipo_emp = "El cargo es obligatorio";
    }

    const parsedSalary = parseFloat(salary);
    if (isNaN(parsedSalary) || parsedSalary <= 0) {
      newErrors.salary = "El salario debe ser un número mayor a 0";
    }

    if (!phone.trim()) {
      newErrors.phone = "El teléfono es obligatorio";
    } else if (!/^\d{7,15}$/.test(phone.replace(/\D/g, ''))) {
      newErrors.phone = "Ingrese un número de teléfono válido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    onCreate({
      nom_empleado: name.trim(),
      tipo_emp: tipo_emp.trim(),
      salario: parseFloat(salary),
      tel_empleado: phone.trim(),
      frecuencia_pago: paymentFrequency,
    });

    setName("");
    setSalary("");
    setTipo_emp("");
    setPhone("");
    setPaymentFrequency("quincenal");
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm transition-opacity">
      <div
        className="bg-white rounded-xl shadow-2xl w-full max-w-md transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-purple-100">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded-full">
              <User className="h-5 w-5 text-purple-600" />
            </div>
            <h2 className="text-xl font-bold text-purple-800">Crear Empleado</h2>
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
          <div className="space-y-4">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <User className="h-4 w-4 mr-2 text-purple-600" />
                Nombre
              </label>
              <input
                type="text"
                className={`w-full p-3 border ${errors.name ? 'border-red-300 bg-red-50' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all`}
                placeholder="Nombre completo"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.name}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Briefcase className="h-4 w-4 mr-2 text-purple-600" />
                Cargo
              </label>
              <input
                type="text"
                className={`w-full p-3 border ${errors.tipo_emp ? 'border-red-300 bg-red-50' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all`}
                placeholder="Posición o cargo"
                value={tipo_emp}
                onChange={(e) => setTipo_emp(e.target.value)}
              />
              {errors.tipo_emp && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.tipo_emp}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <DollarSign className="h-4 w-4 mr-2 text-purple-600" />
                Salario
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="number"
                  className={`w-full p-3 pl-8 border ${errors.salary ? 'border-red-300 bg-red-50' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all`}
                  placeholder="0.00"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  min="1"
                />
              </div>
              {errors.salary && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.salary}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Phone className="h-4 w-4 mr-2 text-purple-600" />
                Teléfono
              </label>
              <input
                type="tel"
                className={`w-full p-3 border ${errors.phone ? 'border-red-300 bg-red-50' : 'border-purple-200'} rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all`}
                placeholder="Número de contacto"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  {errors.phone}
                </p>
              )}
            </div>

            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                <Calendar className="h-4 w-4 mr-2 text-purple-600" />
                Frecuencia de Pago
              </label>
              <select
                className="w-full p-3 border border-purple-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all appearance-none"
                value={paymentFrequency}
                onChange={(e) => setPaymentFrequency(e.target.value)}
              >
                <option value="quincenal">Quincenal</option>
                <option value="mensual">Mensual</option>
              </select>
            </div>
          </div>

          {/* Footer with buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors flex items-center"
            >
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg shadow-md hover:shadow-lg transition-all flex items-center"
            >
              <Save className="h-4 w-4 mr-2" />
              Guardar Empleado
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;