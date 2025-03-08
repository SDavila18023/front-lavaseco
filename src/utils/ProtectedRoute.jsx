import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userData = sessionStorage.getItem("userData");

  return userData ? children : <Navigate to="/" />;
};

export default ProtectedRoute;
