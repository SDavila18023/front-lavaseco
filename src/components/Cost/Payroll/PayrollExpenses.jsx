import React, { useEffect, useState } from "react";
import {
  fetchEmployees,
  deleteEmployee,
  createEmployee,
} from "../../../services/EmployeeService";
import {
  Plus,
  Trash2,
  Search,
  UserPlus,
  DollarSign,
  AlertCircle,
  Loader2,
  Filter,
  ChevronDown,
  FileSpreadsheet,
  Mail,
  Phone,
  User
} from "lucide-react";
import EmployeeModal from "./CreateEmployeeModal";
import PayrollModal from "./PayrollModal";

const EmployeeTable = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isPayrollModalOpen, setIsPayrollModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [sortBy, setSortBy] = useState("nom_empleado");
  const [sortDirection, setSortDirection] = useState("asc");

  useEffect(() => {
    const getEmployees = async () => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getEmployees();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este empleado?")) {
      try {
        await deleteEmployee(id);
        const updatedEmployees = await fetchEmployees();
        setEmployees(updatedEmployees);
      } catch (err) {
        setError("Error al eliminar el empleado");
      }
    }
  };

  const handleOpenEmployeeModal = () => {
    setIsEmployeeModalOpen(true);
  };

  const handleCloseEmployeeModal = () => {
    setIsEmployeeModalOpen(false);
  };

  const handleCreateEmployee = async (newEmployee) => {
    try {
      await createEmployee(newEmployee);
      const updatedEmployees = await fetchEmployees();
      setEmployees(updatedEmployees);
    } catch (err) {
      setError("Error al crear el empleado");
    }
  };

  const handleOpenPayrollModal = (employee) => {
    setSelectedEmployee(employee);
    setIsPayrollModalOpen(true);
  };

  const handleClosePayrollModal = () => {
    setIsPayrollModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortDirection("asc");
    }
  };

  const filteredEmployees = employees
    .filter((employee) =>
      Object.values(employee).some((value) =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    )
    .sort((a, b) => {
      const aValue = a[sortBy]?.toString().toLowerCase();
      const bValue = b[sortBy]?.toString().toLowerCase();

      if (!aValue || !bValue) return 0;

      if (sortBy === 'salario') {
        return sortDirection === 'asc'
          ? parseFloat(a[sortBy]) - parseFloat(b[sortBy])
          : parseFloat(b[sortBy]) - parseFloat(a[sortBy]);
      }

      return sortDirection === 'asc'
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 text-purple-600 animate-spin" />
        <p className="ml-2 text-purple-600 font-medium">Cargando empleados...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center h-64 bg-red-50 rounded-lg p-4">
        <AlertCircle className="w-6 h-6 text-red-500" />
        <p className="ml-2 text-red-600 font-medium">{error}</p>
      </div>
    );

  return (
    <div className="container mx-auto p-6 bg-gradient-to-br from-purple-50 to-indigo-50 rounded-xl shadow-xl">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center">
          <FileSpreadsheet className="w-8 h-8 text-purple-700 mr-3" />
          <h2 className="text-2xl font-bold text-purple-800">
            Gestión de Empleados
          </h2>
        </div>
        <button
          onClick={handleOpenEmployeeModal}
          className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg flex items-center transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-1"
        >
          <UserPlus size={20} className="mr-2" />
          Nuevo Empleado
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6 flex flex-col md:flex-row gap-4 justify-between items-center">
        <div className="flex items-center bg-white p-3 rounded-lg shadow-md border border-purple-100 w-full md:max-w-md">
          <Search size={20} className="text-purple-400 mr-2" />
          <input
            type="text"
            placeholder="Buscar empleado..."
            className="w-full outline-none bg-transparent text-purple-900"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center text-sm text-purple-700 font-medium">
          <Filter size={16} className="mr-1" />
          <span className="mr-2">Ordenar por:</span>
          <select
            className="bg-white border border-purple-200 rounded-md px-3 py-1.5 shadow-sm outline-none"
            value={sortBy}
            onChange={(e) => handleSort(e.target.value)}
          >
            <option value="nom_empleado">Nombre</option>
            <option value="tipo_emp">Cargo</option>
            <option value="salario">Salario</option>
            <option value="frecuencia_pago">Fecha de Pago</option>
          </select>
          <button
            onClick={() => setSortDirection(sortDirection === "asc" ? "desc" : "asc")}
            className="ml-2 p-1.5 bg-purple-100 rounded-md hover:bg-purple-200"
          >
            <ChevronDown
              size={16}
              className={`text-purple-700 transition-transform duration-200 ${sortDirection === "desc" ? "rotate-180" : ""
                }`}
            />
          </button>
        </div>
      </div>

      {/* Tabla de empleados */}
      <div className="overflow-hidden bg-white rounded-xl shadow-lg border border-purple-100">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-600 text-white">
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <User size={16} className="mr-2" />
                    Nombre
                  </div>
                </th>
                <th className="py-3 px-4 text-left">Cargo</th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <DollarSign size={16} className="mr-2" />
                    Salario
                  </div>
                </th>
                <th className="py-3 px-4 text-left">Fecha Pago</th>
                <th className="py-3 px-4 text-left">
                  <div className="flex items-center">
                    <Phone size={16} className="mr-2" />
                    Teléfono
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((employee, index) => (
                <tr
                  key={employee.id_empleado}
                  className={`border-b border-purple-100 hover:bg-purple-50 transition-colors ${index % 2 === 0 ? "bg-purple-50/50" : "bg-white"
                    }`}
                >
                  <td className="py-3 px-4 font-medium text-purple-900">{employee.nom_empleado}</td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 bg-purple-100 text-purple-800 rounded-full text-xs font-medium">
                      {employee.tipo_emp}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium">${new Intl.NumberFormat().format(employee.salario)}</td>
                  <td className="py-3 px-4">{employee.frecuencia_pago}</td>
                  <td className="py-3 px-4">{employee.tel_empleado}</td>
                  <td className="py-3 px-4">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleOpenPayrollModal(employee)}
                        className="bg-emerald-500 hover:bg-emerald-600 text-white p-2 rounded-lg transition-colors duration-200"
                        aria-label="Agregar Liquidación o Prima"
                      >
                        <DollarSign size={18} />
                      </button>

                      <button
                        onClick={() => handleDelete(employee.id_empleado)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors duration-200"
                        aria-label="Eliminar Empleado"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredEmployees.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center bg-purple-50/50">
            <AlertCircle size={40} className="text-purple-400 mb-3" />
            <p className="text-purple-800 font-medium mb-1">No se encontraron empleados</p>
            <p className="text-purple-600 text-sm">Intenta con otra búsqueda o agrega un nuevo empleado</p>
          </div>
        )}
      </div>

      {/* Estadísticas básicas */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-600 text-sm font-medium">Total Empleados</p>
              <p className="text-2xl font-bold text-purple-900">{employees.length}</p>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <User size={24} className="text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-600 text-sm font-medium">Salario Promedio</p>
              <p className="text-2xl font-bold text-emerald-700">
                ${employees.length > 0
                  ? new Intl.NumberFormat().format(
                    Math.round(
                      employees.reduce((sum, emp) => sum + parseFloat(emp.salario), 0) / employees.length
                    )
                  )
                  : 0}
              </p>
            </div>
            <div className="bg-emerald-100 p-3 rounded-full">
              <DollarSign size={24} className="text-emerald-600" />
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-indigo-600 text-sm font-medium">Fecha Actual</p>
              <p className="text-2xl font-bold text-indigo-700">{new Date().toLocaleDateString()}</p>
            </div>
            <div className="bg-indigo-100 p-3 rounded-full">
              <FileSpreadsheet size={24} className="text-indigo-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Modales */}
      <EmployeeModal
        isOpen={isEmployeeModalOpen}
        onClose={handleCloseEmployeeModal}
        onCreate={handleCreateEmployee}
      />

      {selectedEmployee && (
        <PayrollModal
          isOpen={isPayrollModalOpen}
          onClose={handleClosePayrollModal}
          employee={selectedEmployee}
        />
      )}
    </div>
  );
};

export default EmployeeTable;