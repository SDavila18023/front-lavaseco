import FacturaModal from "./FacturaModal";
import { useState } from "react";

const CreateBill = () => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleCreateFactura = (factura) => {
    console.log("Factura creada:", factura);
  };

  return (
    <div className="p-6">
      <button onClick={() => setModalOpen(true)} className="bg-purple-600 text-white px-4 py-2 rounded">
        Crear Factura
      </button>

      <FacturaModal isOpen={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleCreateFactura} />
    </div>
  );
};

export default CreateBill;
