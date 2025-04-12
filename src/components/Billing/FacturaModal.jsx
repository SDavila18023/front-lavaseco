import { useState, useEffect } from "react";
import axios from "axios";
import {
  Trash2,
  Plus,
  X,
  Save,
  Calendar,
  User,
  Phone,
  Store,
  DollarSign,
  ShoppingBag,
  Tag,
  Hash,
} from "lucide-react";

const sucursales = [
  { nombre: "Sucursal Cedritos", direccion: "Carrera 11#146-08" },
  { nombre: "Sucursal Almacen", direccion: "Calle 161#16C-27" },
  { nombre: "Sucursal Domicilio", direccion: "Domicilio" },
];

const FacturaModal = ({ isOpen, onClose, onSubmit }) => {
  const [factura, setFactura] = useState({
    cod_factura: "",
    fecha_creacion: new Date().toISOString().split("T")[0],
    valor_total: 0,
    nombre_cliente: "",
    telefono_cliente: "",
    sucursal: "",
    detalles: [],
  });

  const [detalle, setDetalle] = useState({
    descripcion: "",
    cantidad: "",
    precio: "",
    caract_otras: "",
  });

  const handleChange = (e) => {
    setFactura({ ...factura, [e.target.name]: e.target.value });
  };

  const handleDetalleChange = (e) => {
    setDetalle({ ...detalle, [e.target.name]: e.target.value });
  };

  const agregarDetalle = () => {
    if (!detalle.descripcion || !detalle.cantidad || !detalle.precio) return;

    const nuevoDetalle = {
      cantidad_prendas: parseInt(detalle.cantidad),
      especificacion_prenda: detalle.descripcion,
      caract_otras: detalle.caract_otras,
      valor_uni_prenda: parseFloat(detalle.precio),
    };

    setFactura((prev) => ({
      ...prev,
      detalles: [...prev.detalles, nuevoDetalle],
    }));

    setDetalle({ descripcion: "", cantidad: "", precio: "", caract_otras: "" });
  };

  const eliminarDetalle = (index) => {
    setFactura((prev) => ({
      ...prev,
      detalles: prev.detalles.filter((_, i) => i !== index),
    }));
  };

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const total = factura.detalles.reduce(
      (sum, d) => sum + d.cantidad_prendas * d.valor_uni_prenda,
      0
    );
    setFactura((prev) => ({ ...prev, valor_total: total }));
  }, [factura.detalles]);

  const handleSubmit = async () => {
    const sucursalSeleccionada = sucursales.find(
      (s) => s.nombre === factura.sucursal
    );

    const facturaFormateada = {
      cod_factura: factura.cod_factura,
      fecha_creacion_fact: factura.fecha_creacion,
      valor_fact: factura.valor_total,
      cliente: {
        nombre_cliente: factura.nombre_cliente,
        tel_cliente: factura.telefono_cliente,
      },
      sucursal: sucursalSeleccionada
        ? {
            nom_sucursal: sucursalSeleccionada.nombre,
            direccion_suc: sucursalSeleccionada.direccion,
          }
        : {},
      factura_detalle: factura.detalles,
    };

    try {
      await axios.post(`${API_URL}/api/bill/`, facturaFormateada);
      onSubmit(facturaFormateada);
      onClose();
    } catch (error) {
      console.error("Error al enviar la factura", error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative overflow-y-auto max-h-screen">
        <div className="flex justify-between items-center border-b pb-3 mb-4">
          <h2 className="text-xl font-bold text-purple-700 flex items-center">
            <ShoppingBag className="mr-2" size={24} />
            Nueva Factura
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <Hash size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Código de Factura
              </label>
              <input
                type="number"
                min="0"
                name="cod_factura"
                value={factura.cod_factura}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Ingrese código"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <Calendar size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Fecha Creación
              </label>
              <input
                type="date"
                name="fecha_creacion"
                value={factura.fecha_creacion}
                onChange={handleChange}
                className="w-full p-2 border border-gray-200 rounded bg-white text-gray-700"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <User size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Nombre Cliente
              </label>
              <input
                type="text"
                name="nombre_cliente"
                value={factura.nombre_cliente}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Nombre completo"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <Phone size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Teléfono Cliente
              </label>
              <input
                type="text"
                name="telefono_cliente"
                value={factura.telefono_cliente}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
                placeholder="Número de contacto"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <Store size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Sucursal
              </label>
              <select
                name="sucursal"
                value={factura.sucursal}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-purple-500 focus:border-transparent transition appearance-none bg-white"
              >
                <option value="">Seleccione una sucursal</option>
                {sucursales.map((sucursal) => (
                  <option key={sucursal.nombre} value={sucursal.nombre}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-semibold text-purple-700 flex items-center mb-3">
            <Tag className="mr-2" size={20} />
            Detalles de Factura
          </h3>

          <div className="grid grid-cols-4 gap-2 mb-2">
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                name="descripcion"
                value={detalle.descripcion}
                onChange={handleDetalleChange}
                placeholder="Descripción"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="col-span-2 sm:col-span-1">
              <input
                type="text"
                name="caract_otras"
                value={detalle.caract_otras}
                onChange={handleDetalleChange}
                placeholder="Características"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                name="cantidad"
                value={detalle.cantidad}
                onChange={handleDetalleChange}
                placeholder="Cantidad"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
            <div className="col-span-1">
              <input
                type="number"
                name="precio"
                value={detalle.precio}
                onChange={handleDetalleChange}
                placeholder="Precio"
                className="w-full p-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            onClick={agregarDetalle}
            className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded transition-colors w-full flex items-center justify-center gap-2"
          >
            <Plus size={16} />
            Agregar Detalle
          </button>

          <div className="mt-4 bg-gray-50 rounded-lg p-3">
            <h4 className="text-sm font-medium text-gray-500 mb-2">
              Detalle de artículos
            </h4>
            {factura.detalles.length === 0 ? (
              <p className="text-sm text-gray-400 text-center py-4">
                No hay artículos agregados
              </p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {factura.detalles.map((d, index) => (
                  <li
                    key={index}
                    className="py-2 flex justify-between items-center text-sm"
                  >
                    <div className="flex-grow">
                      <span className="font-medium">
                        {d.especificacion_prenda}
                      </span>
                      <span className="text-gray-500 ml-1">
                        ({d.caract_otras})
                      </span>
                      <div className="text-gray-600">
                        {d.cantidad_prendas} x ${d.valor_uni_prenda.toFixed(2)}
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-purple-700">
                        ${(d.cantidad_prendas * d.valor_uni_prenda).toFixed(2)}
                      </span>
                      <button
                        onClick={() => eliminarDetalle(index)}
                        className="text-red-500 hover:text-red-700 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <div className="bg-purple-100 p-2 rounded">
              <DollarSign size={18} className="text-purple-600" />
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-medium text-gray-700">
                Valor Total
              </label>
              <input
                type="text"
                value={`$${factura.valor_total.toFixed(2)}`}
                readOnly
                className="w-full p-2 border border-gray-200 rounded bg-gray-100 text-purple-700 font-bold"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6 pt-4 border-t">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded transition-colors flex items-center gap-2"
          >
            <X size={16} />
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded ml-3 transition-colors flex items-center gap-2"
          >
            <Save size={16} />
            Guardar Factura
          </button>
        </div>
      </div>
    </div>
  );
};

export default FacturaModal;
