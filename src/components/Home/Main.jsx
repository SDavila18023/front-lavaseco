import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer, PieChart as RechartPieChart, Pie, Cell } from "recharts";
import { DollarSign, TrendingDown, FileText, LogOut, PieChart, Calendar, Filter } from "lucide-react";
import Header from "../Header/Header";

const Main = () => {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [financialData, setFinancialData] = useState({
    rawIncome: [],
    rawExpenses: [],
    incomeByDate: [],
    expensesByCategory: []
  });
  const [isLoading, setIsLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState("all");
  const [dateRange, setDateRange] = useState({
    startDate: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    endDate: new Date()
  });

  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#a4de6c', '#d0ed57', '#83a6ed', '#6b46c1'];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(`${API_URL}/api/dashboard-data`);
      const { ingresos, gastos } = response.data;

      const validIncome = ingresos.filter(item => item.fecha !== "Desconocido");

      setFinancialData({
        rawIncome: validIncome,
        rawExpenses: gastos,
        incomeByDate: [],
        expensesByCategory: []
      });

      processData("all", dateRange.startDate, dateRange.endDate, validIncome, gastos);

    } catch (error) {
      console.error("Error al obtener los datos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyTimeFilter = (filter) => {
    setTimeFilter(filter);

    let startDate = dateRange.startDate;
    let endDate = dateRange.endDate;

    const now = new Date();
    switch (filter) {
      case "week":
        startDate = new Date(now.setDate(now.getDate() - 7));
        endDate = new Date();
        break;
      case "month":
        startDate = new Date(now.setMonth(now.getMonth() - 1));
        endDate = new Date();
        break;
      case "year":
        startDate = new Date(now.setFullYear(now.getFullYear() - 1));
        endDate = new Date();
        break;
      default:
        break;
    }

    setDateRange({ startDate, endDate });
    processData(filter, startDate, endDate, financialData.rawIncome, financialData.rawExpenses);
  };

  const processData = (filter, startDate, endDate, rawIncome, rawExpenses) => {
    let filteredIncome = [...rawIncome];
    let filteredExpenses = [...rawExpenses];

    if (filter !== "all") {
      filteredIncome = filteredIncome.filter(item => {
        const itemDate = new Date(item.fecha);
        return itemDate >= startDate && itemDate <= endDate;
      });

      filteredExpenses = filteredExpenses.filter(item => {
        const itemDate = new Date(item.fecha);
        return itemDate >= startDate && itemDate <= endDate;
      });
    }

    const processedIncome = filteredIncome
      .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
      .map(item => ({
        name: formatDate(item.fecha),
        ingresos: item.ingresos,
        codigo: item.codigo
      }));

    const processedExpenses = filteredExpenses.map(item => ({
      name: item.concepto,
      costos: item.costos,
      fecha: formatDate(item.fecha)
    }));

    setFinancialData(prev => ({
      ...prev,
      incomeByDate: processedIncome,
      expensesByCategory: processedExpenses
    }));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short' });
  };

  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  const dashboardOptions = [
    {
      title: "Facturación e Inventario",
      description: "Gestiona facturas y pagos",
      icon: <DollarSign className="w-6 h-6" />,
      path: "/billing"
    },
    {
      title: "Costos",
      description: "Análisis de gastos e ingresos",
      icon: <TrendingDown className="w-6 h-6" />,
      path: "/costs"
    },
    {
      title: "Informes",
      description: "Reportes y estadísticas",
      icon: <FileText className="w-6 h-6" />,
      path: "/reports"
    }
  ];

  const totalIncome = financialData.incomeByDate.reduce((sum, item) => sum + item.ingresos, 0);
  const totalExpenses = financialData.expensesByCategory.reduce((sum, item) => sum + item.costos, 0);
  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white">
      {/* Header */}
      <Header onLogout={handleLogout} />

      {/* Contenido principal */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold text-purple-800 mb-6">
          Bienvenido al Sistema de Lavaseco Primavera
        </h2>

        {/* Grid de opciones */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
          {dashboardOptions.map((option, index) => (
            <a key={index} href={option.path} className="group">
              <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg border border-purple-100">
                <div className="p-4 flex items-center">
                  <div className="bg-purple-100 rounded-full p-3 mr-4 group-hover:bg-purple-200 transition-colors">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-purple-800">{option.title}</h3>
                    <p className="text-purple-600 text-sm">{option.description}</p>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Tarjetas de resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Ingresos Totales</h3>
              <DollarSign className="w-6 h-6" />
            </div>
            {isLoading ? (
              <div className="animate-pulse bg-purple-400 h-8 w-32 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">${totalIncome.toLocaleString()}</p>
            )}
          </div>

          <div className="bg-gradient-to-r  from-purple-700 to-purple-800 rounded-lg shadow-md p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Gastos Totales</h3>
              <TrendingDown className="w-6 h-6" />
            </div>
            {isLoading ? (
              <div className="animate-pulse bg-red-400 h-8 w-32 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">${totalExpenses.toLocaleString()}</p>
            )}
          </div>

          <div className={`bg-gradient-to-r ${balance >= 0 ? 'from-green-500 to-green-600' : ' from-purple-500 to-purple-600'} rounded-lg shadow-md p-6 text-white`}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Balance</h3>
              <Calendar className="w-6 h-6" />
            </div>
            {isLoading ? (
              <div className="animate-pulse bg-opacity-50 bg-white h-8 w-32 rounded"></div>
            ) : (
              <p className="text-2xl font-bold">${balance.toLocaleString()}</p>
            )}
          </div>
        </div>

        {/* Filtros de tiempo */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8">
          <div className="flex items-center mb-4">
            <Filter className="text-purple-700 w-5 h-5 mr-2" />
            <h3 className="text-lg font-medium text-purple-800">Filtros</h3>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => applyTimeFilter("all")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timeFilter === "all" ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Todo
            </button>
            <button
              onClick={() => applyTimeFilter("week")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timeFilter === "week" ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Última semana
            </button>
            <button
              onClick={() => applyTimeFilter("month")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timeFilter === "month" ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Último mes
            </button>
            <button
              onClick={() => applyTimeFilter("year")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${timeFilter === "year" ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800 hover:bg-purple-200'}`}
            >
              Último año
            </button>
          </div>
        </div>

        {/* Sección del Dashboard Financiero */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gráfico de Ingresos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <DollarSign className="text-purple-700 w-5 h-5 mr-2" />
              <h3 className="text-lg font-medium text-purple-800">Ingresos por Fecha</h3>
            </div>

            {isLoading ? (
              <div className="animate-pulse bg-purple-100 h-64 w-full rounded"></div>
            ) : financialData.incomeByDate.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={financialData.incomeByDate} margin={{ top: 10, right: 10, left: 10, bottom: 20 }}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    name="Ingresos"
                    stroke="#6B46C1"
                    strokeWidth={2}
                    dot={{ fill: '#6B46C1', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <Calendar className="w-12 h-12 mb-4 text-gray-300" />
                <p>No hay datos de ingresos disponibles para el período seleccionado.</p>
              </div>
            )}
          </div>

          {/* Gráfico de Gastos */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <TrendingDown className="text-red-500 w-5 h-5 mr-2" />
              <h3 className="text-lg font-medium text-purple-800">Distribución de Gastos</h3>
            </div>

            {isLoading ? (
              <div className="animate-pulse bg-purple-100 h-64 w-full rounded"></div>
            ) : financialData.expensesByCategory.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <RechartPieChart>
                  <Pie
                    data={financialData.expensesByCategory}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="costos"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {financialData.expensesByCategory.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  <Legend />
                </RechartPieChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                <PieChart className="w-12 h-12 mb-4 text-gray-300" />
                <p>No hay datos de gastos disponibles para el período seleccionado.</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Main;