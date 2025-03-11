import React, { useState, useEffect } from "react";
import { LogOut, Menu, User, Settings, HelpCircle, X, Users } from "lucide-react";
import { Link } from "react-router-dom";

const Header = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  
  // Verificar si el usuario es administrador usando sessionStorage
  useEffect(() => {
    const userEmail = JSON.parse(sessionStorage.getItem('userData')).email;
    console.log(userEmail);
    
    if (userEmail === "admin@admin") {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, []);

  return (
    <header className="bg-white shadow-purple-100 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link to="/home">
              <img
                src="https://i.imgur.com/esKP4yV.png"
                alt="Logo"
                className="h-50 w-20 transform transition-transform duration-300 hover:scale-105"
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-4">
            {/* Botón de Administración de Usuarios (solo visible para admin) */}
            {isAdmin && (
              <Link
                to="/admin/users"
                className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-2 transition-colors duration-300"
              >
                <Users className="w-4 h-4" />
                Administración de Usuarios
              </Link>
            )}
            
            <button
              onClick={onLogout}
              className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-800 flex items-center gap-2 transition-colors duration-300"
            >
              <LogOut className="w-4 h-4" />
              Cerrar Sesión
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-purple-600 hover:text-purple-800 hover:bg-purple-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-purple-500"
              aria-expanded="false"
            >
              <span className="sr-only">Abrir menú</span>
              {isMobileMenuOpen ? (
                <X className="block h-6 w-6" />
              ) : (
                <Menu className="block h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-purple-50">
            <div className="rounded-md py-2 px-3">
              {/* Botón de Administración de Usuarios en móvil (solo visible para admin) */}
              {isAdmin && (
                <div className="text-center mb-4">
                  <Link
                    to="/admin/users"
                    className="w-full px-4 py-2 font-medium text-purple-600 bg-white rounded-md shadow-sm hover:bg-purple-100 flex items-center justify-center gap-2 transition-colors duration-300"
                  >
                    <Users className="w-4 h-4" />
                    Administración de Usuarios
                  </Link>
                </div>
              )}
              
              <div className="text-center mb-4">
                <button
                  onClick={onLogout}
                  className="w-full px-4 py-2 font-medium text-purple-600 bg-white rounded-md shadow-sm hover:bg-purple-100 flex items-center justify-center gap-2 transition-colors duration-300"
                >
                  <LogOut className="w-4 h-4" />
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;