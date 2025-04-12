import React, { useState, useEffect } from "react";
import {
  Download,
  RefreshCw,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  ChevronUp,
  X,
  AlertCircle,
  CheckCircle2,
  ArrowDownUp,
  FileSpreadsheet,
  Wallet,
  Receipt,
} from "lucide-react";

const ReportViewer = () => {
  const [reportType, setReportType] = useState("gastos");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL;
  const [filters, setFilters] = useState({
    dateFrom: "",
    dateTo: "",
    minAmount: "",
    maxAmount: "",
    status: "todos",
  });
  const [sortConfig, setSortConfig] = useState({
    key: "",
    direction: "",
  });

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `${API_URL}/api/reports/${reportType}`
      );
      const result = await response.json();
      console.log(result);
      setData(result);
      

      showNotification("Datos actualizados correctamente");
    } catch (error) {
      showNotification("Error al cargar los datos", true);
    }
    setLoading(false);
  };

  const showNotification = (message, isError = false) => {
    setNotification({ message, isError });
    setTimeout(() => setNotification(null), 3000);
  };

  const generatePDF = async () => {
    try {
      showNotification("Generando PDF...");
      const response = await fetch(
        `${API_URL}/api/reports/${reportType}/pdf`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ data: filteredData }),
        }
      );

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${reportType}-report.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      showNotification("PDF generado exitosamente");
    } catch (error) {
      showNotification("Error al generar el PDF", true);
    }
  };

  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }

    setSortConfig({ key, direction });

    setData((prevData) =>
      [...prevData].sort((a, b) => {
        const getValue = (obj, path) =>
          path.split(".").reduce((o, p) => (o ? o[p] : ""), obj);

        const valueA = getValue(a, key);
        const valueB = getValue(b, key);

        if (valueA < valueB) return direction === "asc" ? -1 : 1;
        if (valueA > valueB) return direction === "asc" ? 1 : -1;
        return 0;
      })
    );
  };

  const resetFilters = () => {
    setFilters({
      dateFrom: "",
      dateTo: "",
      minAmount: "",
      maxAmount: "",
      status: "todos",
    });
  };

  const filteredData = data
  .filter((item) => {
    const searchLower = searchTerm.toLowerCase();

    // Verifica si el término de búsqueda coincide con algún valor del objeto
    const matchesSearch = Object.entries(item).some(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some((nestedValue) =>
          nestedValue?.toString().toLowerCase().includes(searchLower)
        );
      }
      return value?.toString().toLowerCase().includes(searchLower);
    });

    // Búsqueda específica por sucursal
    const matchesSucursal =
      item.cliente?.sucursal_cliente?.[0]?.sucursal?.nom_sucursal
        ?.toLowerCase()
        .includes(searchLower);

    if (!matchesSearch && !matchesSucursal) return false;

    // Filtrado por fecha
    const dateField =
      reportType === "gastos" ? "fecha_compra" : "fecha_creacion_fact";
    const itemDate = new Date(item[dateField]);

    if (filters.dateFrom && new Date(filters.dateFrom) > itemDate) return false;
    if (filters.dateTo && new Date(filters.dateTo) < itemDate) return false;

    // Filtrado por monto
    const amountField = reportType === "gastos" ? "total_gastos" : "valor_fact";
    const amount = parseFloat(item[amountField]);

    if (filters.minAmount && parseFloat(filters.minAmount) > amount) return false;
    if (filters.maxAmount && parseFloat(filters.maxAmount) < amount) return false;

    // Filtrado por estado en facturas
    if (
      reportType === "factura" &&
      filters.status !== "todos" &&
      item.estado !== filters.status
    ) {
      return false;
    }

    return true;
  })
  .sort((a, b) => {
    if (!sortConfig.key) return 0;

    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key.includes(".")) {
      const [parent, child] = sortConfig.key.split(".");
      aValue = a[parent]?.[child] || "";
      bValue = b[parent]?.[child] || "";
    }

    const numericFields = ["total_gastos", "valor_fact"];
    if (numericFields.includes(sortConfig.key)) {
      aValue = parseFloat(aValue) || 0;
      bValue = parseFloat(bValue) || 0;
    }

    const dateFields = [
      "fecha_compra",
      "fecha_creacion_fact",
      "fecha_final_fact",
    ];
    if (dateFields.includes(sortConfig.key)) {
      aValue = aValue ? new Date(aValue).getTime() : 0;
      bValue = bValue ? new Date(bValue).getTime() : 0;
    }

    if (aValue < bValue) {
      return sortConfig.direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === "asc" ? 1 : -1;
    }
    return 0;
  });


  const formatDate = (dateString) => {
    if (!dateString) return "No disponible";
    const date = new Date(dateString);
    return date.toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getReportIcon = () => {
    switch (reportType) {
      case "gastos":
        return <Wallet className="text-purple-600" size={24} />;
      case "factura":
        return <Receipt className="text-purple-600" size={24} />;
      default:
        return <FileSpreadsheet className="text-purple-600" size={24} />;
    }
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <ArrowDownUp size={16} className="opacity-30" />;
    }
    return sortConfig.direction === "asc" ? (
      <ChevronUp size={16} className="text-purple-600" />
    ) : (
      <ChevronDown size={16} className="text-purple-600" />
    );
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6 bg-gray-50 min-h-screen">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-md p-4 md:p-6 mb-6 border border-purple-100">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            {getReportIcon()}
            <h1 className="text-2xl font-bold text-purple-800">
              {reportType === "gastos"
                ? "Reporte de Gastos"
                : "Reporte de Facturas"}
            </h1>
          </div>
          <div className="flex flex-wrap gap-3 items-center">
            <div className="relative">
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all appearance-none"
              >
                <option value="gastos">Gastos</option>
                <option value="factura">Facturas</option>
              </select>
              <ChevronDown
                className="absolute right-3 top-2.5 pointer-events-none text-purple-500"
                size={18}
              />
            </div>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-all"
            >
              <RefreshCw size={18} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Download size={18} />
              Exportar PDF
            </button>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mt-6">
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 pl-10 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
              />
              <Search
                className="absolute left-3 top-2.5 text-purple-400"
                size={18}
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm("")}
                  className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  <X size={18} />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${
                showFilters
                  ? "bg-purple-200 text-purple-800"
                  : "bg-purple-100 text-purple-700 hover:bg-purple-200"
              }`}
            >
              <Filter size={18} />
              Filtros avanzados
              {showFilters ? (
                <ChevronUp size={18} />
              ) : (
                <ChevronDown size={18} />
              )}
            </button>
          </div>

          {/* Advanced Filters Panel */}
          {showFilters && (
            <div className="mt-4 p-4 bg-purple-50 rounded-lg border border-purple-100 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Rango de fechas
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) =>
                          setFilters({ ...filters, dateFrom: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                      <Calendar
                        className="absolute left-2 top-2.5 text-purple-400"
                        size={16}
                      />
                    </div>
                    <span className="text-purple-400">a</span>
                    <div className="relative flex-grow">
                      <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) =>
                          setFilters({ ...filters, dateTo: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                      <Calendar
                        className="absolute left-2 top-2.5 text-purple-400"
                        size={16}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-purple-700 mb-1">
                    Rango de monto
                  </label>
                  <div className="flex items-center gap-2">
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-2.5 text-purple-400">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="Mínimo"
                        value={filters.minAmount}
                        onChange={(e) =>
                          setFilters({ ...filters, minAmount: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                    <span className="text-purple-400">a</span>
                    <div className="relative flex-grow">
                      <span className="absolute left-3 top-2.5 text-purple-400">
                        $
                      </span>
                      <input
                        type="number"
                        placeholder="Máximo"
                        value={filters.maxAmount}
                        onChange={(e) =>
                          setFilters({ ...filters, maxAmount: e.target.value })
                        }
                        className="w-full pl-8 pr-3 py-2 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
                      />
                    </div>
                  </div>
                </div>

                {reportType === "factura" && (
                  <div>
                    <label className="block text-sm font-medium text-purple-700 mb-1">
                      Estado de factura
                    </label>
                    <div className="relative">
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="w-full pl-4 pr-10 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all appearance-none"
                      >
                        <option value="todos">Todos los estados</option>
                        <option value="Pendiente">Pendiente</option>
                        <option value="Entregado">Entregado</option>
                      </select>
                      <ChevronDown
                        className="absolute right-3 top-2.5 pointer-events-none text-purple-500"
                        size={18}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end mt-4">
                <button
                  onClick={resetFilters}
                  className="flex items-center gap-2 px-4 py-2 text-purple-600 hover:text-purple-800 transition-colors"
                >
                  <X size={16} />
                  Limpiar filtros
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-500 font-medium">
                Total de registros
              </p>
              <p className="text-2xl font-bold text-purple-800">
                {filteredData.length}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <FileSpreadsheet className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-purple-500 font-medium">
                {reportType === "gastos" ? "Total gastado" : "Total facturado"}
              </p>
              <p className="text-2xl font-bold text-purple-800">
                $
                {filteredData
                  .reduce((sum, item) => {
                    const amount =
                      reportType === "gastos"
                        ? parseFloat(item.total_gastos || 0)
                        : parseFloat(item.valor_fact || 0);
                    return sum + amount;
                  }, 0)
                  .toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
              </p>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg">
              <Wallet className="text-purple-600" size={24} />
            </div>
          </div>
        </div>

        {reportType === "factura" && (
          <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-500 font-medium">
                  Facturas pendientes
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  {
                    filteredData.filter((item) => item.estado === "Pendiente")
                      .length
                  }
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <AlertCircle className="text-amber-500" size={24} />
              </div>
            </div>
          </div>
        )}

        {reportType === "gastos" && (
          <div className="bg-white rounded-xl p-4 shadow-md border border-purple-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-purple-500 font-medium">
                  Gasto promedio
                </p>
                <p className="text-2xl font-bold text-purple-800">
                  $
                  {filteredData.length
                    ? (
                        filteredData.reduce(
                          (sum, item) =>
                            sum + parseFloat(item.total_gastos || 0),
                          0
                        ) / filteredData.length
                      ).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "0.00"}
                </p>
              </div>
              <div className="p-3 bg-purple-50 rounded-lg">
                <ArrowDownUp className="text-purple-600" size={24} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all transform flex items-center gap-2 ${
            notification.isError
              ? "bg-red-100 text-red-800 border border-red-200"
              : "bg-purple-100 text-purple-800 border border-purple-200"
          }`}
        >
          {notification.isError ? (
            <AlertCircle size={20} className="text-red-600" />
          ) : (
            <CheckCircle2 size={20} className="text-purple-600" />
          )}
          {notification.message}
        </div>
      )}

      {/* Results count */}
      <div className="mb-3 text-sm text-purple-600">
        {filteredData.length === 0
          ? "No se encontraron resultados"
          : `Mostrando ${filteredData.length} ${
              filteredData.length === 1
                ? reportType === "gastos"
                  ? "gasto"
                  : "factura"
                : reportType === "gastos"
                ? "gastos"
                : "facturas"
            }`}
      </div>

      {/* Table */}
