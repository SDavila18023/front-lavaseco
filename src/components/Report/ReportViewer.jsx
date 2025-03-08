import React, { useState, useEffect } from "react";
import { Download, RefreshCw, Search } from "lucide-react";

const ReportViewer = () => {
  const [reportType, setReportType] = useState("gastos");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    fetchData();
  }, [reportType]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await fetch(
        `http://localhost:5000/api/reports/${reportType}`
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
        `http://localhost:5000/api/reports/${reportType}/pdf`,
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

  const filteredData = data.filter((item) => {
    const searchLower = searchTerm.toLowerCase();
    return Object.entries(item).some(([key, value]) => {
      if (typeof value === "object" && value !== null) {
        return Object.values(value).some((nestedValue) =>
          nestedValue?.toString().toLowerCase().includes(searchLower)
        );
      }
      return value?.toString().toLowerCase().includes(searchLower);
    });
  });

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header Card */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-2xl font-semibold text-purple-800">
            Reporte de Gastos y Facturas
          </h1>
          <div className="flex flex-wrap gap-4 items-center">
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="px-4 py-2 rounded-lg border border-purple-200 bg-white text-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-300 transition-all"
            >
              <option value="gastos">Gastos</option>
              <option value="factura">Facturas</option>
            </select>
            <button
              onClick={fetchData}
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-800 rounded-lg hover:bg-purple-200 transition-all"
            >
              <RefreshCw size={20} className={loading ? "animate-spin" : ""} />
              Actualizar
            </button>
            <button
              onClick={generatePDF}
              className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all"
            >
              <Download size={20} />
              Descargar PDF
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 relative">
          <input
            type="text"
            placeholder="Buscar..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 pl-10 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-300"
          />
          <Search
            className="absolute left-3 top-2.5 text-purple-400"
            size={20}
          />
        </div>
      </div>

      {/* Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg transition-all transform ${
            notification.isError
              ? "bg-red-100 text-red-800"
              : "bg-purple-100 text-purple-800"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-purple-50">
                {reportType === "informe" && (
                  <>
                    <th className="p-4 text-left text-purple-800">
                      ID Informe
                    </th>
                    <th className="p-4 text-left text-purple-800">
                      Fecha Generado
                    </th>
                    <th className="p-4 text-left text-purple-800">
                      ID Factura
                    </th>
                    <th className="p-4 text-left text-purple-800">ID Gastos</th>
                  </>
                )}
                {reportType === "gastos" && (
                  <>
                    <th className="p-4 text-left text-purple-800">Concepto</th>
                    <th className="p-4 text-left text-purple-800">
                      Fecha Compra
                    </th>
                    <th className="p-4 text-left text-purple-800">Total</th>
                  </>
                )}
                {reportType === "factura" && (
                  <>
                    <th className="p-4 text-left text-purple-800">Código</th>
                    <th className="p-4 text-left text-purple-800">Estado</th>
                    <th className="p-4 text-left text-purple-800">
                      Fecha Creación
                    </th>
                    <th className="p-4 text-left text-purple-800">
                      Fecha Entrega
                    </th>
                    <th className="p-4 text-left text-purple-800">Valor</th>
                    <th className="p-4 text-left text-purple-800">Cliente</th>
                    <th className="p-4 text-left text-purple-800">Telefono</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center p-8">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center p-8 text-gray-500">
                    No se encontraron resultados
                  </td>
                </tr>
              ) : (
                filteredData.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-purple-100 hover:bg-purple-50 transition-colors"
                  >
                    {reportType === "informe" && (
                      <>
                        <td className="p-4">{item.id_informe}</td>
                        <td className="p-4">{item.fecha_generado}</td>
                        <td className="p-4">{item.id_factura}</td>
                        <td className="p-4">{item.id_gastos}</td>
                      </>
                    )}
                    {reportType === "gastos" && (
                      <>
                        <td className="p-4">{item.concepto_gasto}</td>
                        <td className="p-4">{item.fecha_compra}</td>
                        <td className="p-4">${item.total_gastos}</td>
                      </>
                    )}
                    {reportType === "factura" && (
                      <>
                        <td className="p-4">{item.cod_factura}</td>
                        <td className="p-4">{item.estado}</td>
                        <td className="p-4">{item.fecha_creacion_fact}</td>
                        <td className="p-4">
                          {item.fecha_final_fact || "No entregado"}
                        </td>

                        <td className="p-4">${item.valor_fact}</td>
                        <td className="p-4">
                          {item.cliente?.nombre_cliente || "Sin nombre"}
                        </td>
                        <td className="p-4">
                          {item.cliente?.tel_cliente || "Sin teléfono"}
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
