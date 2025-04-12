import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  CreditCard,
  PackageOpen,
  Users,
  DollarSign,
  ChevronRight,
  ArrowLeft,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle
} from "lucide-react";

const MainCost = () => {
  const [expenses, setExpenses] = useState([]);
  const [totalExpenses, setTotalExpenses] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${API_URL}/api/cost/`);

      const expensesData = response.data;
      if (!expensesData || expensesData.length === 0) {
        throw new Error("No expenses found");
      }

      const today = new Date();
      const currentMonth = today.getMonth() + 1;
      const currentYear = today.getFullYear();

      const monthlyExpenses = expensesData
        .map((expense) => {
          const [year, month, day] = expense.fecha_compra.split("-").map(Number);
          return {
            id: expense.id_gastos,
            concept: expense.concepto_gasto,
            amount: expense.total_gastos,
            date: new Date(year, month - 1, day),
          };
        })
        .filter((expense) => {
          return (
            expense.date.getFullYear() === currentYear &&
            expense.date.getMonth() + 1 === currentMonth
          );
        });

      setExpenses(
        monthlyExpenses.map((expense) => ({
          ...expense,
          date: expense.date.toLocaleDateString("es-ES"),
        }))
      );

      setTotalExpenses(
        monthlyExpenses.reduce((sum, exp) => sum + exp.amount, 0)
      );
    } catch (err) {
      setError("Error al cargar los gastos. Intente nuevamente.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentMonthName = () => {
    const months = [
      "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
      "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
    ];
    const today = new Date();
    return months[today.getMonth()];
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-purple-50 p-8 rounded-lg w-full max-w-4xl mx-auto text-center shadow-lg">
          <Loader2 className="animate-spin text-purple-600 mx-auto mb-4" size={48} />
          <div className="text-purple-700 text-lg font-medium">Cargando información de gastos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="bg-purple-50 text-purple-900 p-6 md:p-8 rounded-xl w-full max-w-5xl mx-auto shadow-lg">
        {/* Botón para volver */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-purple-600 hover:text-purple-800 transition-colors mb-6 bg-white py-2 px-4 rounded-lg shadow-sm"
        >
          <ArrowLeft size={20} />
          <span className="font-medium">Volver</span>
        </button>

        {/* Encabezado con mes actual */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 pb-4 border-b border-purple-200">
          <h1 className="text-3xl font-bold mb-2 md:mb-0 flex items-center gap-2">
            <Calendar className="text-purple-600" size={28} />
            Control de Gastos: {getCurrentMonthName()}
          </h1>
          <div className="flex items-center gap-1 text-purple-500 bg-white px-3 py-2 rounded-lg shadow-sm">
            <TrendingUp size={20} />
            <span className="font-medium">{new Date().getFullYear()}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* Total Expenses Summary */}
            <div>
              <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="text-purple-600" size={24} />
                Total Gastos Mensuales
              </h2>
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg p-6 flex items-center justify-between shadow-md text-white">
                {totalExpenses > 0 ? (
                  <span className="text-3xl font-bold">
                    ${totalExpenses.toLocaleString("es-ES", {
                      minimumFractionDigits: 2,
                    })}
                  </span>
                ) : (
                  <span className="text-xl opacity-80">
                    $0.00
                  </span>
                )}
                <DollarSign className="opacity-80" size={36} />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold mb-4">Gestión de Gastos</h2>
              <div className="bg-white p-4 rounded-lg shadow-md">
                <Link to="/costs/specific">
                  <button className="w-full flex items-center justify-between bg-white p-4 rounded-lg hover:bg-purple-100 transition mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <CreditCard className="text-purple-600" size={24} />
                      </div>
                      <span className="text-lg font-medium">Gastos específicos</span>
                    </div>
                    <ChevronRight size={24} className="text-purple-400" />
                  </button>
                </Link>

                <Link to="/costs/supply">
                  <button className="w-full flex items-center justify-between bg-white p-4 rounded-lg hover:bg-purple-100 transition mb-3">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <PackageOpen className="text-purple-600" size={24} />
                      </div>
                      <span className="text-lg font-medium">Insumos</span>
                    </div>
                    <ChevronRight size={24} className="text-purple-400" />
                  </button>
                </Link>

                <Link to="/costs/employability">
                  <button className="w-full flex items-center justify-between bg-white p-4 rounded-lg hover:bg-purple-100 transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-100 p-2 rounded-full">
                        <Users className="text-purple-600" size={24} />
                      </div>
                      <span className="text-lg font-medium">Gastos de Empleabilidad</span>
                    </div>
                    <ChevronRight size={24} className="text-purple-400" />
                  </button>
                </Link>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div>
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <DollarSign className="text-purple-600" size={24} />
              Detalle de Gastos
            </h2>
            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg mb-4 flex items-center gap-3">
                <AlertCircle size={24} className="text-red-500 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md p-4">
              {expenses.length > 0 ? (
                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-300 scrollbar-track-purple-100">
                  {expenses.map((expense) => (
                    <div
                      key={expense.id}
                      className="p-4 rounded-lg border border-purple-100 hover:border-purple-300 transition-colors"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium text-lg text-purple-900">
                          {expense.concept}
                        </span>
                        <span className="bg-purple-100 text-purple-700 text-lg font-semibold px-3 py-1 rounded-lg">
                          ${expense.amount.toLocaleString("es-ES", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      </div>
                      <div className="text-sm text-purple-500 flex items-center gap-1">
                        <Calendar size={14} />
                        {expense.date}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-16 text-center">
                  <DollarSign className="mx-auto text-purple-200 mb-4" size={48} />
                  <p className="text-purple-400 text-lg font-medium mb-2">No hay gastos registrados este mes</p>
                  <p className="text-purple-300 text-sm max-w-sm mx-auto">
                    Cuando registres nuevos gastos en el sistema, aparecerán listados en esta sección
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainCost;