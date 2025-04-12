import React, { useEffect, useState } from "react";
import axios from "axios";
import BillDetail from "./BillDetail";
import { Search, Trash2, Eye, RefreshCw, Edit } from "lucide-react";
import EditBillModal from "./EditBillModal"; // Vamos a crear este componente

const BillingTable = () => {
  const [facturas, setFacturas] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFactura, setSelectedFactura] = useState(null);
  const [editingFactura, setEditingFactura] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchFacturas();
  }, []);

  const fetchFacturas = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/bill/`);
      setFacturas(response.data);
      console.log(response.data);

      setLoading(false);
    } catch (err) {
      setError("Error al cargar las facturas.");
      setLoading(false);
    }
  };

  const handleDelete = async (idFactura) => {
    if (!window.confirm("¿Seguro que deseas eliminar esta factura?")) return;

    try {
      await axios.delete(`${API_URL}/api/bill/${idFactura}`);
      setFacturas(
        facturas.filter((factura) => factura.id_factura !== idFactura)
      );
    } catch (err) {
      alert("Error al eliminar la factura.");
    }
  };

  const handleChangeStatus = async (idFactura) => {
    if (!window.confirm("¿Seguro que deseas cambiar el estado de esta factura?")) return;
    try {
      await axios.put(`${API_URL}/api/bill/${idFactura}/status`);
      fetchFacturas();
    } catch (err) {
      alert("Error al cambiar el estado de la factura.");
    }
  };

  const handleEditFactura = (factura) => {
    setEditingFactura(factura);
    setIsEditModalOpen(true);
  };

  const handleUpdateFactura = async (updatedFactura) => {
    try {
      await axios.put(
        `${API_URL}/api/bill/${updatedFactura.id_factura}`,
        updatedFactura
      );
      fetchFacturas();
      setIsEditModalOpen(false);
      setEditingFactura(null);
    } catch (err) {
      alert("Error al actualizar la factura.");
      console.error(err);
    }
  };

  const filteredFacturas = facturas.filter((factura) => {
    const search = searchTerm.trim().toLowerCase();

    const valuesToSearch = [
      ...Object.values(factura).map((val) => String(val || "").toLowerCase()),
      factura.cliente?.nombre_cliente?.toLowerCase() || "",
      factura.cliente?.tel_cliente?.toLowerCase() || "",
      factura.cliente?.sucursal_cliente?.[0]?.sucursal?.nom_sucursal?.toLowerCase() || ""
    ];

    return valuesToSearch.some((value) => value.includes(search));
  });


  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="text-red-500 p-4 text-center bg-red-50 rounded-lg">
        {error}
      </div>
    );

  return (
    <div className="w-full bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-purple-700 mb-4">
          Lista de Facturas
        </h2>
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar factura..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 pl-10 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
          <Search className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="w-full">
          <thead>
            <tr className="bg-purple-50">
              <th className="p-3 text-left text-purple-700 font-semibold">
                Código
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Sucursal
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Fecha Creación
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Fecha Final
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Valor Total
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Nombre Cliente
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Teléfono Cliente
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Estado
              </th>
              <th className="p-3 text-left text-purple-700 font-semibold">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredFacturas.map((factura) => (
              <tr
                key={factura.id_factura}
                className="border-b hover:bg-purple-50 transition-colors"
              >
                <td className="p-3">{factura.cod_factura}</td>
                <td className="p-3">
                  {factura.cliente?.sucursal_cliente?.length > 0
                    ? factura.cliente.sucursal_cliente[0].sucursal.nom_sucursal
                    : "Sin sucursal"}
                </td>
                <td className="p-3">{factura.fecha_creacion_fact}</td>
                <td className="p-3">{factura.fecha_final_fact}</td>
                <td className="p-3 font-medium">
                  ${Number(factura.valor_fact).toLocaleString()}
                </td>
                <td className="p-3">
                  {factura.cliente?.nombre_cliente || "N/A"}
                </td>
                <td className="p-3">{factura.cliente?.tel_cliente || "N/A"}</td>
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${factura.estado?.toLowerCase() === "pendiente"
                        ? "bg-yellow-500 text-white"
                        : factura.estado?.toLowerCase() === "entregado"
                          ? "bg-green-500 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                  >
                    {factura.estado?.toLowerCase() === "pendiente"
                      ? "Pendiente"
                      : factura.estado?.toLowerCase() === "entregado"
                        ? "Entregado"
                        : "Desconocido"}
                  </span>
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSelectedFactura(factura)}
                      className="p-2 text-purple-600 hover:bg-purple-100 rounded-lg transition-colors"
                      title="Ver detalles"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleEditFactura(factura)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"
                      title="Editar factura"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleChangeStatus(factura.id_factura)}
                      className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition-colors"
                      title="Cambiar estado"
                    >
                      <RefreshCw className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(factura.id_factura)}
                      className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"
                      title="Eliminar factura"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredFacturas.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No se encontraron facturas
          </div>
        )}
      </div>

      {selectedFactura && (
        <BillDetail
          factura={selectedFactura}
          onClose={() => setSelectedFactura(null)}
        />
      )}

      {isEditModalOpen && (
        <EditBillModal
          factura={editingFactura}
          onClose={() => {
            setIsEditModalOpen(false);
            setEditingFactura(null);
          }}
          onUpdate={handleUpdateFactura}
        />
      )}
    </div>
  );
};

export default BillingTable;