import React from "react";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import UserList from "../components/Admin/UserList";

const AdminPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    navigate("/");
  };

  return (
    <>
      <Header onLogout={handleLogout} />
      <UserList />
    </>
  );
};

export default AdminPage;
