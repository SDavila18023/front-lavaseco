import { Navigate } from "react-router-dom";

const AdminProtectedRoute = ({ children }) => {
  // Opción 1: Verificar si existe un objeto userData en sessionStorage
  const userData = sessionStorage.getItem("userData");
  let isAdmin = false;
  
  if (userData) {
    try {
      const parsedUserData = JSON.parse(userData);
      if (parsedUserData.email === "admin@admin") {
        isAdmin = true;
      }
    } catch (e) {
      console.error("Error parsing userData:", e);
    }
  }
  
  // Opción 2: Verificar el token JWT si userData no contiene la información necesaria
  if (!isAdmin) {
    const token = sessionStorage.getItem('login.exito.token');
    if (token) {
      try {
        // Extraer y decodificar la parte payload del token
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        
        const payload = JSON.parse(jsonPayload);
        
        // Verificar si el email o algún campo de rol en el payload indica que es admin
        if (payload.email === "admin@admin" || payload.role === "admin" || payload.isAdmin === true) {
          isAdmin = true;
        }
      } catch (e) {
        console.error("Error decoding token:", e);
      }
    }
  }

  // Redirigir si no es administrador
  return isAdmin ? children : <Navigate to="/" />;
};

export default AdminProtectedRoute;