<div className="bg-white rounded-xl shadow-md overflow-hidden border border-purple-100">
  <div className="overflow-x-auto">
    <table className="w-full">
      <thead>
        <tr className="bg-purple-50 border-b border-purple-100">
          {reportType === "gastos" && (
            <>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("concepto_gasto")}
                >
                  Concepto {getSortIcon("concepto_gasto")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("fecha_compra")}
                >
                  Fecha Compra {getSortIcon("fecha_compra")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("total_gastos")}
                >
                  Total {getSortIcon("total_gastos")}
                </button>
              </th>
            </>
          )}
          {reportType === "factura" && (
            <>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("cod_factura")}
                >
                  Código {getSortIcon("cod_factura")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() =>
                    handleSort(
                      "cliente.sucursal_cliente.0.sucursal.nom_sucursal"
                    )
                  }
                >
                  Sucursal{" "}
                  {getSortIcon(
                    "cliente.sucursal_cliente.0.sucursal.nom_sucursal"
                  )}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("estado")}
                >
                  Estado {getSortIcon("estado")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("fecha_creacion_fact")}
                >
                  Fecha Creación {getSortIcon("fecha_creacion_fact")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("fecha_final_fact")}
                >
                  Fecha Entrega {getSortIcon("fecha_final_fact")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("valor_fact")}
                >
                  Valor {getSortIcon("valor_fact")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                <button
                  className="flex items-center gap-1"
                  onClick={() => handleSort("cliente.nombre_cliente")}
                >
                  Cliente {getSortIcon("cliente.nombre_cliente")}
                </button>
              </th>
              <th className="p-4 text-left text-purple-800 font-semibold">
                Teléfono
              </th>
            </>
          )}
        </tr>
      </thead>
      <tbody>
        {loading ? (
          <tr>
            <td
              colSpan={reportType === "gastos" ? 3 : 7}
              className="text-center p-8"
            >
              <div className="flex justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            </td>
          </tr>
        ) : !filteredData || filteredData.length === 0 ? (
          <tr>
            <td
              colSpan={reportType === "gastos" ? 3 : 7}
              className="text-center p-8 text-gray-500"
            >
              No se encontraron resultados
            </td>
          </tr>
        ) : (
          filteredData.map((item, index) => (
            <tr
              key={item?.id || index}
              className="border-t border-purple-100 hover:bg-purple-50 transition-colors"
            >
              {reportType === "gastos" && (
                <>
                  <td className="p-4 font-medium">
                    {item?.concepto_gasto || "Sin concepto"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item?.fecha_compra ? formatDate(item.fecha_compra) : "No disponible"}
                  </td>
                  <td className="p-4 font-medium">
                    $
                    {Number(item?.total_gastos || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </>
              )}
              {reportType === "factura" && (
                <>
                  <td className="p-4 font-medium">{item?.cod_factura || "Sin código"}</td>
                  <td className="p-4 font-medium">
                    {
                      item?.cliente?.sucursal_cliente?.[0]?.sucursal?.nom_sucursal ||
                      "Sin sucursal"
                    }
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item?.estado === "Entregado"
                          ? "bg-green-100 text-green-800"
                          : item?.estado === "anulado"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {item?.estado || "Sin estado"}
                    </span>
                  </td>
                  <td className="p-4 text-gray-600">
                    {item?.fecha_creacion_fact ? formatDate(item.fecha_creacion_fact) : "No disponible"}
                  </td>
                  <td className="p-4 text-gray-600">
                    {item?.fecha_final_fact ? formatDate(item.fecha_final_fact) : "No entregado"}
                  </td>
                  <td className="p-4 font-medium">
                    $
                    {Number(item?.valor_fact || 0).toLocaleString(undefined, {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="p-4">{item?.cliente?.nombre_cliente || "Sin nombre"}</td>
                  <td className="p-4 text-gray-600">
                    {item?.cliente?.tel_cliente || "Sin teléfono"}
                  </td>
                </>
              )}
            </tr>
          ))
        )}
      </tbody>
    </table>
  </div>
</div>
    </div>
  );
};

export default ReportViewer;
