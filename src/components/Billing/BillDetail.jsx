import React from "react";

const BillDetail = ({ factura, onClose }) => {
  if (!factura) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-lg animate-fadeIn">
        {/* Título y Botón de Cierre */}
        <div className="flex justify-between items-center border-b pb-3">
          <h3 className="text-xl font-semibold text-gray-800">
            Detalles de Factura {factura.cod_factura}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 transition"
          >
            ✖
          </button>
        </div>

        {/* Contenido del Modal */}
        <div className="mt-4">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-purple-50 text-purple-700">
                <th className="p-2 border">Especificación</th>
                <th className="p-2 border">Cantidad</th>
                <th className="p-2 border">Valor Unitario</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(factura.factura_detalle) ? (
                factura.factura_detalle.map((detalle) => (
                  <tr
                    key={detalle.id_factura_detalle}
                    className="text-gray-700"
                  >
                    <td className="p-2 border">
                      {detalle.especificacion_prenda}
                    </td>
                    <td className="p-2 border text-center">
                      {detalle.cantidad_prendas}
                    </td>
                    <td className="p-2 border text-center">
                      ${detalle.valor_uni_prenda}
                    </td>
                  </tr>
                ))
              ) : (
                <tr
                  key={factura.factura_detalle.id_factura_detalle}
                  className="text-gray-700"
                >
                  <td className="p-2 border">
                    {factura.factura_detalle.especificacion_prenda}
                  </td>
                  <td className="p-2 border text-center">
                    {factura.factura_detalle.cantidad_prendas}
                  </td>
                  <td className="p-2 border text-center">
                    ${factura.factura_detalle.valor_uni_prenda}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Botón de Cierre */}
        <div className="mt-4 text-right">
          <button
            onClick={onClose}
            className="bg-purple-700 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default BillDetail;
