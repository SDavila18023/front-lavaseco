import React, { useState, useEffect } from "react";
import SupplyTable from "./SupplyTable";
import SupplyModal from "./SupplyModal";
import SearchBar from "../SpecificCost/SearchBar";
import { Plus } from "lucide-react";
import {
  fetchSupplies,
  deleteSupply,
  createSupply,
  updateSupply,
} from "../../../services/SupplyService";

const Supplies = () => {
  const [supplies, setSupplies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentSupply, setCurrentSupply] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadSupplies();
  }, []);

  const loadSupplies = async () => {
    try {
      setLoading(true);
      const data = await fetchSupplies();
      console.log(data);

      setSupplies(data);
    } catch (err) {
      setError("Error loading supplies");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this supply?")) {
      try {
        await deleteSupply(id);
        setSupplies(supplies.filter((supply) => supply.id_insumo !== id));
      } catch (err) {
        setError("Error deleting supply");
      }
    }
  };

  const handleSave = async (formData) => {
    try {
      if (currentSupply) {
        await updateSupply(currentSupply.id_insumo, formData);
      } else {
        await createSupply(formData);
      }
      await loadSupplies();
      setIsModalOpen(false);
      setCurrentSupply(null);
    } catch (err) {
      setError("Error saving supply");
    }
  };

  const handleEdit = (supply) => {
    console.log("Editando insumo:", supply);
    setCurrentSupply(supply);
    setIsModalOpen(true);
  };


  const filteredSupplies = supplies.filter((supply) =>
    supply.nom_insumo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Insumos</h1>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700"
          >
            <Plus size={20} />
            Agregar Insumo
          </button>
        </div>

        <SearchBar searchTerm={searchTerm} onSearchChange={setSearchTerm} />

        <SupplyTable
          supplies={filteredSupplies}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />

        <SupplyModal
          isOpen={isModalOpen}
          supply={currentSupply}
          onClose={() => {
            setIsModalOpen(false);
            setCurrentSupply(null);
          }}
          onSave={handleSave}
        />
      </div>
    </div>
  );
};

export default Supplies;
