import React from "react";
import BillingTable from "../components/Billing/BillingTable";
import Header from "../components/Header/Header";
import { useNavigate } from "react-router-dom";
import CreateInvoiceModal from "../components/Billing/CreateBill";
import CreateBill from "../components/Billing/CreateBill";

const BillingPage = () => {
  const navigate = useNavigate();
  const handleLogout = () => {
    sessionStorage.removeItem("userData");
    navigate("/");
  };
 


  return (
    <>
      <Header onLogout={handleLogout} />
      <CreateBill />
      <BillingTable />
    </>
  );
};

export default BillingPage;
