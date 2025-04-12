import React, { useState, useEffect } from 'react';
import { Trash2, UserPlus, Search, AlertCircle, Users, Loader } from 'lucide-react';
import axios from 'axios';
import AddUserModal from './AddUserModal';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  
  const API_URL = import.meta.env.VITE_API_URL;

  // Cargar usuarios
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await axios.get(`${API_URL}/api/user/`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('userData')).token}`
        }
      });
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError('No fue posible cargar los usuarios. Por favor, intente nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Filtrar usuarios por término de búsqueda
  const filteredUsers = users.filter(user => 
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.role?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Agregar usuario
  const handleAddUser = async (newUserData) => {
    try {
      const response = await axios.post(`${API_URL}/api/user/register`, newUserData, {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('userData')).token}`
        }
      });
      
      setUsers([...users, response.data]);
      setIsModalOpen(false);
      fetchUsers();
    } catch (err) {
      console.error('Error adding user:', err);
      alert('No fue posible agregar el usuario. Por favor, intente nuevamente.');
    }
  };

  // Eliminar usuario
  const handleDeleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/user/${id}`, {
        headers: {
          Authorization: `Bearer ${JSON.parse(sessionStorage.getItem('userData')).token}`
        }
      });
      
      setUsers(users.filter(user => user.id_usuario !== id));
      setDeleteConfirmation(null);
    } catch (err) {
      console.error('Error deleting user:', err);
      alert('No fue posible eliminar el usuario. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Cabecera */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div className="flex items-center mb-4 md:mb-0">
          <Users className="h-8 w-8 text-purple-600 mr-2" />
          <h1 className="text-2xl font-bold text-purple-800">Administración de Usuarios</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Buscador */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
              placeholder="Buscar usuarios..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          {/* Botón Agregar */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-300"
          >
            <UserPlus className="h-4 w-4 mr-2" />
            Agregar Usuario
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader className="h-8 w-8 text-purple-600 animate-spin" />
          <span className="ml-2 text-lg text-purple-600">Cargando usuarios...</span>
        </div>
      ) : (
        <>
          {/* Lista vacía */}
          {users.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-8 text-center">
              <AlertCircle className="h-12 w-12 text-purple-500 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No hay usuarios</h3>
              <p className="mt-2 text-sm text-gray-500">
                Empieza agregando un nuevo usuario con el botón "Agregar Usuario".
              </p>
            </div>
          ) : (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Usuario
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Rol
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredUsers.map(user => (
                    <tr key={user.id_usuario} className="hover:bg-purple-50 transition-colors duration-150">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="text-purple-800 font-medium">
                              {user.email?.substring(0, 2).toUpperCase() || '??'}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{user.name}</div>
                            <div className="text-sm text-gray-500">{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                          ${user.rol === 'admin' ? 'bg-purple-100 text-purple-800' : 
                            user.rol === 'user' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'}`}
                        >
                          {user.rol || 'user'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        {deleteConfirmation === user.id ? (
                          <div className="flex justify-end items-center space-x-2">
                            <button
                              onClick={() => handleDeleteUser(user.id_usuario)}
                              className="text-white bg-red-500 hover:bg-red-700 px-2 py-1 rounded text-xs transition-colors duration-200"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => setDeleteConfirmation(null)}
                              className="text-gray-700 bg-gray-200 hover:bg-gray-300 px-2 py-1 rounded text-xs transition-colors duration-200"
                            >
                              Cancelar
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setDeleteConfirmation(user.id)}
                            className="text-red-500 hover:text-red-800 transition-colors duration-200"
                            disabled={user.email === 'admin@admin'}
                            title={user.email === 'admin@admin' ? 'No se puede eliminar el administrador' : 'Eliminar usuario'}
                          >
                            <Trash2 className={`h-5 w-5 ${user.email === 'admin@admin' ? 'opacity-30' : ''}`} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              
              {/* Mensaje de lista filtrada vacía */}
              {filteredUsers.length === 0 && searchTerm && (
                <div className="text-center py-6">
                  <p className="text-gray-500">No se encontraron usuarios que coincidan con "{searchTerm}"</p>
                </div>
              )}
              
              {/* Resumen */}
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Mostrando <span className="font-medium">{filteredUsers.length}</span> de{" "}
                      <span className="font-medium">{users.length}</span> usuarios
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
      
      {/* Modal para agregar usuario (componente separado) */}
      <AddUserModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAddUser={handleAddUser}
      />
    </div>
  );
};

export default UserList;