import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    console.log(API_URL)
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Por favor ingresa email y contraseña.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/api/user/login`,
        {
          email,
          password,
        }
      );

      const data = response.data;

      sessionStorage.setItem("userData", JSON.stringify(data));
      console.log("Login exitoso:", data);
      navigate("/home");
    } catch (err) {
      setError(err.response?.data?.message || "Error al iniciar sesión");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-purple-50">
      {/* Left Side - Image with animation */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8 transform transition-all duration-500 hover:scale-105">
        <img
          src="https://i.imgur.com/esKP4yV.png"
          alt="Login"
          className="max-w-full h-auto rounded-2xl shadow-2xl hover:shadow-purple-200"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-2xl shadow-lg transform transition-all duration-300 hover:shadow-purple-200">
          {/* Header with animation */}
          <div className="text-center transform transition-all duration-300 hover:scale-105">
            <h2 className="text-4xl font-bold text-purple-600 mb-2">
              Bienvenido
            </h2>
            <p className="text-purple-400 text-lg">Ingresa tus datos</p>
          </div>

          {/* Error Message with animation */}
          {error && (
            <div className="bg-red-50 text-red-500 p-4 rounded-lg text-sm animate-bounce">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email Input */}
            <div className="transform transition-all duration-300 hover:-translate-y-1">
              <input
                type="email"
                placeholder="Usuario"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all duration-300 hover:border-purple-200"
              />
            </div>

            {/* Password Input */}
            <div className="relative transform transition-all duration-300 hover:-translate-y-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 border-2 border-purple-100 rounded-xl focus:ring-2 focus:ring-purple-300 focus:border-purple-300 outline-none transition-all duration-300 hover:border-purple-200"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-purple-400 hover:text-purple-600 transition-colors duration-300"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {/* Submit Button with hover animation */}
            <button
              type="submit"
              className="w-full bg-purple-500 text-white py-3 px-4 rounded-xl hover:bg-purple-600 transform transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-purple-200 font-medium"
            >
              Iniciar Sesión
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
